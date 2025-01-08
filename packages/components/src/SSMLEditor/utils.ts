import { message } from 'antd';
import { BaseText, Descendant, Element, Node, Text } from 'slate';
import { EditorType } from './constant';
import { CustomElement } from './index';

// 增加单闭合标签的正则匹配
const splitRegex = /<[^>]*>([^<]*)<\/[^>]*>|<[^>]+>|[^<]+/g;
const tagRegex = /<([a-z-]+)\s*.*?>.*?<\/\1>|<([a-z-]+)\s*.*? \/>/gi;
const ssmlTag = ['phoneme', 'say-as', 'break', 'insert-action'];

export const withInlines = (editor: EditorType) => {
  const { insertData, insertText, isInline, isSelectable, isElementReadOnly } =
    editor;

  editor.isInline = (element: Element) =>
    ssmlTag.includes(element.type) || isInline(element);

  editor.isElementReadOnly = (element: Element | CustomElement) => {
    if (ssmlTag.includes(element.type) && 'readonly' in element) {
      return element?.readonly || false;
    }
    return isElementReadOnly(element);
  };

  editor.isSelectable = (element: Element) =>
    !ssmlTag.includes(element.type) && isSelectable(element);

  editor.insertData = (data) => {
    insertData(data);
  };

  return editor;
};

export const withTextLimit = (editor: EditorType, maxLength?: number) => {
  const { insertText } = editor;
  editor.insertText = (text) => {
    const textContent = Node.string(editor.children[0]);
    const afterTextLength = text.length + textContent?.length;
    if (!maxLength || afterTextLength < maxLength!) {
      insertText(text);
    } else {
      const truncatedText = text.slice(
        0,
        text.length - (afterTextLength - maxLength!),
      );
      insertText(truncatedText);
    }
  };
  return editor;
};

export const excludeTagName = (value: string) => {
  let result = '';
  const matchs = value.match(splitRegex);
  if (matchs) {
    for (const str of matchs) {
      if (str.match(tagRegex)) {
        const child = extractTag(str);
        if ('text' in child) {
          result += child?.text || '';
        } else if ('children' in child) {
          result += child?.children?.[0]?.text || '';
        }
      } else {
        result += str || '';
      }
    }
  } else {
    result = value;
  }
  return result;
};

/** 验证单条话术 */
export const validateSignleWord = (value: string, maxLen: number) =>
  new Promise<number | string>((resolve, reject) => {
    if (!value) return reject('话术不能为空');
    const count = excludeTagName(value)?.length || 0;

    if (count > maxLen) reject(`单条话术最大字数不能超过${maxLen}字`);
    resolve(count);
  });

/** 标准话术验证 */
export const validateWords = ({
  value,
  maxLen,
  total,
  title = '',
  required = true,
}: {
  value: string;
  maxLen: number;
  total?: number;
  required?: boolean;
  title?: string;
}) =>
  new Promise<string | void>(async (resolve, reject) => {
    if (!required) resolve();
    const words = value?.split('||') || [];
    if (new Set(words)?.size !== words?.length) {
      return reject(`${title}话术不能重复！`);
    }
    let count = 0;
    for (const item of words) {
      if (!item?.trim()) reject(`${title || '单'}条话术不能为空`);
      try {
        await validateSignleWord(item, maxLen);
      } catch (error) {
        reject(error);
      }
    }
    if (total && count > total) reject(`${title}话术不能超过${total}字`);
    resolve();
  });

export const validateSelection = (fragement: Array<Descendant>) => {
  const dfs = (
    children: Array<Element | CustomElement | Descendant | BaseText>,
  ) => {
    for (const node of children) {
      if ('type' in node && ssmlTag.includes(node.type)) return false;
      if ('children' in node && node?.children) return dfs(node?.children);
    }
    return true;
  };
  return dfs(fragement);
};

/** 验证拼音格式 */
export const validatePy = (py: string, text: string) => {
  const range = /^[1-5]$/;
  const words = /^[a-z]+$/;
  const arr = py.split(' ') || [];
  if (arr?.length !== text?.length) {
    message.error('拼音的数目与字数不相等');
    return false;
  }

  for (const item of arr) {
    if (
      item?.length > 6 ||
      !range?.test(item.slice(-1)) ||
      !words.test(item.slice(0, -1))
    ) {
      message.error(
        `注音格式为1-6位字母、只能是小写并且以1-5结尾，其中${item}存在错误，请检查`,
      );
      return false;
    }
  }
  return true;
};

