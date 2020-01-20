const STYLE_MAP = {
  shadow: 'depth',
  border: 'stroke',
  toggle: 'toggle',
};

export default {
  attrs: ['shadow', 'border', 'toggle'],
  generator(attrs, allAttrs) {
    if (!attrs.length) return;

    return {
      'box-shadow': allAttrs
        .filter(attr => attrs.includes(attr))
        .map((attr) => `var(--nu-local-${STYLE_MAP[attr]}-shadow)`)
        .join(', '),
    };
  },
}
