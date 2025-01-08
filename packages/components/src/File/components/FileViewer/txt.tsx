import { useInViewport } from 'ahooks';
import { Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ViewerProps } from '.';
import './index.less';

type TXTViewerProps = ViewerProps & {};

const TXTViewer = ({ src, onEnded, onLoaded }: TXTViewerProps) => {
  const [loading, setLoading] = useState(false);
  const [docText, setDocText] = useState('');
  const inViewRef = useRef<HTMLDivElement>(null);
  const [inViewport] = useInViewport(inViewRef);

  useEffect(() => {
    if (inViewport) {
      onEnded?.();
    }
  }, [inViewport]);

  useEffect(() => {
    src && loadData();
  }, [src]);

  const loadData = () => {
    setLoading(true);
    const xhr = new XMLHttpRequest();
    xhr.open('get', src!, true);
    xhr.onload = () => {
      if (xhr.status == 200) {
        try {
          setDocText(xhr.response.replace(/[\n\r]/g, '<br>'));
          setLoading(false);
          onLoaded?.();
        } catch (error) {
          setLoading(false);
        }
      }
    };
    xhr.send();
  };

  return (
    <Spin spinning={loading} tip="文档打开中">
      <div
        className="aicc-viewer-doc-wrapper"
        dangerouslySetInnerHTML={{ __html: docText }}
      />
      {!loading && <div ref={inViewRef} style={{ height: 10 }}></div>}
    </Spin>
  );
};

export default TXTViewer;
