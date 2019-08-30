import {
  mixColors,
  invertColor,
  toKebabCase,
  extractColor,
  generalizeColor,
  getLuminance,
  contastRatio,
  convertUnit,
  setAlphaChannel
} from "./helpers";
import { THEME_COLOR_ATTRS_LIST } from "./attrs";

export function convertThemeName(theme, name) {
  return Object.keys(theme).reduce((map, style) => {
    map[style.replace('theme', name)] = theme[style];

    return map;
  }, {});
}

export function generateTheme(props, darkProps, parentProps) {
  const color = generalizeColor(props.color || parentProps.color);
  const backgroundColor = generalizeColor(props.backgroundColor || parentProps.backgroundColor);
  const specialColor = generalizeColor(props.specialColor || parentProps.specialColor);
  const borderColor = generalizeColor(props.borderColor || parentProps.borderColor);

  const lightTheme = {
    color,
    backgroundColor,
    borderColor,
    specialColor,
    borderRadius: convertUnit(props.borderRadius || parentProps.borderRadius),
    borderWidth: convertUnit(props.borderWidth || parentProps.borderWidth),
    shadowColor: generalizeColor(props.shadowColor || parentProps.shadowColor),
    specialBackgroundColor: props.specialBackgroundColor,
    // Use parent shadow intensity value only if both shadow color and shadow intensity
    // are not specified in the props
    shadowIntensity: props.shadowIntensity || (!props.shadowColor && parentProps.shadowIntensity),
    focusColor: generalizeColor(props.focusColor),
    headingColor: generalizeColor(props.headingColor),
    hoverColor: generalizeColor(props.hoverColor),
    specialHoverColor: generalizeColor(props.specialHoverColor),
    animationTime: props.animationTime || parentProps.animationTime,
  };

  lightTheme.specialBackgroundColor = lightTheme.specialBackgroundColor
    || (contastRatio(lightTheme.specialColor, lightTheme.backgroundColor) > .4
      ? lightTheme.backgroundColor : lightTheme.color);

  let darkTheme;

  if (getLuminance(lightTheme.color) < getLuminance(lightTheme.backgroundColor)) {
    darkTheme = Object.keys(lightTheme)
    .reduce((vars, varName) => {
      if ((THEME_COLOR_ATTRS_LIST.includes(toKebabCase(varName)))
        && lightTheme[varName]
        && varName !== 'shadowColor') {
        vars[varName] = generalizeColor(darkProps[varName]) || invertColor(lightTheme[varName], 40);
      } else {
        vars[varName] = generalizeColor(darkProps[varName]) || lightTheme[varName];
      }

      return vars;
    }, {});

    const specialLightLuminance = getLuminance(lightTheme.specialColor);
    const specialDarkLuminance = getLuminance(darkTheme.specialColor);

    if (specialLightLuminance < specialDarkLuminance && specialLightLuminance > .3
      || specialLightLuminance > specialDarkLuminance && specialDarkLuminance < .3) {
      Object.assign(darkTheme, {
        specialColor: generalizeColor(darkProps.specialColor) || lightTheme.specialColor,
      });

      darkTheme.specialBackgroundColor = generalizeColor(darkProps.specialBackgroundColor)
        || (contastRatio(darkTheme.specialColor, lightTheme.backgroundColor) > .4
          ? lightTheme.backgroundColor : lightTheme.color);
    }
  } else {
    darkTheme = { ...lightTheme };
  }

  return [lightTheme, darkTheme].map(theme => {
    Object.assign(theme, {
      shadowIntensity: Number(theme.shadowIntensity
        || extractColor(theme.shadowColor)[3]),
      focusColor: theme.focusColor
        || mixColors(theme.specialColor, theme.backgroundColor),
      headingColor: theme.headingColor
        || (getLuminance(lightTheme.backgroundColor) > getLuminance(lightTheme.color)
          ? mixColors(theme.color, theme.backgroundColor, .1)
          : theme.color),
      hoverColor: setAlphaChannel(theme.hoverColor
        || theme.specialColor, .1),
      specialHoverColor: setAlphaChannel(theme.specialHoverColor
        || theme.specialBackgroundColor, .1),
    });

    const shadowIntensity = Math.min(Number(theme.shadowIntensity), 1);
    theme.shadowIntensity = Math.min(shadowIntensity
      + (1 - getLuminance(theme.backgroundColor)) * (1 - shadowIntensity), 1);
    theme.specialShadowIntensity = Math.min(shadowIntensity
      + (1 - getLuminance(theme.specialColor)) * (1 - shadowIntensity), 1);

    return Object.keys(theme).reduce((map, propName) => {
      map[`--nu-theme-${toKebabCase(propName)}`] = theme[propName];

      return map;
    }, {});
  });
}
