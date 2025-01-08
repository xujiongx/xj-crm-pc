import { ViewerProps } from '.';
import PDFViewer from './pdf';

type PPTViewerProps = ViewerProps & {};

const PPTViewer = (props: PPTViewerProps) => {
  const { src, ...rest } = props;
  return (
    <PDFViewer
      src={`${src?.substring(0, src.lastIndexOf('.'))}.pdf`}
      {...rest}
    />
  );
};
export default PPTViewer;
