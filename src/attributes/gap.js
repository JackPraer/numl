import { parseAttr } from '../helpers';

const BASE = 'var(--nu-gap)';

/**
 * CSS Gap value. Used for flex and grid layouts.
 * @param val
 * @returns {*}
 */
export default function gapAttr(val) {
  if (val == null) return;

  const { values } = parseAttr(val, true);

  const vGap = values[0] || BASE;
  const hGap = values[1] || vGap;

  const fullVal = values.join(' ') || BASE;

  return [{
    gap: fullVal,
    'grid-gap': fullVal,
    '--nu-local-v-gap': vGap,
    '--nu-local-h-gap': hGap,
    '--nu-local-gap': vGap === hGap ? vGap : null,
  }, {
    $suffix: '>*',
    '--nu-v-gap': vGap,
    '--nu-h-gap': hGap,
  }];
}
