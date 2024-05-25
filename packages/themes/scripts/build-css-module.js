import * as theme from "../dist/index.js";
import fs from "fs";

const toCssCasting = (str) => {
  return str
    .replace(/([a-z])(\d)/, "$1-$2")
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase();
};

const generateThemeCssVariables = () => {
  const cssString = [];
  Object.entries(theme.vars).forEach(([key, value]) => {
    if (key === "colors") {
      Object.entries(value.$static).forEach(([colorKey, colorValue]) => {
        if (colorKey === "light") {
          const selector = ":root";
          const cssVariables = Object.entries(colorValue)
            .map(([mainKey, mainValue]) =>
              Object.entries(mainValue)
                .map(
                  ([subKey, subValue]) =>
                    `--${toCssCasting(mainKey)}-${toCssCasting(
                      subKey
                    )}: ${subValue};`
                )
                .join("\n")
            )
            .join("\n");
          return cssString.push(`${selector} {${cssVariables}}`);
        }

        if (colorKey === "light") {
          const selector = ":root .theme-dark";
          const cssVariables = Object.entries(colorValue)
            .map(([mainKey, mainValue]) =>
              Object.entries(mainValue)
                .map(
                  ([subKey, subValue]) =>
                    `--${toCssCasting(mainKey)}-${toCssCasting(
                      subKey
                    )}: ${subValue};`
                )
                .join("\n")
            )
            .join("\n");
          return cssString.push(`${selector} {${cssVariables}}`);
        }
        return;
      });
    }
    const selector = ":root";
    const cssVariables = Object.entries(value)
      .map(([mainKey, mainValue]) =>
        Object.entries(mainValue)
          .map(
            ([subKey, subValue]) =>
              `--${toCssCasting(mainKey)}-${toCssCasting(subKey)}: ${subValue};`
          )
          .join("\n")
      )
      .join("\n");
    return cssString.push(`${selector} {${cssVariables}}`);
  });
  return cssString;
};

const generateThemeCssClasses = () => {
  const cssString = [];
  Object.entries(theme.classes).forEach(([, value]) => {
    const cssClasses = Object.entries(value)
      .map(([mainKey, mainValue]) =>
        Object.entries(mainValue)
          .map(([subKey, subValue]) => {
            const className = `.${toCssCasting(mainKey)}${toCssCasting(
              subKey
            )}`;
            const styleProperties = Object.entries(subValue)
              .map(
                ([styleKey, styleValue]) =>
                  `${toCssCasting(styleKey)}: ${styleValue};`
              )
              .join("\n");
            return `${className} {${styleProperties}}`;
          })
          .join("\n")
      )
      .join("\n");
    cssString.push(cssClasses);
  });
  return cssString;
};

const generateThemeCss = () => {
  const variable = generateThemeCssVariables();
  const classes = generateThemeCssClasses();
  console.log("variable", variable);

  fs.writeFileSync("dist/themes.css", [...variable, ...classes].join("\n"));
};

generateThemeCss();
