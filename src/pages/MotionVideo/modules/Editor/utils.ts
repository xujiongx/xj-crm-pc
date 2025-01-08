import { uid } from '@aicc/shared';
import {
  SHAPE_LIST,
  SHAPE_PATH_FORMULAS,
  ShapePoolItem,
} from '../../config/shapes';
import { PPTElement, PPTShapeElement } from '../../interface';

const convertFontSizePtToPx = (html: string, ratio: number) => {
  return html.replace(/font-size:\s*([\d.]+)pt/g, (match, p1) => {
    return `font-size: ${(parseFloat(p1) * ratio).toFixed(1)}px`;
  });
};

export const genSpanElement = (item: {
  rawText: any;
  subscriptFlag: any;
  superscriptFlag: any;
  fontColorStyle: { color: any };
  fontSize: any;
  fontFamily: any;
  boldFlag: any;
  italicFlag: any;
  underlinedFlag: any;
  characterSpacing: any;
  strikethroughFlag: any;
}) => {
  let text = item.rawText;

  if (item.subscriptFlag) {
    text = `<sub>${text}</sub>`;
  }
  if (item.superscriptFlag) {
    text = `<sup>${text}</sup>`;
  }

  let styleText = '';

  const fontColor = item.fontColorStyle.color;
  const fontSize = item.fontSize;
  const fontType = item.fontFamily;
  const boldFlag = item.boldFlag;
  const italicFlag = item.italicFlag;
  const underlinedFlag = item.underlinedFlag;
  const characterSpacing = item.characterSpacing;
  const strikethroughFlag = item.strikethroughFlag;

  if (fontColor) styleText += `color: ${fontColor};`;
  if (fontSize) styleText += `font-size: ${fontSize}px;`;
  if (fontType) styleText += `font-family: ${fontType};`;
  if (boldFlag) styleText += `font-weight: bold;`;
  if (italicFlag) styleText += `font-style: italic;`;
  if (underlinedFlag) styleText += `text-decoration: underline;`;
  if (characterSpacing) styleText += `letter-spacing: ${characterSpacing}px;`;
  if (strikethroughFlag) styleText += `text-decoration-line: line-through`;

  return `<span style="${styleText}">${text.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\s/g, '&nbsp;')}</span>`;
};

export const getTextParagraph = (item) => {
  const { textAlign, autoNumberingScheme, bulletCharacter, bulletFlag } = item;
  let text = '';
  const align = textAlign.toLowerCase();
  const getType = () => {
    if (bulletFlag && autoNumberingScheme) return 'ol';
    if (bulletFlag && bulletCharacter) return 'ul';
    return '';
  };
  const listType = getType();
  if (listType) {
    text += `<${listType}><li style="text-align: ${align};">`;
  } else {
    text += `<p style="text-align: ${align};">`;
  }
  item.textRuns.forEach(
    (item: {
      rawText: any;
      subscriptFlag: any;
      superscriptFlag: any;
      fontColorStyle: { color: any };
      fontSize: any;
      fontFamily: any;
      boldFlag: any;
      italicFlag: any;
      underlinedFlag: any;
      characterSpacing: any;
      strikethroughFlag: any;
    }) => {
      text += genSpanElement(item);
    },
  );

  if (listType) text += `</li></${listType}>`;
  else text += '</p>';

  console.log('😷', text);

  return text;
};

const formatText = (element: PPTElement & { textParagraphs: any[] }) => {
  const { textParagraphs = [] } = element;
  let text = '';
  textParagraphs.forEach((item) => {
    text += getTextParagraph(item);
  });
  return text;
};

const formatShape = (el) => {
  const ratio = 96 / 72;
  const shapeList: ShapePoolItem[] = [];
  for (const item of SHAPE_LIST) {
    shapeList.push(...item.children);
  }
  const shape =
    el.shapeType &&
    shapeList.find((item) => item.pptxShapeType === el.shapeType);

  const element: PPTShapeElement = {
    type: 'shape',
    id: uid(),
    width: el.width,
    height: el.height,
    left: el.left,
    top: el.top,
    viewBox: [200, 200],
    path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
    fill: 'none',
    fixedRatio: false,
    rotate: el.rotate,
    outline: {
      color: el.outline?.color,
      width: el.outline?.width,
      style: el.outline?.style,
    },
    text: {
      content: convertFontSizePtToPx(formatText(el), ratio),
      // defaultFontName: theme.value.fontName,
      // defaultColor: theme.value.fontColor,
      // align: vAlignMap[el.vAlign] || 'middle',
    },
    flipH: el.flipH,
    flipV: el.flipV,
  };

  if (el.fill) {
    element.fill = el.fill;
  }
  if (el.gradient) {
    element.gradient = {
      type: el.gradient.gradientType,
      rotate: el.gradient.gradientRotate,
      colors: el.gradient.gradientColor.map((item: string, index: number) => ({
        pos: (100 / el.gradient.gradientColor.length) * (index + 1),
        color: item,
      })),
    };
  }
  if (el.shadow) {
    // 将角度转换为弧度
    const angleInRadians = (el.shadow.angle * Math.PI) / 180;
    const distance = el.shadow.distance;

    // 计算水平方向分量h
    const h = distance * Math.cos(angleInRadians);
    // 计算垂直方向分量v
    const v = distance * Math.sin(angleInRadians);

    element.shadow = {
      h: h * ratio,
      v: v * ratio,
      blur: el.shadow.blur * ratio,
      color: el.shadow.color,
    };
  }
  if (shape) {
    element.path = shape.path;
    element.viewBox = shape.viewBox;

    if (shape.pathFormula) {
      element.pathFormula = shape.pathFormula;
      element.viewBox = [el.width, el.height];

      const pathFormula = SHAPE_PATH_FORMULAS[shape.pathFormula];
      if ('editable' in pathFormula && pathFormula.editable) {
        element.path = pathFormula.formula(
          el.width,
          el.height,
          pathFormula.defaultValue,
        );
        element.keypoints = pathFormula.defaultValue;
      } else element.path = pathFormula.formula(el.width, el.height);
    }
  }
  return element;
};

const formatImage = (el) => {
  const ratio = 96 / 72;
  const element = el;
  if (el.shadow) {
    // 将角度转换为弧度
    const angleInRadians = (el.shadow.angle * Math.PI) / 180;
    const distance = el.shadow.distance;

    // 计算水平方向分量h
    const h = distance * Math.cos(angleInRadians);
    // 计算垂直方向分量v
    const v = distance * Math.sin(angleInRadians);

    element.shadow = {
      h: h * ratio,
      v: v * ratio,
      blur: el.shadow.blur * ratio,
      color: el.shadow.color,
    };
  }

  return element;
};

export const formatElement = (element: PPTElement) => {
  let result = element;
  const { type } = result;
  if (type === 'text') {
    result.content = formatText(result);
  }
  if (type === 'shape') {
    result = formatShape(element);
  }
  if (type === 'image') {
    result = formatImage(element);
  }
  return result;
};
