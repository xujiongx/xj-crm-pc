import { FC, Fragment, MouseEvent } from 'react';
import { Tooltip, Typography } from 'antd';
import { transToHtml } from '@aicc/shared';
import { SessionMessageType, RobotAskItem } from '@aicc/types';
import MatchDetail from '../Interaction/components/Match';
import MarkdownText from './Markdown';
import RobotAsk from './components/RobotAsk';
import RobotBranch from './components/Branch';
import { MessageItem } from './types';
import './index.less';

const { Link } = Typography;

export interface MessageProps extends SessionMessageType {
  showType?: 'markdown';
  reference?: { title: string; src: string }[];
  keyword?: string;
  onContextMenu?: () => void;
  matchInfo?: MessageItem['matchInfo'];
  onSelect?: (val: string, event: MouseEvent, data?: RobotAskItem) => void;
}

const prefix = 'message';

const MessageContent: FC<MessageProps> = ({
  showType,
  reference,
  content,
  role,
  keyword,
  translate,
  askPre,
  similarAskLabelDataList,
  relationAskDataList,
  processAskDataList,
  selectAskDataList,
  matchInfo,
  onContextMenu,
  onSelect,
}) => {
  const getDataList = () => {
    /** 相似问 */
    if (similarAskLabelDataList?.length) {
      return similarAskLabelDataList;
    }
    /** 关联问 */
    if (relationAskDataList?.length) {
      return relationAskDataList;
    }
    /** 流程自定义引导问 */
    if (processAskDataList?.length) {
      return processAskDataList;
    }
    return [];
  };

  const renderMatch = () => {
    if (role !== 'user' || content === '_end_' || !matchInfo) return null;
    const { matchScore, matchDetail, answerType, matchContent, corpus, regex } =
      matchInfo;

    const fields = [
      {
        label: '置信度',
        value: matchScore ? Math.floor(matchScore * 100) / 100 : matchScore,
      },
      { label: '命中结果', value: matchDetail },
      { label: '机器人回复', value: answerType },
      { label: '命中内容', value: matchContent },
    ];

    return (
      <MatchDetail fields={fields} corpus={corpus || []} regex={regex || []} />
    );
  };

  const highlightKeywords = (html: string) => {
    if (!keyword) return html;
    const pattern = new RegExp(`(?<!<[^>]*)(${keyword})(?![^<]*>)`, 'gi');
    return html.replace(pattern, `<span class="${prefix}-highlight">$1</span>`);
  };

  const renderRichText = (html: string) => {
    if (!html) return '';
    if (typeof html !== 'string') return html;
    /** 附件正则 */
    const appendixRegex = /<a *?appendix=".*?".*?>/;
    if (appendixRegex.test(html)) {
      const attrRegex = /(\S+)\s*=\s*(['"])(.*?)\2/g;
      const attrs: { [K in string]: string } = {};
      let match: RegExpExecArray | null = null;
      while ((match = attrRegex.exec(html))) {
        attrs[match[1]] = match[3];
      }
      if (attrs['file-suffix'].includes('video')) {
        return `<video controls src="${attrs['href']}" playsinline="true" style="width: 100%" type="${attrs['file-suffix']}" />`;
      } else {
        return `<div class="appendix-wrap">
          <a href="${attrs['href']}" file-suffix="${
          attrs['file-suffix']
        }" download></a>
          <div class="appendix-info">
            <span>${attrs['file-name']}</span>
            <span>大小：${attrs['size'] || '--'}</span>
          </div>
        </div>`;
      }
    }
    return highlightKeywords(transToHtml(html));
  };

  const renderContent = () => {
    if (!content) return null;
    if (showType === 'markdown') return <MarkdownText text={content || ''} />;
    return (
      <span className={`${prefix}-text`} data-role={role}>
        <span
          dangerouslySetInnerHTML={{ __html: renderRichText(content || '') }}
          onContextMenu={onContextMenu}
        />
        {translate ? (
          <span className={`${prefix}-text-translate`}>{translate}</span>
        ) : null}
      </span>
    );
  };

  const renderReference = () => {
    if (!reference?.length) return;
    return (
      <div className={`${prefix}-reference`}>
        <span className={`${prefix}-reference-tip`}>参考来源：</span>
        <div className={`${prefix}-reference-list`}>
          {reference?.map(({ title, src }) => {
            const ellipsis = title?.length > 15;
            const children = (
              <Link href={src} key={src} target="_blank">
                {ellipsis ? `${title?.slice(0, 14)}...` : title}
              </Link>
            );
            if (!ellipsis) return children;
            return (
              <Tooltip key={src} title={title}>
                {children}
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <div className={`${prefix}-content`}>
        {renderContent()}
        {askPre ? (
          <span
            className={`${prefix}-askPre`}
            dangerouslySetInnerHTML={{ __html: askPre }}
          />
        ) : null}
        {renderReference()}
      </div>
      {getDataList().length ? (
        <RobotAsk list={getDataList()} onSelect={onSelect} />
      ) : null}
      {selectAskDataList?.labels?.length ? (
        <RobotBranch {...selectAskDataList} onSelect={onSelect} />
      ) : null}
      {renderMatch()}
    </Fragment>
  );
};

export default MessageContent;
