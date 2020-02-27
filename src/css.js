import { devMode, log, warn } from "./helpers";

export const STYLE_MAP = {};
const testEl = document.createElement('div');

[...document.querySelectorAll('style[data-nu-name]')]
  .forEach(element => {
    const name = element.dataset.nuName.replace(/&quot;/g, '"');

    if (!name.includes('#')) {
      STYLE_MAP[name] = {
        element: element,
        css: element.textContent,
        selector: name,
      };
    }
  });

export function injectStyleTag(css, name, root) {
  css = css || '';

  if (devMode) {
    css = beautifyCSS(css);
  }

  const style = document.createElement('style');

  if (name) {
    style.dataset.nuName = name;
  }

  style.appendChild(document.createTextNode(css));

  (root || document.head).appendChild(style);

  return style;
}

export function attrsQuery(attrs) {
  return Object.keys(attrs)
    .reduce((query, attr) => {
      const val = attrs[attr];

      return `${query}${val != null ? `[${attr}="${val}"]` : `:not([${attr}])`}`
    }, '');
}

export function stylesString(styles) {
  if (devMode) {
    Object.keys(styles)
      .forEach(style => {
        if (!styles[style]) {
          delete styles[style];

          return;
        }

        const value = String(styles[style]);

        if (value
          && !style.startsWith('-')
          && !CSS.supports(style, value.replace('!important', ''))
          && !value.endsWith('-reverse')) {
          warn('unsupported style detected:', `{ ${style}: ${value}; }`);
        }
      });
  }

  return Object.keys(styles)
    .reduce((string, style) => `${string}${styles[style] ? `${style}:${styles[style]}` : ''};`, '');
}

const TOUCH_REGEXP = /:hover(?!\))/; // |\[nu-active](?!\))
const NON_TOUCH_REGEXP = /:hover(?=\))/;

export function generateCSS(query, styles, context = '', universal = false) {
  if (!styles || !styles.length) return;

  return styles.map(map => {
    let currentQuery = query;

    if (map.$suffix) {
      currentQuery += map.$suffix;
    }

    if (map.$prefix) {
      if (currentQuery.startsWith('#')) {
        const index = currentQuery.indexOf(' ');

        currentQuery = `${currentQuery.slice(0, index)} ${map.$prefix} ${currentQuery.slice(index)}`;
      } else {
        currentQuery = `${map.$prefix} ${currentQuery}`;
      }
    }

    delete map.$suffix;
    delete map.$prefix;

    if (!universal) {
      if (currentQuery.match(TOUCH_REGEXP)) {
        return `@media (hover: hover){${context}${currentQuery}{${stylesString(map)}}}`;
      } else if (currentQuery.match(NON_TOUCH_REGEXP)) {
        return `
        @media (hover: hover){${context}${currentQuery}{${stylesString(map)}}}
        @media (hover: none){${context}${currentQuery.replace(':not(:hover)', '')}{${stylesString(map)}}}
      `;
      }
    }

    return `${context}${currentQuery}{${stylesString(map)}}`;
  }).join('\n');
}

export function parseStyles(str) {
  return str
    .split(/;/g)
    .map(s => s.trim())
    .filter(s => s)
    .map(s => s.split(':'))
    .reduce((st, s) => {
      st[s[0]] = s[1].trim();
      return st;
    }, {});
}

export function injectCSS(name, selector, css, root) {
  const element = injectStyleTag(css, name, root);

  const styleMap = getRootStyleMap(root);

  if (devMode) {
    try {
      testEl.querySelector(selector);
    } catch (e) {
      warn('invalid selector detected', selector, css);
    }
  }

  if (styleMap[name]) {
    const el = styleMap[name].element;

    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  styleMap[name] = {
    selector,
    css,
    element,
  };

  return styleMap[name];
}

export function cleanCSSByPart(selectorPart) {
  log('clean css by part', selectorPart);
  const isRegexp = selectorPart instanceof RegExp;
  const keys = Object.keys(STYLE_MAP).filter(selector => isRegexp
    ? selector.match(selectorPart) : selector.includes(selectorPart));

  keys.forEach(key => {
    removeCSS(key);
    log('css removed:', key)
  });
}

export function removeCSS(name, root) {
  let styleMap = getRootStyleMap(root);

  if (!styleMap[name]) return;

  const el = styleMap[name].element;

  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }

  delete styleMap[name];
}

