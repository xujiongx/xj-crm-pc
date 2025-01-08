import type { ThemeConfig } from 'antd';
import { RequestMethod } from 'umi-request';
import { MicroStoreType } from './micro';

export type ThemeConfigType = {
  subjectColor?: string;
  webSetting?: string;
  loginPage?: string;
  homePage?: string;
};

export interface MenuDataItem {
  access?: string[] | string;
  children?: MenuDataItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: React.ReactNode;
  locale?: string | false;
  name?: string;
  key?: string;
  path?: string;
  parentKeys?: string[];
  [key: string]: any;
}

export interface BasicLayoutProps {
  userInfo?: UserInfoType;
  access: { [key: string]: boolean };
  caller?: Caller;
  centrifuge?: Centrifuge;
  appConfig?: AppConfig;
  layoutContext?: LayoutContextType;
  routes?: Route[];
  crmRequest?: RequestMethod;
  themeToken?: ThemeConfig['token'];
  children?: React.ReactNode;
  setUserInfo?: (user: UserInfoType) => void;
  microStore?: MicroStoreType;
}

export type Route = {
  routes?: Route[];
} & MenuDataItem;

/** 部门用户信息 */
export interface DepartUserDTO {
  userId: string;
  realname: string;
  username?: string;
  /** 排序等级 */
  level: number;
  status?: number;
}

/** CRM 接口数据 */
export interface CrmApiResultType<T> {
  /** 请求是否正确, 0: 正常，其他异常 */
  code?: number;
  /** 正常返回时信息 */
  msg?: string;
  /** 错误码 */
  errorCode?: string;
  /** 错误类型，0：读取 msg 信息，1: 读取 error_code 对应的文本信息 */
  errorType?: number;
  /** 数据 */
  result?: T;
  timestamp?: number;
  success?: boolean;
}

/** 坐席Go 接口返回数据 */
export interface AgentApiResultType<T> {
  code?: number;
  data?: T;
  errorCode?: string;
  errorMsg?: string;
  errorType?: number;
  msg?: string;
  result?: T;
}

/** CRM 接口列表数据 */
export interface CrmApiListResultType<T> {
  /** 列表数据 */
  records?: T[];
  /** 当前页数 */
  current?: number;
  /** 每页条数 */
  size?: number;
  /** 总数 */
  total?: number;
  /** 对话记录*/
  history?: string;
}

/** CRM 接口列表基础参数 */
export interface CrmApiListBaseParamsType {
  pageNo?: number;
  pageSize?: number;
  [key: string]: any;
}

/** 系统配置信息 */
export interface AppConfig {
  /** SIP 服务地址 */
  SIP_SERVER: string;
  /** ICE 服务地址 */
  ICE_SERVER: string;
  /** 系统来源 */
  SYSTEM_SOURCE: string;
  /** ASR 采样率 */
  ASR_SAMPLE_RATE: 8000 | 16000;
  /** 项目名称 */
  APP_NAME: string;
  /** 是否关闭登录保持服务 */
  DISABLE_LOGIN_KEEP_SERVICE: boolean;
  /** 企业微信APPID */
  WORK_APPID: string;
  /** ASR识别模型 */
  ASR_SERVICE_MODEL?: string;
  /** 是否开启前端日志 */
  ENABLE_WEB_LOG?: boolean;
}

/** 系统状态信息 */
export interface AppState {
  /** 企业微信SDK授权 */
  workWxSdkAuth?: boolean;
}

/** 用户信息 */
export type UserInfoType = {
  id?: string;
  username?: string;
  departId?: string;
  departName?: string;
  tenantName?: string;
  /** 企业编号 */
  enterpriseCode?: string;
  /** 帐号类型，1: 普通，2: 平台超管，3: 企业超管 */
  userIdentity?: number;
  name?: string;
  userId?: string;
  avatar?: string;
  /** 昵称 */
  nick?: string;
  /** 员工姓名 */
  realname?: string;
  /** 工号 */
  workNo?: string;
  /** 账号状态，1：正常，2:冻结 */
  status?: 1 | 2;
  phone?: string;
  email?: string;
  /** 角色列表 */
  roleList?: Array<{ name: string; id: string; code: string }>;
  /** 技能组信息 */
  selecteddeparts?: Array<{ id: string; name: string; userIdentity: number }>;
  agentType?: '0' | '1' | '0,1';
  receptionType?: '1' | '2' | '3';
  freeswitchSkillgroupName?: string; // fs技能组名称
  taskUserIdentity?: number | string;
  sysOrgCode?: string;
  isAdmin?: boolean;
  /** 账号类型, qw: 企业微信 */
  thirdType?: 'qw';
  /** 认证照片 */
  authPictureUrl?: string;
  /** 是否可管理组织架构 */
  canChangeOrg?: 0 | 1;
  /** 是否开启水印 */
  waterMarkSetting?: 0 | 1;
  /** 是否显示找回密码 */
  retrievePassword?: 0 | 1;
  /** 企业logo */
  logoUrl?: string;
  /** 企业名称 */
  platformName?: string;
  /** 自定义json字段 */
  userData?: string;
  /** 当前所在部门id 仅selecteddeparts为多项才返回该字段 */
  orgCode?: string;
} & AppState;

