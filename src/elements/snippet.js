import NuElement from './element';
import { error } from '../helpers';
import { applyTheme, generateReferenceColor } from '../themes';

let themesDeclared = false;

const KEYWORD_RE = /^(a(bstract|lias|nd|rguments|rray|s(m|sert)?|uto)|b(ase|egin|ool(ean)?|reak|yte)|c(ase|atch|har|hecked|lass|lone|ompl|onst|ontinue)|de(bugger|cimal|clare|f(ault|er)?|init|l(egate|ete)?)|do|double|e(cho|ls?if|lse(if)?|nd|nsure|num|vent|x(cept|ec|p(licit|ort)|te(nds|nsion|rn)))|f(allthrough|alse|inal(ly)?|ixed|loat|or(each)?|riend|rom|unc(tion)?)|global|goto|guard|i(f|mp(lements|licit|ort)|n(it|clude(_once)?|line|out|stanceof|t(erface|ernal)?)?|s)|l(ambda|et|ock|ong)|m(odule|utable)|NaN|n(amespace|ative|ext|ew|il|ot|ull)|o(bject|perator|r|ut|verride)|p(ackage|arams|rivate|rotected|rotocol|ublic)|r(aise|e(adonly|do|f|gister|peat|quire(_once)?|scue|strict|try|turn))|s(byte|ealed|elf|hort|igned|izeof|tatic|tring|truct|ubscript|uper|ynchronized|witch)|t(emplate|hen|his|hrows?|ransient|rue|ry|ype(alias|def|id|name|of))|u(n(checked|def(ined)?|ion|less|signed|til)|se|sing)|v(ar|irtual|oid|olatile)|w(char_t|hen|here|hile|ith)|xor|yield)$/;
const COM = 'com';
const KEY = 'key';
const NAM = 'nam';
const NUM = 'num';
const PCT = 'pct';
const REX = 'rex';
const SPC = 'spc';
const STR = 'str';
const UNK = 'unk';
const PLS = 'pls';
const MNS = 'mns';
const MRK = 'mrk';
const IMP = 'imp';

export default class NuCode extends NuElement {
  static get nuTag() {
    return 'nu-code';
  }

  static get nuThemes() {
    return {
      [COM]: {
        saturation: 0,
        contrast: 'soft',
      },
      [SPC]: { skip: true },
      [NAM]: { skip: true },
      [KEY]: {
        hue: 240,
      },
      [NUM]: {
        hue: 280,
        saturation: '80p',
      },
      [PCT]: {
        hue: 1,
        saturation: 0,
        contrast: 'strong',
      },
      [REX]: {
        hue: 340,
        saturation: '80p',
      },
      [STR]: {
        hue: 180,
      },
      [UNK]: {
        hue: 240,
        saturation: 0,
      },
      [PLS]: {
        hue: 180,
      },
      [MNS]: {
        hue: 1,
      },
      [MRK]: {
        hue: 240,
        type: 'toned',
        lightness: 'bold',
      },
      [IMP]: {
        hue: 1,
        type: 'special',
        lightness: 'dim',
        saturation: '80p',
      }
    };
  }

  static get nuDefaults() {
    return {
      display: 'block',
      radius: '1x',
      fill: '',
      text: 'monospace',
    };
  }

  static nuCSS({ tag, css }) {
    return `
      ${css}
      ${tag} nu-block {
        white-space: pre;
      }
      ${tag} textarea {
        display: none;
      }
      ${tag} nu-el {
        display: inline !important;
      }
      ${tag}[inline]:not([fill]) {
        background-color: var(--nu-subtle-color);
      }
      ${tag}[inline]:not([padding]) {
        padding: .25em;
      }
      ${tag} nu-el[plus]::before {
        content: '+ ';
        display: inline-block;
      }
      ${tag} nu-el[minus]::before {
        content: '- ';
        display: inline-block;
      }
      ${tag} nu-el[number]::before {
        content: '1. ';
        display: inline-block;
      }
      ${tag} nu-el[fill] {
        border-radius: var(--nu-border-radius);
        padding: .25em;
      }
    `;
  }

  nuConnected() {
    super.nuConnected();

    if (!themesDeclared) {
      themesDeclared = true;
      declareThemes(this.constructor);
    }

    setTimeout(() => {
      const textarea = this.querySelector('textarea');

      if (!textarea) {
        error('nu-snippet: textarea tag required');
      }

      const container = document.createElement('nu-block');

      this.appendChild(container);

      this.nuObserve = () => {
        container.innerHTML = textToMarkup(textarea.textContent, this.hasAttribute('numerate'));
      };

      const observer = new MutationObserver(() => this.nuObserve());

      observer.observe(textarea, {
        characterData: false,
        attributes: false,
        childList: true,
        subtree: false
      });

      this.nuSetDisconnectedHook(() => {
        observer.disconnect();
      });

      this.nuObserve();
    });
  }
}