/** 提取标签名、属性、内容 */
const extractTag = (value: string) => {
  // 增加单闭合标签的正则解析匹配(todo: 正则优化，现在非单闭合匹配出match[3]带结束标签)
  const regex = /<([a-z\-]+)((?:\s+[a-z\-]+="[^"]*")*)\s*\/?>(([^<]*)<\/\1>)*/i;

  const match = value.match(regex);
  /** 标签不匹配，直接返回纯文本 */
  if (!match || !ssmlTag?.includes(match[1])) return { text: value };
  const property = {};
  if (match?.[2]) {
    match?.[2]
      ?.trim()
      .split(/"\s+/)
      .forEach((attr) => {
        const [name, value] = attr?.split('=');
        /** 驼峰命名 */
        const camelCase = name.replace(/-([a-z])/g, (match, letter) =>
          letter.toUpperCase(),
        );
        const replaceMarksValue = value?.replace(/"/g, '');
        property[camelCase] =
          name === 'time'
            ? Number(replaceMarksValue?.replace(/ms/g, ''))
            : replaceMarksValue;
      });
  }
  return {
    type: match[1],
    readonly: true,
    property,
    children: [
      { text: match?.[3]?.trim()?.replace(/<[^>]*>|<([a-zA-Z])/g, '') || '' },
    ],
  } as CustomElement;
};

export const parseSSML = (value?: string) => {
  if (!value) return [{ text: '' }];
  const result: Array<Descendant | CustomElement> = [];
  try {
    const matchs = value.match(splitRegex);
    if (!matchs?.length) return [{ text: value }];
    for (const str of matchs) {
      if (str.match(tagRegex)) {
        const item = extractTag(str);
        if (item) result.push(item);
      } else {
        result.push({ text: str });
      }
    }
  } catch (error) {
    console.log(error, '解析语音答案错误');
  }
  // /** 最后一个节点为 ssml标签时。需要添加一个空节点 */
  if (result?.length && 'property' in result?.[result?.length - 1]) {
    result.push({ text: '' });
  }
  return result;
};

/** 停顿和动作类型type */
const TIME_AND_ACTION = ['break', 'insert-action'];
/** 拼接ssml标签 */
export const serialize = (nodes: Array<Descendant | CustomElement>) => {
  const regex = /([a-z])([A-Z])/g;
  return nodes
    .map((node) => {
      if (Text.isText(node)) {
        return Node.string(node);
      }
      if (Node.isNode(node)) {
        if ('property' in node) {
          const { type, property, children } = node;
          const attribute = Object.entries(property)
            .map(([key, value]) => {
              /** 驼峰转短横线 */
              const name = key.replace(regex, '$1-$2').toLowerCase();
              return `${name}="${name === 'time' ? `${value}ms` : value}"`;
            })
            ?.join(' ');
          if (TIME_AND_ACTION?.includes(type)) {
            return `<${type} ${attribute} />`;
          }
          return `<${type} ${attribute}>${serialize(children)}</${type}>`;
        }
        if (node?.children?.length) return serialize(node?.children || []);
      }
    })
    ?.join('');
};

export const INSERT_PAUSE = [
  {
    label: '连续',
    key: 0,
  },
  {
    label: '停顿0.5秒',
    key: 500,
  },
  {
    label: '停顿1秒',
    key: 1000,
  },
  {
    label: '停顿2秒',
    key: 2000,
  },
];

export const getNodeIsContinuous = (nodes, start, type: string) => {
  const nodeIndex = start.path[1];
  if (nodeIndex === 0) {
    // before break
    return (
      nodes[nodeIndex]?.text?.length <= start.offset &&
      nodes[nodeIndex + 1]?.type === type
    );
  } else if (
    start.offset === 0 ||
    (nodes[nodeIndex]?.text?.length === start.offset &&
      nodes[nodeIndex + 1]?.type === type)
  ) {
    // after break
    return nodes[nodeIndex - 1]?.type === type;
  }
  return false;
};

/** 校验中文、字母、数字
 * eg: 语音播放中不能出现纯符号，会报错
 */
export const voiceRegText = /[\u4E00-\u9FA5A-Za-z0-9]+/g;
