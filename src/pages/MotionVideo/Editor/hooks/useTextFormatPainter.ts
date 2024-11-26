import useMainStore from '../store/main';

export default () => {

  const textFormatPainter = useMainStore((store) => store.textFormatPainter);
  const richTextAttrs = useMainStore((store) => store.richTextAttrs);
  const setTextFormatPainter = useMainStore((store) => store.setTextFormatPainter);

  const toggleTextFormatPainter = (keep = false) => {
    if (textFormatPainter) setTextFormatPainter(null)
    else {
      setTextFormatPainter({
        keep,
        bold: richTextAttrs.bold,
        em: richTextAttrs.em,
        underline: richTextAttrs.underline,
        strikethrough: richTextAttrs.strikethrough,
        color: richTextAttrs.color,
        backcolor: richTextAttrs.backcolor,
        fontname: richTextAttrs.fontname,
        fontsize: richTextAttrs.fontsize,
        align: richTextAttrs.align,
      })
    }
  }

  return {
    toggleTextFormatPainter
  }
}
