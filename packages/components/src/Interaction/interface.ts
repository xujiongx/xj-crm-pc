export interface MessageItem {
  role: 'user' | 'robot' | 'system';
  id: string;
  content: string;
  nodeId?: string;
  /** 置信度 */
  matchScore?: number;
  /** 命中结果 */
  matchDetail?: string;
  /** 机器人回复 */
  answerType?: string;
  /** 命中内容 */
  matchContent?: string;
  /** 打断 */
  interrupt?: boolean;
  showMatch?: boolean;
  sessionType?: 'text' | 'process';
  regex?: Array<{ text: string; score: number; title: string }>;
  corpus?: MessageItem['regex'];
  selectAskDataList?: any;
  relationAskDataList?: any;
  showType?: 'markdown';
  loading?: boolean;
  reference?: Array<{ title: string; src: string }>;
}

/** 交互测试接口返回结构 */
export interface InteractionRespond {
  singleNode: Record<'cmd' | 'answerMsg', string>;
  respID: string;
  matchScore?: number;
  respCondID?: string;
  matchByTitle?: string;
  matchDetailStr?: string;
  matchResult?: string;
  isTextRobot: boolean;
  notifyMsg?: string;
  detail_corpos: string;
  detail_regx: string;
  matchInfo?: string;
  PlayLast?: boolean;
  loop?: boolean;
  queryID?: string;
  selectAskDataList?: Array<{
    ID: string;
    Ask: string;
    Score: number;
    Keyword: string[];
  }>;
  relationAskDataList: {
    labels: Array<string>;
    style: 0 | 1 | 2;
  };
  isDigitalHuman?: boolean;
}
