# `<nu-table/>` element

## Base info
* Parent: [`<nu-el/>`](./nu-el.md)
* Type: `element`
* Role: `table`


## Own default values
* **[border]** `style`: `"1x"`
* **[display]** `style`: `"table"`
* **[gap]** `style`: `""`
* **[padding]** `style`: `""`

## Inherited default values
* **[sizing]** `style`: `"border"`


## Own attributes
* **border** `style`
* **gap** `style`
* **padding** `style`
* **radius** `style`


## Inherited attributes
* **[`[activedescendant]`](../attributes/activedescendant.md)** `aria`
* **[`[area]`](../attributes/area.md)** `style`
* **[`[areas]`](../attributes/areas.md)** `style`
* **[`[as]`](../attributes/as.md)** `helper`
* **[`[basis]`](../attributes/basis.md)** `style`
* **[`[color]`](../attributes/color.md)** `style`
* **[`[column]`](../attributes/column.md)** `style`
* **[`[columns]`](../attributes/columns.md)** `style`
* **[`[content]`](../attributes/content.md)** `style`
* **[`[controls]`](../attributes/controls.md)** `aria`
* **[`[cursor]`](../attributes/cursor.md)** `style`
* **[`[describedby]`](../attributes/describedby.md)** `aria`
* **[`[display]`](../attributes/display.md)** `style`
* **[`[expanded]`](../attributes/expanded.md)** `aria`
* **[`[fill]`](../attributes/fill.md)** `style`
* **[`[flow]`](../attributes/flow.md)** `style`
* **[`[flowto]`](../attributes/flowto.md)** `aria`
* **[`[grow]`](../attributes/grow.md)** `style`
* **[`[haspopup]`](../attributes/haspopup.md)** `aria`
* **[`[height]`](../attributes/height.md)** `style`
* **[`[hide]`](../attributes/hide.md)** `style`
* **[`[id]`](../attributes/id.md)** `style`
* **[`[image]`](../attributes/image.md)** `style`
* **[`[interactive]`](../attributes/interactive.md)** `style`
* **[`[items]`](../attributes/items.md)** `style`
* **[`[items-basis]`](../attributes/items-basis.md)** `style`
* **[`[items-grow]`](../attributes/items-grow.md)** `style`
* **[`[items-padding]`](../attributes/items-padding.md)** `style`
* **[`[items-radius]`](../attributes/items-radius.md)** `style`
* **[`[items-shrink]`](../attributes/items-shrink.md)** `style`
* **[`[label]`](../attributes/label.md)** `aria`
* **[`[labelledby]`](../attributes/labelledby.md)** `aria`
* **[`[opacity]`](../attributes/opacity.md)** `style`
* **[`[order]`](../attributes/order.md)** `style`
* **[`[overflow]`](../attributes/overflow.md)** `style`
* **[`[owns]`](../attributes/owns.md)** `aria`
* **[`[place]`](../attributes/place.md)** `style`
* **[`[posinset]`](../attributes/posinset.md)** `aria`
* **[`[responsive]`](../attributes/responsive.md)** `style`
* **[`[row]`](../attributes/row.md)** `style`
* **[`[rows]`](../attributes/rows.md)** `style`
* **[`[setsize]`](../attributes/setsize.md)** `aria`
* **[`[shadow]`](../attributes/shadow.md)** `style`
* **[`[shrink]`](../attributes/shrink.md)** `style`
* **[`[size]`](../attributes/size.md)** `style`
* **[`[sizing]`](../attributes/sizing.md)** `style`
* **[`[space]`](../attributes/space.md)** `style`
* **[`[text]`](../attributes/text.md)** `style`
* **[`[theme]`](../attributes/theme.md)** `helper`
* **[`[transform]`](../attributes/transform.md)** `style`
* **[`[transition]`](../attributes/transition.md)** `style`
* **[`[valuemax]`](../attributes/valuemax.md)** `aria`
* **[`[valuemin]`](../attributes/valuemin.md)** `aria`
* **[`[valuenow]`](../attributes/valuenow.md)** `aria`
* **[`[width]`](../attributes/width.md)** `style`
* **[`[z]`](../attributes/z.md)** `style`

## Generated CSS
```css
nu-table[hidden] {
  display: none !important;
}
nu-table >  nu-rowgroup:first-child >  nu-row:first-child > * {
  border-top: 0 !important;
}
nu-table >  nu-rowgroup:last-child >  nu-row:last-child > * {
  border-bottom: 0 !important;
}
nu-table >  nu-rowgroup >  nu-row > *:first-child {
  border-left: 0 !important;
}
nu-table > nu-rowgroup > nu-row > *:last-child {
  border-right: 0 !important;
}
nu-table >  nu-rowgroup:first-child >  nu-row:first-child > *:first-child {
  border-top-left-radius: var(--nu-border-radius, var(--nu-theme-border-radius));
}
nu-table >  nu-rowgroup:first-child >  nu-row:first-child > *:last-child {
  border-top-right-radius: var(--nu-border-radius, var(--nu-theme-border-radius));
}
nu-table >  nu-rowgroup:last-child >  nu-row:last-child > *:first-child {
  border-bottom-left-radius: var(--nu-border-radius, var(--nu-theme-border-radius));
}
nu-table >  nu-rowgroup:last-child >  nu-row:last-child > *:last-child {
  border-bottom-right-radius: var(--nu-border-radius, var(--nu-theme-border-radius));
}
```
