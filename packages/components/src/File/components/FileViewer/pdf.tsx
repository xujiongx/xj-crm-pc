import { useInViewport, useSize } from 'ahooks';
import { Empty, Spin } from 'antd';
import PDFWorker from 'pdfjs-dist/build/pdf.worker.min.js';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ViewerProps } from '.';

pdfjs.GlobalWorkerOptions.workerSrc = PDFWorker;

type PDFViewerProps = ViewerProps & {};

const PDFViewer = ({ src, onEnded, onLoaded }: PDFViewerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const lastPageRef = useRef<HTMLCanvasElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const size = useSize(ref);
  const [inViewport] = useInViewport(lastPageRef);

  useEffect(() => {
    if (inViewport) {
      onEnded?.();
    }
  }, [inViewport]);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
    onLoaded?.();
  };

  return (
    <div ref={ref}>
      <Document
        file={src}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<Empty image={<Spin />} description="文档打开中..." />}
        error="文件查看失败"
      >
        {new Array(numPages).fill(numPages).map((el, index) => (
          <Page
            key={`page_${index + 1}`}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            pageNumber={index + 1}
            width={size?.width}
            canvasRef={index + 1 === numPages ? lastPageRef : undefined}
            loading=""
            error=""
          />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
