import { downloadUrlFile, getFileFormat } from '@aicc/shared';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  VerticalAlignBottomOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { useFullscreen, useSize } from 'ahooks';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import DOCViewer from './doc';
import ImageViewer from './image';
import './index.less';
import MarkdownView from './md';
import PDFViewer from './pdf';
import PPTViewer from './ppt';
import PPTByIdViewer from './pptById';
import TXTViewer from './txt';

export type ViewerProps = {
  /** 素材id */
  fileSourceId?: string;
  src?: string;
  name?: string;
  onEnded?: () => void;
  onLoaded?: () => void;
  showFullscreen?: boolean;
};

type FileViewerProps = ViewerProps & {
  style?: React.CSSProperties;
  className?: string;
  needLoad?: boolean;
  scaleStep?: number;
  scaleMax?: number;
  scaleMin?: number;
};

const FileViewer = (props: FileViewerProps) => {
  const {
    needLoad,
    scaleStep = 0.1,
    scaleMax = 2,
    scaleMin = 0.5,
    className,
    style,
    showFullscreen = true,
    fileSourceId,
    ...rest
  } = props;

  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(fullscreenRef);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const size = useSize(wrapperRef);
  const [canvasSize, setCanvasSize] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (size?.width && size?.height)
      setCanvasSize({
        width: scale * size?.width!,
        height: scale * size?.height!,
      });
  }, [scale, size]);

  const renderNode = () => {
    const format = getFileFormat(rest.src || '');
    /** 存在fileSourceId说明文档有转换过图片，除txt */
    if (
      fileSourceId &&
      ['ppt', 'pptx', 'pdf', 'doc', 'docx'].includes(format)
    ) {
      return <PPTByIdViewer {...props} />;
    }
    /**
     * scp已经切换为预览图片模式，需要传id; 不传id则预览pdf模式
     */
    switch (format) {
      case 'ppt':
      case 'pptx':
        return <PPTViewer {...rest} />;
      case 'pdf':
        return <PDFViewer {...rest} />;
      case 'txt':
        return <TXTViewer {...rest} />;
      case 'doc':
      case 'docx':
        return <DOCViewer {...rest} />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <ImageViewer {...rest} />;
      case 'md':
        return <MarkdownView {...rest} />;
      default:
        return <>格式不支持</>;
    }
  };

  const disableZoomIn = scale >= scaleMax;
  const disableZoomOut = scale <= scaleMin;

  return (
    <div
      ref={fullscreenRef}
      style={style}
      className={clsx('aicc-viewer', className)}
    >
      <div className="aicc-viewer-header">
        <div className="aicc-viewer-toolbar">
          {needLoad ? (
            <div
              className={clsx('aicc-viewer-toolbar-item')}
              onClick={() => {
                downloadUrlFile(`${props.src}`);
              }}
            >
              <VerticalAlignBottomOutlined />
            </div>
          ) : null}
          <div
            className={clsx('aicc-viewer-toolbar-item', {
              'aicc-viewer-toolbar-disabled': disableZoomOut,
            })}
            onClick={() => {
              !disableZoomOut &&
                setScale(Number((scale - scaleStep).toFixed(1)));
            }}
          >
            <ZoomOutOutlined />
          </div>
          <div className="aicc-viewer-toolbar-scale">
            {(scale * 100).toFixed(0)}%
          </div>
          <div
            className={clsx('aicc-viewer-toolbar-item', {
              'aicc-viewer-toolbar-disabled': disableZoomIn,
            })}
            onClick={() => {
              !disableZoomIn &&
                setScale(Number((scale + scaleStep).toFixed(1)));
            }}
          >
            <ZoomInOutlined />
          </div>
          {showFullscreen && (
            <div
              className={clsx('aicc-viewer-toolbar-item')}
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <FullscreenExitOutlined />
              ) : (
                <FullscreenOutlined />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="aicc-viewer-main">
        <div style={{ ...canvasSize }}></div>
        <div
          className="aicc-viewer-wrapper"
          style={{ transform: `scale3d(${scale}, ${scale}, 1)` }}
          ref={wrapperRef}
        >
          {renderNode()}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
