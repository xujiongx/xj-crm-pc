// 导入基本标记定义
import { marks } from 'prosemirror-schema-basic'
// 导入标记规范类型
import type { MarkSpec } from 'prosemirror-model'

// 定义下标文本标记规范
const subscript: MarkSpec = {
  excludes: 'subscript', // 不允许与自身相互排斥
  parseDOM: [ // 定义如何从 DOM 解析到下标
    { tag: 'sub' }, // 从 <sub> 标签解析
    {
      style: 'vertical-align', // 根据 style 属性解析
      getAttrs: value => value === 'sub' && null // 检查是否是下标
    },
  ],
  toDOM: () => ['sub', 0], // 定义如何从 ProseMirror 节点生成 DOM
}

// 定义上标文本标记规范
const superscript: MarkSpec = {
  excludes: 'superscript', // 不允许与自身相互排斥
  parseDOM: [
    { tag: 'sup' }, // 从 <sup> 标签解析
    {
      style: 'vertical-align',
      getAttrs: value => value === 'super' && null // 检查是否是上标
    },
  ],
  toDOM: () => ['sup', 0], // 生成上标标签
}

// 定义删除线标记规范
const strikethrough: MarkSpec = {
  parseDOM: [
    { tag: 'strike' }, // 从 <strike> 标签解析
    {
      style: 'text-decoration',
      getAttrs: value => value === 'line-through' && null // 检查是否有删除线样式
    },
    {
      style: 'text-decoration-line',
      getAttrs: value => value === 'line-through' && null // 再次检查
    },
  ],
  toDOM: () => ['span', { style: 'text-decoration-line: line-through;' }, 0], // 生成带有删除线的 <span>
}

// 定义下划线标记规范
const underline: MarkSpec = {
  parseDOM: [
    { tag: 'u' }, // 从 <u> 标签解析
    {
      style: 'text-decoration',
      getAttrs: value => value === 'underline' && null // 检查是否有下划线样式
    },
    {
      style: 'text-decoration-line',
      getAttrs: value => value === 'underline' && null // 再次检查
    },
  ],
  toDOM: () => ['span', { style: 'text-decoration: underline;' }, 0], // 生成带有下划线的 <span>
}

// 定义文本前景色标记规范
const forecolor: MarkSpec = {
  attrs: {
    color: {}, // 颜色属性
  },
  inline: true, // 定义为内联标记
  group: 'inline', // 属于内联组
  parseDOM: [
    {
      style: 'color', // 根据颜色样式解析
      getAttrs: color => color ? { color } : {}
    },
  ],
  toDOM: mark => {
    const { color } = mark.attrs
    let style = ''
    if (color) style += `color: ${color};` // 设置颜色样式
    return ['span', { style }, 0]
  },
}

// 定义文本背景色标记规范
const backcolor: MarkSpec = {
  attrs: {
    backcolor: {}, // 背景色属性
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'background-color', // 根据背景色样式解析
      getAttrs: backcolor => backcolor ? { backcolor } : {}
    },
  ],
  toDOM: mark => {
    const { backcolor } = mark.attrs
    let style = ''
    if (backcolor) style += `background-color: ${backcolor};` // 设置背景色样式
    return ['span', { style }, 0]
  },
}

// 定义字体大小标记规范
const fontsize: MarkSpec = {
  attrs: {
    fontsize: {}, // 字体大小属性
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'font-size', // 根据字体大小样式解析
      getAttrs: fontsize => fontsize ? { fontsize } : {}
    },
  ],
  toDOM: mark => {
    const { fontsize } = mark.attrs
    let style = ''
    if (fontsize) style += `font-size: ${fontsize};` // 设置字体大小样式
    return ['span', { style }, 0]
  },
}

// 定义字体名称标记规范
const fontname: MarkSpec = {
  attrs: {
    fontname: {}, // 字体名称属性
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'font-family', // 根据字体家族样式解析
      getAttrs: fontname => {
        return { fontname: fontname && typeof fontname === 'string' ? fontname.replace(/[\"\']/g, '') : '' }
      }
    },
  ],
  toDOM: mark => {
    const { fontname } = mark.attrs
    let style = ''
    if (fontname) style += `font-family: ${fontname};` // 设置字体家族样式
    return ['span', { style }, 0]
  },
}

// 定义链接标记规范
const link: MarkSpec = {
  attrs: {
    href: {}, // 链接地址属性
    title: { default: null }, // 链接标题，默认为空
    target: { default: '_blank' }, // 链接目标，默认新标签页打开
  },
  inclusive: false, // 不包含其他标记
  parseDOM: [
    {
      tag: 'a[href]', // 从 <a> 标签且包含 href 属性的标签解析
      getAttrs: dom => {
        const href = (dom as HTMLElement).getAttribute('href')
        const title = (dom as HTMLElement).getAttribute('title')
        return { href, title }
      }
    },
  ],
  toDOM: node => ['a', node.attrs, 0], // 生成 <a> 标签
}

// 定义高亮标记规范
const mark: MarkSpec = {
  attrs: {
    index: { default: null }, // 高亮索引，默认为空
  },
  parseDOM: [
    {
      tag: 'mark', // 从 <mark> 标签解析
      getAttrs: dom => {
        const index = (dom as HTMLElement).dataset.index
        return { index }
      }
    },
  ],
  toDOM: node => ['mark', { 'data-index': node.attrs.index }, 0], // 生成 <mark> 标签
}

// 从 marks 导入并使用内置标记
const { em, strong, code } = marks

// 导出所有标记
export default {
  em,
  strong,
  fontsize,
  fontname,
  code,
  forecolor,
  backcolor,
  subscript,
  superscript,
  strikethrough,
  underline,
  link,
  mark,
}