function getRootStyleMap(root) {
  let styleMap = STYLE_MAP;

  if (root) {
    if (!root.nuStyleMap) {
      root.nuStyleMap = {};
    }

    styleMap = root.nuStyleMap;
  }

  return styleMap;
}

export function hasCSS(name, root) {
  let styleMap = getRootStyleMap(root);

  return !!styleMap[name];
}

export function transferCSS(name, root) {
  const cssMap = STYLE_MAP[name];

  const content = cssMap.element.textContent;

  log('transfer styles to the shadow root:', JSON.stringify(name), root);

  return injectCSS(name, cssMap.selector, content, root);
}

/**
 * Very fast css beautification without parsing.
 * Do not support media queries
 * Use in Dev Mode only!
 * @param css
 * @returns {string}
 */
export function beautifyCSS(css) {
  let flag = false;

  return css.replace(/[{;}](?!$)/g, s => s + '\n')
    .split(/\n/g)
    .map(s => s.trim())
    .filter(s => s)
    .map(s => {
      if (!s.includes('{') && !s.includes('}') && flag) {
        if (s.includes(':')) {
          s = s.replace(/:(?!\s)(?!not\()(?!:)/, ': ');
          return `  ${s}`;
        }

        return `    ${s}`;
      }

      if (s.includes('{')) {
        flag = true;
      } else if (s.includes('}')) {
        flag = false;
      }

      return s;
    }).join('\n');
}

const globalCSS = `
body {
  --nu-base: 16px;
  --nu-pixel: 1px;

  --nu-radius: 0.5rem;
  --nu-gap: 0.5rem;
  --nu-border-width: 1px;
  --nu-animation-time: 0.08s;
  --nu-inline-offset: -.15em;

  --nu-font-size: 1rem;
  --nu-line-height: 1.5rem;
}

body:not(.nu-prevent-defaults) {
  line-height: 1rem;
}

body:not(.nu-prevent-defaults) > *:not([size]) {
  line-height: 1.5rem;
}

.nu-defaults, body:not(.nu-prevent-defaults) {
  margin: 0;
  padding: 0;
  font-family: 'Avenir Next', 'Avenir', Helvetica, Ubuntu, 'DejaVu Sans', Arial, sans-serif;
  font-size: var(--nu-base);
  color: var(--nu-text-color);
  background-color: var(--nu-subtle-color);
  font-weight: 400;
  word-spacing: calc(1rem / 8);
  min-height: 100vh;
  text-align: left;
  text-size-adjust: none;
  -webkit-text-size-adjust: none;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color var(--nu-animation-time) linear;
}

.nu-defaults:not(body) {
  line-height: 1.5rem;
}

@media (prefers-color-scheme: dark) {
  html:not(.nu-scheme-dark) .nu-dark-invert {
    filter: invert(100%) hue-rotate(180deg);
  }

  html:not(.nu-scheme-dark) .nu-dark-dim {
    filter: invert(5%);
  }
}

html.nu-scheme-dark .nu-dark-invert {
  filter: invert(95%) hue-rotate(180deg);
}

html.nu-scheme-dark .nu-dark-dim {
  filter: invert(5%);
}

@media (prefers-reduced-motion: reduce) {
  .nu-reduce-motion [nu], body {
    transition: initial !important;
  }
}

html.nu-reduce-motion [nu], html.nu-reduce-motion body,
html.nu-reduce-motion-force [nu], html.nu-reduce-motion-force body {
  --nu-animation-time: 0s;
  transition: initial !important;
}

[nu-hidden] {
  display: none !important;
}
`;

injectStyleTag(globalCSS, 'nu-defaults');
