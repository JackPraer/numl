import { ICONS_PROVIDER } from './settings';

let loader = (name, type = 'outline', provider) => {
  switch (provider || ICONS_PROVIDER) {
    case 'feather':
      return import('feather-icons')
        .then(feather => feather.icons[name].toSvg());
    case 'eva':
      return import('eva-icons/eva-icons.json')
        .then(icons => {
          const isOutline = type === 'outline';

          name = type === 'outline' ? `${name}-outline` : name;

          const contents = icons[name];


          if (contents) {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">${contents}</svg>`
          }

          return '';
        });
  }

  return Promise.resolve('');
}

// <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon" name="moon" style="opacity: 0;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>

const Icons = {
  load(name, type) {
    return loader(name, type);
  },
  setLoader(_loader) {
    loader = _loader;
  }
}

export default Icons;
