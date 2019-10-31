import {
  mixColors,
  invertColor,
  toKebabCase,
  extractColor,
  generalizeColor,
  getLuminance,
  contrastRatio,
  convertUnit,
  setAlphaChannel
} from "./helpers";
import { THEME_COLOR_ATTRS_LIST, THEME_SCHEME_ATTRS } from "./attrs";

export function isColorScheme(themeName) {
  return themeName.endsWith('-dark') || themeName.endsWith('-light');
}

export function getMainThemeName(themeName) {
  return themeName.replace('-dark', '').replace('-light', '');
}

export function convertThemeName(theme, name) {
  const colorScheme = isColorScheme(name);

  return Object.keys(theme).reduce((map, style) => {
    if (colorScheme && THEME_SCHEME_ATTRS.includes(style)) return map;

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
    minorColor: generalizeColor(props.minorColor),
    minorBackgroundColor: generalizeColor(props.minorBackgroundColor),
    borderRadius: convertUnit(props.borderRadius || parentProps.borderRadius),
    padding: convertUnit(props.padding || parentProps.padding),
    borderWidth: convertUnit(props.borderWidth || parentProps.borderWidth),
    shadowColor: generalizeColor(props.shadowColor || parentProps.shadowColor),
    specialContrastColor: props.specialContrastColor,
    // Use parent shadow intensity value only if both shadow color and shadow intensity
    // are not specified in the props
    shadowIntensity: props.shadowIntensity || (!props.shadowColor && parentProps.shadowIntensity),
    focusColor: generalizeColor(props.focusColor),
    headingColor: generalizeColor(props.headingColor),
    hoverColor: generalizeColor(props.hoverColor),
    specialHoverColor: generalizeColor(props.specialHoverColor),
    animationTime: props.animationTime || parentProps.animationTime,
    subtleColor: props.subtleColor,
  };

  lightTheme.specialContrastColor = lightTheme.specialContrastColor
    || (contrastRatio(lightTheme.specialColor, lightTheme.backgroundColor) * 1.5 > contrastRatio(lightTheme.specialColor, lightTheme.color)
      ? lightTheme.backgroundColor : lightTheme.color);

  let darkTheme;

  if (getLuminance(lightTheme.color) < getLuminance(lightTheme.backgroundColor)) {
    darkTheme = Object.keys(lightTheme)
      .reduce((vars, varName) => {
        if ((THEME_COLOR_ATTRS_LIST.includes(toKebabCase(varName)))
          && lightTheme[varName]
          && varName !== 'shadowColor') {
          vars[varName] = generalizeColor(darkProps[varName]) || invertColor(lightTheme[varName], 32);
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
    }

    darkTheme.specialContrastColor = generalizeColor(darkProps.specialContrastColor)
      || (contrastRatio(darkTheme.specialColor, lightTheme.backgroundColor) * 1.5 > contrastRatio(darkTheme.specialColor, lightTheme.color)
        ? lightTheme.backgroundColor : lightTheme.color);
  } else {
    darkTheme = { ...lightTheme };
  }

  return [lightTheme, darkTheme].map((theme, i) => {
    Object.assign(theme, {
      shadowIntensity: Number(theme.shadowIntensity
        || extractColor(theme.shadowColor)[3]),
      minorColor: theme.minorColor
        || mixColors(mixColors(theme.color, theme.specialColor, .2), theme.backgroundColor, .2),
      minorBackgroundColor: theme.minorBackgroundColor
        || mixColors(mixColors(theme.backgroundColor, theme.specialColor, .05), theme.color, .05),
      subtleColor: theme.subtleColor
        || mixColors(mixColors(theme.backgroundColor, theme.specialColor, .02), theme.color, .01),
      focusColor: theme.focusColor
        || mixColors(theme.specialColor, theme.backgroundColor),
      headingColor: theme.headingColor
        || (getLuminance(lightTheme.backgroundColor) > getLuminance(lightTheme.color)
          ? mixColors(theme.color, theme.backgroundColor, .1)
          : theme.color),
      hoverColor: setAlphaChannel(theme.hoverColor
        || theme.specialColor, .1),
      specialHoverColor: setAlphaChannel(theme.specialHoverColor
        || theme.specialContrastColor, .075),
    });

    const shadowIntensity = Math.min(Number(theme.shadowIntensity), 1);

    theme.shadowOpacity = Math.min(shadowIntensity
      * (.7 - getLuminance(theme.backgroundColor) * .5) * 5, 1);
    theme.specialShadowOpacity = Math.min(shadowIntensity
      * (.7 - getLuminance(theme.specialColor) * .5) * 5, 1);

    // if dark mode
    if (i && getLuminance(theme.specialContrastColor) > .9) {
      theme.specialColor = mixColors(theme.specialColor, 'rgb(0, 0, 0)', .1);
      theme.specialContrastColor = mixColors(theme.specialContrastColor, 'rgb(0, 0, 0)', .1);
    }

    theme.specialMinorColor = theme.specialMinorColor
        || mixColors(theme.specialContrastColor, theme.specialColor, .2);

    return Object.keys(theme).reduce((map, propName) => {
      map[`--nu-theme-${toKebabCase(propName)}`] = theme[propName];

      return map;
    }, {});
  });
}
