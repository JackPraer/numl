export default function moveMixin() {
  return {
    fallbacks: {
      move: {
        transform: 'var(--nu-transform-place)',
      },
      place: {
        transform: 'var(--nu-transform)',
      },
    },
    shared: {
      transform: 'var(--nu-transform-place, translate(0, 0)) var(--nu-transform, translate(0, 0))',
    },
  };
}
