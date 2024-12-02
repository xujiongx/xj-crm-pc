// 导入基本的 ProseMirror 节点
import { nodes } from 'prosemirror-schema-basic'
// 导入 ProseMirror 的 Node 类型和 NodeSpec 接口
import type { Node, NodeSpec } from 'prosemirror-model'
// 导入 ProseMirror 的列表项节点
import { listItem as _listItem } from 'prosemirror-schema-list'

// 定义属性接口，支持字符串或数字类型的属性值
interface Attr {
  [key: string]: number | string
}

// 定义有序列表节点规格
const orderedList: NodeSpec = {
  attrs: { // 定义节点属性
    order: {
      default: 1, // 默认序号为 1
    },
    listStyleType: {
      default: '', // 默认列表样式为空
    },
    fontsize: {
      default: '', // 默认字体大小为空
    },
    color: {
      default: '', // 默认颜色为空
    },
  },
  content: 'list_item+', // 内容必须包含一个或多个 list_item
  group: 'block', // 归类为块级元素
  parseDOM: [ // 定义如何从 DOM 解析到 ProseMirror 节点
    { 
      tag: 'ol', // 匹配 <ol> 标签
      getAttrs: dom => { // 获取并设置节点属性
        const order = ((dom as HTMLElement).hasAttribute('start') ? (dom as HTMLElement).getAttribute('start') : 1) || 1
        const attr: Attr = { order: +order }

        const { listStyleType, fontSize, color } = (dom as HTMLElement).style
        if (listStyleType) attr['listStyleType'] = listStyleType
        if (fontSize) attr['fontsize'] = fontSize
        if (color) attr['color'] = color

        return attr
      }
    }
  ],
  toDOM: (node: Node) => { // 定义如何从 ProseMirror 节点生成 DOM
    const { order, listStyleType, fontsize, color } = node.attrs
    let style = ''
    if (listStyleType) style += `list-style-type: ${listStyleType};`
    if (fontsize) style += `font-size: ${fontsize};`
    if (color) style += `color: ${color};`

    const attr: Attr = { style }
    if (order !== 1) attr['start'] = order

    return ['ol', attr, 0] // 返回 DOM 结构
  },
}

// 定义无序列表节点规格
const bulletList: NodeSpec = {
  attrs: { // 定义节点属性
    listStyleType: {
      default: '',
    },
    fontsize: {
      default: '',
    },
    color: {
      default: '',
    },
  },
  content: 'list_item+', // 内容必须包含一个或多个 list_item
  group: 'block', // 归类为块级元素
  parseDOM: [ // 定义如何从 DOM 解析到 ProseMirror 节点
    {
      tag: 'ul', // 匹配 <ul> 标签
      getAttrs: dom => { // 获取并设置节点属性
        const attr: Attr = {}

        const { listStyleType, fontSize, color } = (dom as HTMLElement).style
        if (listStyleType) attr['listStyleType'] = listStyleType
        if (fontSize) attr['fontsize'] = fontSize
        if (color) attr['color'] = color

        return attr
      }
    }
  ],
  toDOM: (node: Node) => { // 定义如何从 ProseMirror 节点生成 DOM
    const { listStyleType, fontsize, color } = node.attrs
    let style = ''
    if (listStyleType) style += `list-style-type: ${listStyleType};`
    if (fontsize) style += `font-size: ${fontsize};`
    if (color) style += `color: ${color};`

    return ['ul', { style }, 0] // 返回 DOM 结构
  },
}

// 定义列表项节点规格，扩展自基本的 listItem
const listItem: NodeSpec = {
  ..._listItem,
  content: 'paragraph block*', // 内容可以包含一个段落和任意数量的块级节点
  group: 'block', // 归类为块级元素
}

// 定义段落节点规格
const paragraph: NodeSpec = {
  attrs: { // 定义节点属性
    align: {
      default: '',
    },
    indent: {
      default: 0,
    },
    textIndent: {
      default: 0,
    },
  },
  content: 'inline*', // 内容可以包含任意数量的内联元素
  group: 'block', // 归类为块级元素
  parseDOM: [ // 定义如何从 DOM 解析到 ProseMirror 节点
    {
      tag: 'p', // 匹配 <p> 标签
      getAttrs: dom => { // 获取并设置节点属性
        const { textAlign, textIndent } = (dom as HTMLElement).style

        let align = (dom as HTMLElement).getAttribute('align') || textAlign || ''
        align = /(left|right|center|justify)/.test(align) ? align : ''

        let textIndentLevel = 0
        if (textIndent) {
          if (/em/.test(textIndent)) {
            textIndentLevel = parseInt(textIndent)
          }
          else if (/px/.test(textIndent)) {
            textIndentLevel = Math.floor(parseInt(textIndent) / 20)
            if (!textIndentLevel) textIndentLevel = 1
          }
        }

        const indent = +((dom as HTMLElement).getAttribute('data-indent') || 0)
      
        return { align, indent, textIndent: textIndentLevel }
      }
    },
    {
      tag: 'img',
      ignore: true, // 忽略图片
    },
    {
      tag: 'pre',
      skip: true, // 跳过预格式化文本
    },
  ],
  toDOM: (node: Node) => { // 定义如何从 ProseMirror 节点生成 DOM
    const { align, indent, textIndent } = node.attrs
    let style = ''
    if (align && align !== 'left') style += `text-align: ${align};`
    if (textIndent) style += `text-indent: ${textIndent * 20}px;`

    const attr: Attr = { style }
    if (indent) attr['data-indent'] = indent

    return ['p', attr, 0] // 返回 DOM 结构
  },
}

const {
  doc,
  blockquote,
  text,
} = nodes

// 从 nodes 导入并导出 doc, blockquote, text, 并添加自定义节点
export default {
  doc,
  paragraph,
  blockquote,
  text,
  'ordered_list': orderedList,
  'bullet_list': bulletList,
  'list_item': listItem,
}