/** 模型类型 */
export interface ModelTrainType {
  uniqueId: string | string[] | null;
  businessId?: string;
  businessType?: string;
  createBy?: string;
  createTime?: string;
  drillScore?: number;
  drillStatus?: string;
  drillTime?: string;
  drillType?: number;
  id?: string;
  name?: string;
  version?: string;
  intentTotal?: number;
  trainedIntentTotal?: number;
  trainedAnswerTotal?: number;
  untrainIntentTotal?: number;
  untrainAnswerTotal?: number;
  newIntentTypeIds?: string;
  intentTypeIds?: string;
  isOnline?: number;
  mapTypeIds?: string;
  custThesaurusSwitch?: string;
}

/** 用户菜单权限 */
export interface UserPermissionMenuItem {
  id?: string;
  component?: string;
  name?: string;
  path?: string;
  redirect?: string;
  meta?: {
    icon?: string;
    componentName?: string;
    title?: string;
  };
  hidden?: boolean;
  microName?: string;
  sortNo?: number;
  children?: UserPermissionMenuItem[];
}
export interface RobotAskItem {
  ID: string;
  Ask: string;
  Score: number;
  ProcessId?: string;
  Keyword: Array<string>;
}

/** 会话对话消息 */
export interface SessionMessageType {
  /** 消息ID */
  msgID?: string;
  /** 消息体 */
  content?: string;
  /** 角色 */
  role?: MessageRoleType;
  /** 角色ID */
  roleId?: string;
  /** 事件类型 */
  ActionType?: MessageActionType;
  /** 创建时间 */
  ts?: number;
  /** 撤回标记 */
  isWithdraw?: number;
  /** 消息类型 */
  mimeType?: string;
  /** 会话ID */
  sn?: string;
  /** 文件信息 */
  fileInfo?: string;
  /** 引导话术 */
  askPre?: string;
  /** 翻译话术 */
  translate?: string;
  /** 相似问 */
  similarAskLabelDataList?: Array<RobotAskItem> | null;
  /** 关联问 */
  relationAskDataList?: Array<RobotAskItem> | null;
  /** 流程自定义引导问 */
  processAskDataList?: Array<RobotAskItem> | null;
  /** 用户渠道 */
  source?: UserSource | 'agent';
  /** 机器人流程分支 */
  selectAskDataList?: { style: 0 | 1 | 2; labels: Array<string> };
  /** 智能辅助答案 */
  aiAssist?: { content: string; fileInfo: string; knowledgeName: string }[];
}

/** 质检内容 */
export interface QcResult {
  /** 规则告警信息 */
  checkPointInfo?: string;
  /** 告警信息栏 */
  alarmInfo?: string;
}
/** 质检结果 */
export interface CallQcResult {
  /** 消息类型
    0: 一句话
    1: 推荐话术
    2: 质检消息
    3: 中间转写结果
    4: 流程消息
    9: 质检+流程+完整对话
  */
  msgType?: number;
  /** 通话时间（秒） */
  connectTs: number;
  /** 句子下标 */
  index: number;
  /** 消息ID */
  msgID: string;
  sessionID: string;
  /** 话术开始时间(毫秒) */
  startTime: number;
  /** asr转写内容 */
  message: string;
  /** 角色: 0 客服 1用户 */
  channelID: '0' | '1';
  isDialogEnd?: 0 | 1;
  /** 质检结果 */
  qcResult: QcResult;
  /** 智能辅助结果 */
  cowDlResult: Array<{
    knowledgeID: string;
    knowledgeName: string;
    content: string;
    fileInfo: string;
    favStatus: '0' | '1' | '2';
  }>;
  /** 常规项检测 */
  normalNotice: {
    /** 坐席语速 */
    seatTalkingSpeed: string;
    /** 客户情绪 */
    userEmotionValue: string;
    /** 坐席情绪 */
    seatEmotionValue: string;
    /** 用户敏感词 */
    userSensitiveNotice: { word: string; count: number }[];
    /** 坐席敏感词 */
    seatSensitiveNotice: CallQcResult['normalNotice']['userSensitiveNotice'];
    /** 坐席抢话 */
    seatForestall: string;
    /** 坐席静音时长 */
    SeatMuteValue: string;
  };
  flowResult?: {
    /** 完成流程id集合 */
    processFinishIds?: string;
    /** 完成流程名称集合 */
    processFinishNames?: string;
    /** 命中子流程id集合 */
    processChildIds?: string;
    /** 命中子流程名称集合 */
    processChildNames?: string;
    /** 流程信息 */
    processInfo?: Array<{
      id: string;
      name: string;
      is_highlight: boolean;
      child?: Array<{
        id: number | string;
        name: string;
        tips: Array<string>;
        /** 是否命中子流程，0命中 ｜ 1未命中 */
        hit: 0 | 1;
        /** 消息下标 */
        index: number;
      }>;
    }>;
  };
  intelligentArchiving?: Record<
    1 | 2 | 3,
    Array<{
      /** 实体别名 */
      thesaurusAliasName: string;
      /** 实体id */
      thesaurusAliasID: string;
      /** 实体值 */
      value: string;
      extValue: string;
    }>
  >;
  /** 通话小结 */
  dialogSummary?: { content?: string[] };
}

