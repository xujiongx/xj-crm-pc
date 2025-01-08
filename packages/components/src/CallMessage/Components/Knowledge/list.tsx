import { renderWeChatMessage } from '@aicc/shared';
import { ArrowDownOutlined } from '@ant-design/icons';
import { Collapse, List, Space, Typography } from 'antd';
import { FC, Fragment, MouseEvent, useRef, useState } from 'react';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import { prefix } from '../../index';
import './index.less';

const { Link } = Typography;

export interface AnswerType {
  key: string;
  closable: boolean;
  title: string;
  fileList: Array<any>;
  content: string;
  type?: string;
  graphic?: any;
}

export type KnowledgeItem = Partial<
  Record<'ask' | 'answer' | 'category' | 'id' | 'typeId', string>
>;

interface KnowledgesProps {
  loading: boolean;
  disabled?: boolean;
  list: Array<KnowledgeItem>;
  source?: string;
  handleEdit?: (event: MouseEvent, ans?: AnswerType) => void;
  sendAnswer?: (event: MouseEvent, ans?: AnswerType) => void;
}

const Knowledges: FC<KnowledgesProps> = ({
  loading,
  source = 'web',
  disabled,
  list,
  handleEdit,
  sendAnswer,
}) => {
  const img = useRef<HTMLImageElement>(null);
  const [src, setSrc] = useState('');

  const prefixCls = `${prefix}-qa`;
  /**
   * 预览图片
   */
  const previewImage = (event: MouseEvent) => {
    if ((event.target as HTMLElement).tagName === 'IMG') {
      const { src: url } = event.target as HTMLImageElement;
      setSrc(url);
      const viewer = new Viewer(img.current as HTMLImageElement, {
        navbar: false,
        toolbar: false,
        minZoomRatio: 0.5,
        maxZoomRatio: 5,
        url: () => url,
        hide() {
          viewer.destroy();
        },
      }).show();
    }
  };

  /**
   * 渲染问题答案
   * @param item
   */
  const renderAnswer = (item?: AnswerType): JSX.Element => {
    if (!item) return <span>暂无答案</span>;
    if (item.graphic) {
      const content = JSON.parse(item.graphic || '{}');
      return (
        <div
          onClick={previewImage}
          dangerouslySetInnerHTML={{ __html: renderWeChatMessage(content) }}
        />
      );
    }
    return (
      <div
        className="answer"
        dangerouslySetInnerHTML={{ __html: item.content }}
        onClick={previewImage}
      />
    );
  };

  const renderFiles = (item?: AnswerType) => {
    if (!item || !item?.fileList?.length) return null;
    return (
      <div className="files">
        <span style={{ width: 50 }}>附件：</span>
        <div className="lists">
          {item.fileList?.map((file) => (
            <Link key={file.uid} download href={file?.response?.msg}>
              {file.name}
              <ArrowDownOutlined style={{ marginLeft: 10 }} />
            </Link>
          ))}
        </div>
      </div>
    );
  };

  /**
   * 渲染
   * @param item
   * @returns {JSX}
   */
  const renderCollapsePanel = (item: KnowledgeItem) => {
    const answerMap = new Map<string, AnswerType>();
    if (item.answer) {
      try {
        (JSON.parse(item.answer) as Array<AnswerType>).forEach((ans) => {
          answerMap.set(ans.key, ans);
        });
      } catch (err) {
        console.log(err, 'error');
      }
    }
    const key = source || 'default';
    const ans = answerMap.get(key) || answerMap.get('default');
    return {
      label: '答案',
      key: 'answer',
      extra: ans ? (
        <Space style={{ marginRight: 10 }}>
          {handleEdit && ans?.type !== '1' ? (
            <Link
              disabled={disabled || !!ans.graphic}
              onClick={(event) => handleEdit?.(event, ans)}
            >
              编辑
            </Link>
          ) : null}
          {sendAnswer ? (
            <Link
              disabled={disabled}
              onClick={(event) => sendAnswer?.(event, ans)}
            >
              发送答案
            </Link>
          ) : null}
        </Space>
      ) : null,
      children: (
        <Fragment>
          {renderAnswer(ans)}
          {renderFiles(ans)}
        </Fragment>
      ),
    };
  };

  return (
    <div className={`${prefixCls}-knowledge-panel`}>
      <List
        className={`${prefixCls}-questions`}
        itemLayout="vertical"
        dataSource={list}
        loading={loading}
        renderItem={(item) => (
          <List.Item key={item.id} className={`${prefixCls}-questions-item`}>
            <div className={`${prefixCls}-questions-item-content`}>
              <div className={`${prefixCls}-questions-item-title`}>
                <div>
                  <p>分类</p>
                  <span>{item.category || '--'}</span>
                </div>
                <div>
                  <p>标准问</p>
                  <span>{item.ask}</span>
                </div>
              </div>
              <Collapse
                expandIconPosition="end"
                expandIcon={(panelProps) => (
                  <Link style={{ fontSize: 14 }}>
                    {panelProps.isActive ? '收起' : '展开'}
                  </Link>
                )}
                items={[renderCollapsePanel(item)]}
              />
            </div>
          </List.Item>
        )}
      />
      <img ref={img} style={{ display: 'none' }} src={src} alt="图片预览" />
    </div>
  );
};

export default Knowledges;
