export interface MessageItem {
  msgID: string;
  /** 用户、坐席ID */
  userID?: string;
  role: 'seat' | 'user' | 'bot' | 'system';
  /** 消息内容 */
  content: string;
  /** 时间戳 */
  ts: number;
  /** 唯一标识 */
  key?: string;
  sn?: string;
  seatID?: string;
  sessionID?: string;
  /** 事件类型 */
  actionType?: string;
  source?: string;

  /** 显示类型 */
  showType?: string;
  /** 参考来源 */
  reference?: { title: string; src: string }[];
  history?: boolean;
  /** 反问话术 */
  askPre?: string;
  matchInfo?: {
    /** 置信度 */
    matchScore?: number;
    /** 机器人回复 */
    answerType?: string;
    /** 命中结果 */
    matchDetail?: string;
    /** 命中内容 */
    matchContent?: string;
    /** 语料 */
    corpus?: { text: string; score: number; title: string }[];
    /** 正则 */
    regex?: { text: string; score: number; title: string }[];
  };
}

interface RobotExtraAnswer {
  knowledgeID: string;
  standardAsk: string;
  answer: { [K in string]?: string };
  /** 相似问 */
  similarAskLabelDataList?: Array<{
    Id: string;
    Ask: string;
    Score: number;
    ProcessId: string;
    Keyword: Array<string>;
  }>;
  /** 关联问 */
  relationAskDataList?: RobotExtraAnswer['similarAskLabelDataList'];
  /** 流程自定义引导问 */
  processAskDataList?: RobotExtraAnswer['similarAskLabelDataList'];
  /** 机器人流程分支 */
  selectAskDataList?: {
    style: 0 | 1 | 2;
    labels: Array<string>;
  };
}

export interface RobotAnswerItem {
  // 机器人回复详情
  content: string; // 渠道回复内容
  askPre?: string;
  fileInfo?: string; // 附件
  extraAns?: RobotExtraAnswer; // 其他匹配信息
  needIntoAgent?: boolean; // 是否推荐转人工
  noAnswerTimes?: number; // 机器人未回答次数
}

export interface HistorSessionRobotResp {
  /** 历史消息机器人回答 */
  ansDetail: Array<RobotAnswerItem>;
  cusMsgID: string;
  cusContent?: string;
  needIntoAgent: boolean;
  noAnswerTimes: number;
  robotMsgID: string;
  score: number;
  sn: string;
  ts: number;
  kbID: string;
  businessID: string;
  loop?: boolean;
  queryID: string;
  matchInfo: string;
}

export interface HistorSessionItem {
  // 历史会话信息
  action: number;
  ActionType: string;
  businessID: string;
  content: string;
  enterpriseID: string;
  index: number;
  isWithdraw: number;
  kbID: string;
  mimeType: string;
  msgID: string;
  personChange: { Exits: string | null; Joins: string | null };
  robotResp: null | HistorSessionRobotResp;
  role: MessageItem['role'];
  sn: string;
  source: string;
  targetInfo: Array<{
    role: MessageItem['role'];
    targetSource: 'web';
    targetUID: string;
  }> | null;
  ts: number;
  seatID: string;
  cusID: string;
  userName: string;
  leaveMsgResps?: Array<{
    Channel: string;
    Content: string;
    LeaveMsgID: string | number;
    MsgID: string;
    SeatID: string;
  }> | null;
}
