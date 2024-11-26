import Clipboard from 'clipboard'
import useAddSlidesOrElements from './useAddSlidesOrElements'
import useDeleteElements from './useDeleteElements'
import useCreateElement from './useCreateElement'
import { parseText2Paragraphs } from '../utils/textParser'

interface PasteTextClipboardDataOptions {
  onlySlide?: boolean
  onlyElements?: boolean
}

const useClipboard = () => {

  const { addElementsFromData } = useAddSlidesOrElements()
  const { deleteElement } = useDeleteElements()
  const { createTextElement } = useCreateElement();


  /**
   * 粘贴普通文本：创建为新的文本元素
   * @param text 文本
   */
  const createTextElementFromClipboard = (text: string) => {
    createTextElement({
      left: 0,
      top: 0,
      width: 600,
      height: 50,
    }, { content: text })
  }

  /**
   * 复制文本到剪贴板
   * @param text 文本内容
   */
  const copyText = (text: string) => {
    return new Promise((resolve, reject) => {
      const fakeElement = document.createElement('button')
      const clipboard = new Clipboard(fakeElement, {
        text: () => text,
        action: () => 'copy',
        container: document.body,
      })
      clipboard.on('success', e => {
        clipboard.destroy()
        resolve(e)
      })
      clipboard.on('error', e => {
        clipboard.destroy()
        reject(e)
      })
      document.body.appendChild(fakeElement)
      fakeElement.click()
      document.body.removeChild(fakeElement)
    })
  }

  // 读取剪贴板
  const readClipboard = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (navigator.clipboard?.readText) {
        navigator.clipboard.readText().then(text => {
          if (!text) reject('剪贴板为空或者不包含文本')
          return resolve(text)
        })
      }
      else reject('浏览器不支持或禁止访问剪贴板，请使用快捷键 Ctrl + V')
    })
  }


  /**
   * 解析剪贴板内容，根据解析结果选择合适的粘贴方式
   * @param text 剪贴板内容
   * @param options 配置项：onlySlide -- 仅处理页面粘贴；onlyElements -- 仅处理元素粘贴；
   */
  const pasteTextClipboardData = (text: string, options?: PasteTextClipboardDataOptions) => {

    const onlySlide = options?.onlySlide || false
    const onlyElements = options?.onlyElements || false

    let clipboardData
    try {
      clipboardData = JSON.parse(text)
    } catch {
      clipboardData = text
    }

    // 元素或页面
    if (typeof clipboardData === 'object') {
      const { type, data } = clipboardData

      if (type === 'elements') addElementsFromData(data)
    }

    // 普通文本
    else if (!onlyElements && !onlySlide) {
      const string = parseText2Paragraphs(clipboardData)
      console.log(string, 'string')
      createTextElementFromClipboard(string)
    }
  }

  const pasteElement = () => {
    readClipboard().then(text => {
      pasteTextClipboardData(text)
    }).catch(err => { console.log(err) })
  }


  const cutElement = (text: string) => {
    copyText(text)
    deleteElement()
  }


  return {
    copyText,
    pasteElement,
    cutElement,
    deleteElement
  }
}

export default useClipboard
