export interface MessageItem {
  id: string;
  knowledgeId?: string;
  content: string;
  question?: string;
  role: 'robot' | 'user' | 'system' | 'agent';
  nodeId?: string;
  nodeTitle?: string;
  /** 音频区间 */
  slots?: number[];
  score?: number;
  interrupt?: boolean;
  noMatch?: boolean;
  /** 命中标签 */
  tags?: {
    tag_id: string;
    tag_name: string;
    is_right: boolean;
    translated_tag_text: string;
  }[];
  /** 命中详情 */
  matchDetail?: {
    answerType: string;
    matchModel: string;
    matchContent: string;
    matchDetail?: {
      name: string;
      type: string;
      value: string;
      score: number;
    }[];
  };
  /** 正则 */
  regex?: {
    text: string;
    score: number;
    title: string;
  }[];
  /** 语料 */
  corpus?: MessageItem['regex'];
}

export interface SessionItem {
  id: string;
  src: string;
  phone: string;
  userName?: string;
  canMark?: boolean;
  messages: MessageItem[];
  /** 查找下一条参数 */
  next?: {
    id: string;
    searchAfter: string;
  };
}

export interface ApiResult {
  id: string;
  audioPath: string;
  telephone: string;
  common_user_name?: string;
  fsSessionId: string;
  nextFsSessionId?: string;
  searchAfter?: string;
  content?: string;
  raw_var_list_map: Record<string, any>;
  shcContent: ApiContentItem[];
}

/** 流程随路数据 */
export interface RawVarListMap {
  /** 是否打断 */
  detail_break_tts: string;
  /** 是否打断失败 */
  detail_play_last: string;
  /** -1未识别 */
  detail_problem_status: string;
  detail_audio_slice_start_time_index_second: string;
  detail_audio_slice_end_time_index_second: string;
  detail_req_node_id: string;
  detail_req_node_name: string;
  detail_resp_node_id: string;
  detail_resp_node_name: string;
  detail_cond_name: string;
  detail_cond_id: string;
  detail_cond_type: string;
  detail_regx?: string;
  detail_corpos?: string;
  detail_robot?: string;
}

export interface ApiContentItem {
  bps: string;
  eps: string;
  index: string;
  msgID: string;
  text: string;
  role: 'robot' | 'shc_user' | 'user' | 'agent' | 'system';
  vars?: string;
  tags?: any;
  content?: string;
  query?: string;
  answer?: string;
  rawVarListMap?: Record<string, any>;
  req_id: string;
}