const TOKEN_RES = [
  [MRK, /#\[\[.+?]]#/],
  [IMP, /!\[\[.+?]]!/],
  [PLS, /(^|\n)\+\s.+($|\n)/],
  [MNS, /(^|\n)-\s.+($|\n)/],
  [NUM, /#([0-9a-f]{6}|[0-9a-f]{3})\b/],
  [COM, /(\/\/|#).*?(?=\n|$)/],
  [COM, /\/\*[\s\S]*?\*\//],
  [COM, /<!--[\s\S]*?-->/],
  [REX, /\/(\\\/|[^\n])*?\//],
  [STR, /(['"`])(\\\1|[\s\S])*?\1/],
  [NUM, /[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?/],
  [PCT, /[\\.,:;+\-*\/=<>()[\]{}|?!&@~]/],
  [SPC, /\s+/],
  [NAM, /[\w$]+/],
  [UNK, /./]
];

function tokenize(text) {
  const tokens = [];
  const len = TOKEN_RES.length;

  let prefer_div_over_re = false;

  while (text) {
    for (let i = 0; i < len; i += 1) {
      let m = TOKEN_RES[i][1].exec(text);
      if (!m || m.index !== 0) {
        continue;
      }

      let cls = TOKEN_RES[i][0];
      if (cls === REX && prefer_div_over_re) {
        continue;
      }

      let tok = m[0];

      if (cls === NAM && KEYWORD_RE.test(tok)) {
        cls = KEY;
      }
      if (cls === SPC) {
        if (tok.indexOf('\n') >= 0) {
          prefer_div_over_re = false;
        }
      } else {
        prefer_div_over_re = cls === NUM || cls === NAM;
      }

      text = text.slice(tok.length);
      tokens.push([cls, tok]);
      break;
    }
  }

  return tokens;
}

const SYMBOL_MAP = {
  pls: '+',
  mns: '+',
};

const ATTR_MAP = {
  pls: 'plus',
  mns: 'minus',
};

function textToMarkup(str, numerate) {
  const lines = str.split('\n');

  if (lines[0] && !lines[0].trim()) {
    lines.splice(0, 1);
  }

  if (lines[lines.length - 1] && !lines[lines.length - 1].trim()) {
    lines.splice(-1, 1);
  }

  const firstLine = lines
    .find(line => line.trim().length);

  if (!firstLine) return;

  const tab = firstLine.match(/^\s*/)[0];

  if (tab) {
    str = lines.map(str => str.replace(tab, '')).join('\n');
  }

  let number = 0;

  let numSize = 2;

  const tokens = tokenize(str);

  if (numerate) {
    let linesNum = 1;

    tokens.forEach(token => {
      if (token[0] === 'spc') {
        const match = token[1].match(/\n/g);

        if (match) {
          linesNum += match.length;
        }
      }
    });

    numSize = 1 + String(linesNum).length;
  }

  function getNumber(firstLine) {
    const numSpaces = ' '.repeat(numSize - String(number + 1).length);

    return `${!firstLine ? '\n' : ''}<nu-el theme="snippet-com" before="${++number}.${numSpaces}"></nu-el>`;
  }

  return tokens.reduce(function (html, token) {
    let id = token[0];
    let attr = ATTR_MAP[id] ? ` ${ATTR_MAP[id]}` : '';
    let value = SYMBOL_MAP[id] ? token[1].slice(2) : token[1];

    if (numerate && id === SPC) {
      value = value.replace(/\n/g, s => getNumber());
    }

    if (id === MRK || id === IMP) {
      value = value.replace(/([!#]\[\[|]][!#])/g, '');
    }

    return html + `<nu-el theme="snippet-${token[0]}"${attr}${NuCode.nuThemes[id].type ? ' fill' : ''}>${value}</nu-el>`;
  }, numerate ? getNumber(true) : '');
}

function declareThemes(cls) {
  Object.entries(cls.nuThemes).forEach(([id, { hue, type, saturation, contrast, lightness, skip }]) => {
    if (skip) return;

    const name = `snippet-${id}`;

    applyTheme(document.body, {
      color: generateReferenceColor({
        hue: hue != null ? String(hue) : '240',
        saturation: saturation != null ? String(saturation) : '100p'
      }),
      name,
      type: type || 'tint',
      lightness: lightness || 'normal',
      contrast: contrast || 'normal',
    }, name);
  });
}
