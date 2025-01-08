import { useInViewport } from 'ahooks';
import { Spin } from 'antd';
import mammoth from 'mammoth';
import { useEffect, useRef, useState } from 'react';
import { ViewerProps } from '.';
import './index.less';

type DOCViewerProps = ViewerProps & {};

const DOCViewer = ({ src, onEnded, onLoaded }: DOCViewerProps) => {
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
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status == 200) {
        try {
          mammoth
            .convertToHtml({ arrayBuffer: xhr.response })
            .then((result: any) => {
              setDocText(result.value);
              setLoading(false);
              onLoaded?.();
            })
            .catch(() => {
              setDocText('无法预览此文件，它可能已损坏，或为未知文件格式');
              setLoading(false);
            });
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

export default DOCViewer;
