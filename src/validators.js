import { warn } from './helpers';

function extract(promise) {
  return promise.then(module => module.default || module);
}

const VALIDATORS = {
  email: (val) => extract(import('email-validator'))
    .then(validator => validator.validate(val)),
  maxlength: (val, option) => Promise.resolve().then(() => val.length < Number(option)),
  minlength: (val, option) => Promise.resolve().then(() => val.length > Number(option)),
  required: (val) => Promise.resolve().then(() => {
    switch (typeof val) {
      case 'string':
        return val.length > 0;
      case 'number':
        return val === val;
      case 'boolean':
        return true;
      default:
        return val != null;
    }
  }),
};

export function checkErrors(data, checks) {
  const names = Object.keys(checks);

  return Promise.all(
    names
      .map(name => {
        const validators = checks[name];

        if (!validators) return true;

        const checkNames = Object.keys(validators);

        return Promise.all(checkNames
          .map(check => {
            const options = validators[check];
            const validator = VALIDATORS[check];

            if (!validator) {
              warn('unknown validator', check);

              return true;
            }

            // validator(data[name], options).then(result => {
            //   console.log('validation', name, options, result);
            // });

            return validator(data[name], options);
          }))
          .then(results => {
            const valid = results.every(r => r);

            // tell there is no error on prop
            if (valid) {
              // console.log('valid field', name, results);
              return false;
            }

            // console.log('invalid field', name);

            return checkNames.reduce((map, check, i) => {
              if (!results[i]) {
                map[check] = true;
              }

              return map;
            }, {});
          });
      })
  ).then(results => {
    const valid = !results.every(r => r);

    if (valid) return false;

    return names.reduce((map, name, i) => {
      if (results[i]) {
        map[name] = results[i];
      }

      return map;
    }, {});
  });
}

window.checkErrors = checkErrors;

export default VALIDATORS;
