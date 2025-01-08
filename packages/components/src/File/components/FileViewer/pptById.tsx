import {
  ConfigContext,
  ConfigProviderProps,
} from '@aicc/context/es/ConfigProvider';
import { CrmApiResultType } from '@aicc/types';
import { useInViewport, useInfiniteScroll, useRequest } from 'ahooks';
import { Spin } from 'antd';
import React, { useEffect, useRef } from 'react';
import { ViewerProps } from '.';

interface Result {
  list: string[];
  next?: string;
}

type PPTByIdViewerProps = ViewerProps & {};

const PPTByIdViewer = ({
  fileSourceId,
  onLoaded,
  onEnded,
}: PPTByIdViewerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastPageRef = useRef<HTMLImageElement>(null);
  const [inViewport] = useInViewport(lastPageRef);
  const imageLoadedMap = useRef<Map<number, boolean>>(new Map());

  const { request } = React.useContext<ConfigProviderProps>(ConfigContext);

  const { data: images } = useRequest(
    async () => {
      const res = await request<CrmApiResultType<Array<string>>>(
        '/scp/exam/fileSource/sourceJpg/preview',
        {
          params: { id: fileSourceId },
        },
      );
      if (res?.code !== 0) return [];
      return res?.result?.filter((c) => c) || [];
    },
    {
      ready: !!fileSourceId,
      cacheKey: `queryPPTImagesBy${fileSourceId}`,
    },
  );

  const loadMore = (nextId?: string, limit?: number): Promise<Result> => {
    let start = 0;
    if (nextId) {
      start = images?.findIndex((i) => i === nextId) || 0;
    }
    const end = start + limit!;
    const list = images?.slice(start, end) || [];
    const nId = images?.length! >= end ? images?.[end] : undefined;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          list,
          next: nId,
        });
      }, 500);
    });
  };

  const { data, loading, noMore } = useInfiniteScroll(
    (d) => loadMore(d?.next, 5),
    {
      target: wrapperRef,
      reloadDeps: [images],
      isNoMore: (d) => d?.next === undefined,
    },
  );

  useEffect(() => {
    /** 所有图片加载完成，且能看到最后一张图 */
    if (imageLoadedMap.current.size === images?.length) {
      onLoaded?.();
      inViewport && onEnded?.();
    }
  }, [imageLoadedMap.current.size, inViewport]);

  const renderError = () => {
    return <div className="aicc-viewer-doc-wrapper">文件查看失败</div>;
  };

  return (
    <Spin spinning={loading} tip="文档打开中">
      {!loading &&
        (!!data?.list?.length ? (
          <div ref={wrapperRef}>
            {data?.list?.map((item, index) => (
              <img
                ref={index + 1 === images?.length ? lastPageRef : undefined}
                key={index}
                src={item}
                onLoad={() => {
                  imageLoadedMap.current?.set(index, true);
                }}
              />
            ))}
            <Spin
              spinning={!noMore}
              style={{ textAlign: 'center', display: 'block' }}
            />
          </div>
        ) : (
          renderError()
        ))}
    </Spin>
  );
};

export default PPTByIdViewer;