/** 数据字典 */
export interface DataDictionaryType {
  id: string;
  /** 字典名称 */
  dictName?: string;
  /** 字典编号 */
  dictCode?: string;
  /** 描述 */
  description?: string;
}

/** 数据字典项 */
export interface DataDictionaryItemType {
  id: string;
  /** 数据字典ID */
  dictId?: string;
  /** 名称 */
  itemText?: string;
  /** 数据值 */
  itemValue?: string;
  /** 描述 */
  description?: string;
  /** 排序 */
  sortOrder?: number;
  /** 启用状态 */
  status?: 0 | 1;
}

/** ASR项 */
export interface ASRDataType {
  id: string;
  /** 数据ID */
  cloudType?: string;
  /** 数据来源 */
  enable?: number;
  /** 数据值 */
  languageType?: string;
  /** 语种类型 */
  samplingRate?: string;
  /** 排序 */
  supplierType?: string;
}

export type ProCategoryItem = {
  id?: string;
  name?: string;
  level?: number;
  parentId?: number;
  [key: string]: any;
};
/** 电话坐席技能组设置 */
export interface PhoneConfigType {
  /** 技能组ID */
  sysDepartId: string;
  /** 外显列表 */
  callersIdList: string;
  /** 实时转写 */
  realTimeConversion: boolean;
  /** 质检模板列表 */
  aiRealtimeZhijianTemplateList?: string;
  /** 实时质检状态 */
  aiRealtimeZhijianStatus?: 0 | 1;
  /** 智能辅助开关 */
  aiAssistStatus?: 0 | 1;
  /** 智能辅助模型 */
  aiAssistModel?: string;
  /** 实时转写开关 */
  asrRealtimeConversion?: 0 | 1;
  /** 流程导航状态	 */
  processNavigationStatus?: 0 | 1;
  /** 流程导航-流程列表 */
  processNavigationList?: string;
  /** 客户画像标签开关 */
  customerTagConversion: 0 | 1;
  /** 客户画像标签 */
  customerTagIds: string;
  /** 智能建档设置开关 */
  archiveConversion: 0 | 1;
  /** 建档内容 */
  archiveContentList: string;
  /** 坐席情绪检测 */
  seatMoodConversion: 0 | 1;
  /** 坐席情绪提示语 */
  seatMoodWarning: string;
  /** 客户情绪检测 */
  customerMoodConversion: 0 | 1;
  /** 客户情绪提示语 */
  customerMoodWarning: string;
  /** 坐席语速检测 */
  seatTalkingSpeedConversion: 0 | 1;
  /** 语速 */
  seatTalkingSpeed: number;
  /** 语速过快提示语 */
  seatTalkingWarning: string;
  /** 坐席抢话提示 */
  seatForestallConversion: 0 | 1;
  /** 抢话提示 */
  seatForestallWarning: string;
  /** 敏感测检测 */
  sensitiveConversion: 0 | 1;
  /** 敏感词提示 */
  sensitiveWarning: string;
  /** 静音时长检测 */
  silenceConversion: 0 | 1;
  /** 静音时长 */
  silenceSet: number;
  /** 静音时长提示语 */
  silenceWarning: string;
  satisfactionSettingId?: string;
}

export interface CallHistoryResult {
  callStartTime: number;
  checkProHitOrder: string;
  checkDetail: Record<'checkPointInfo' | 'alarmInfo', string>;
  speechRecommend?: string;
  normalNotice?: string;
  callAbstract?: string;
  callMarkId?: string;
  callMarkName?: string;
  callSummary?: string;
  processNavigationDetail: Omit<CallQcResult['flowResult'], 'processInfo'> & {
    processInfo: string;
  };
  content?: Array<{
    text: string;
    bps: number;
    msgID: string;
    type: '0' | '1';
    index: number;
  }>;
}

export interface ChannelItem {
  title: string;
  key: string;
  closable: boolean;
  fileList?: [];
  content?: string | null;
  type?: string;
  graphic?: GraphicType;
}
