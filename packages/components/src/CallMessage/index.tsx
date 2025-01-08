import type { CallQcResult, CallHistoryResult } from '@aicc/types';
import type { Subscription } from 'centrifuge';
import Customer from './Components/Customer';
import Recommend from './Components/Recommend';
import Regulation from './Components/Regulation';
import Seat from './Components/Seat';
import Emotions from './Components/Emotion';
import UserProfile from './Components/UserProfile';
import Knowledge from './Components/Knowledge';
import type { AlarmItem } from '../CallAlarm';

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
  /** 满意度ID */
  satisfactionSettingId?: string;
}

export interface QCRules
  extends Record<
    string,
    {
      warn: 0 | 1;
      name: string;
      msg: string;
      detail?: Array<{ index: number; keyword?: string }>;
    }
  > {}

export type QCAlarmInfo = Array<{
  warningLevelId: string;
  warningLevel: number;
  warningLevelName: string;
  checkPointId: number;
  checkPointName: string;
  color: string;
  text: string;
  tip: string;
  index: number;
  hitDetail?: {
    hitGroup?: Array<string>;
    HitTextIndexInfo?: Array<{
      index: number;
      text: string;
    }>;
  };
}>;

export interface FlowResultType {
  index: number;
  message_id: string;
  text: string;
  distance: number;
  keyword: string;
  sim_text: string;
}
/** 常规检测 */
export type EmotionType = Partial<CallQcResult['normalNotice']>;

interface FlowType {
  main_process_id: string | number;
  main_process_name: string;
  main_process_result: FlowResultType;
  sub_process: Array<{
    sub_process_name: string;
    sub_process_id: string | number;
    sub_process_result: Array<FlowResultType>;
  }>;
}

export interface CallMessageType {
  /** 结束时间 */
  sourceEps?: number;
  /** 开始时间 */
  sourceBps?: number;
  /** 结束时间 */
  bps?: number;
  /** 开始时间 */
  eps?: number;
  /** 通话id */
  callCode?: string;
  /** 句子第几秒开始毫秒 */
  bpsMillisecond?: number;
  /** 句子第几秒结束毫秒 */
  epsMillisecond?: number;
  /** 情绪 */
  emotionValue?: string;
  /** 静音时长 */
  silenceDuration?: number;
  /** 音量大小 */
  soundVolume?: string;
  /** 语速 */
  speechRate?: number;
  /** 会话开始时间 */
  starttime?: number;
  /** 转写开始时间 */
  begintime?: number;
  /** 转写结束问题 */
  endtime?: number;
  confidence?: number;
  index?: number;
  sentence_id?: string;
  result: string;
  html?: string;
  time?: number;
  role: 'user' | 'seat' | 'system';
  status?: 0 | 1;
  name?: string;
  ts: number;
  active?: boolean;
  /** 质检命中规则 */
  regular?: Array<{
    /** 规则名称 */
    name: string;
    /** 是否预警规则 */
    warn: boolean;
    /** 预警规则提示 */
    tooltip?: string | null;
    /** 告警显示时长 */
    duration?: number;
    /** 角标 */
    index?: number;
    /** 颜色 */
    color?: string;
  }>;
  recommend?: Array<{
    id: string;
    favStatus?: 0 | 1 | 2;
    title: string;
    isGraphic?: boolean;
    content: string;
    fileList: Array<any>;
  }>;
  flow?: Array<{
    processName: string;
    score: number;
    text: string;
  }>;
}

export interface CallSessionItem
  extends Partial<NonNullable<ReturnType<typeof formatFlowResult>>> {
  agentId?: string;
  /** 接入时间 */
  accessTime: number;
  /** 通话持续时间 */
  recDuration?: number;
  /** 客户电话 */
  phone: string;
  /** 客户姓名 */
  customerName?: string;
  /** 坐席电话 */
  callerPhone?: string;
  /** 座席姓名 */
  agentName?: string;
  /** 呼叫类型 */
  callType: 'callIn' | 'callOut';
  /** 会话ID */
  confno?: string;
  /** 转写内容 */
  messages: Array<
    CallMessageType & {
      currentFlow?: Record<'flowId' | 'subFlowId', string | number>;
    }
  >;
  emotions?: EmotionType;
  /** 告警信息栏 */
  alarms: ReturnType<typeof transferQCResult>['alarm'];
  /** 实时质检管道 */
  subscription?: Subscription;
  /** 随路数据 */
  dataMap?: Record<string, any>;
}

/** 处理流程导航 */
export const formatFlowResult = (
  data: CallQcResult['flowResult'],
  messageIndex?: number,
) => {
  if (!data?.processInfo?.length) return;
  const { processInfo } = data;
  let currentFlow = undefined as
    | Record<'flowId' | 'subFlowId', string | number>
    | undefined;
  let flowIdMap: Map<string | number, Array<string | number>> = new Map();
  const flowResult = processInfo
    ?.map(({ id, name, child, is_highlight }, index) => {
      /** 命中的子流程信息 */
      const checkedIds = child?.filter(({ hit }) => hit === 0);
      if (is_highlight) {
        flowIdMap.set(id, checkedIds?.map(({ id }) => id) || []);
      }
      return {
        id,
        name,
        title: name,
        checked: is_highlight,
        sort: is_highlight ? index : processInfo?.length,
        children:
          child?.map((subItem) => {
            /** 当前句子命中的流程信息 */
            if (subItem.index === messageIndex) {
              currentFlow = { flowId: id, subFlowId: subItem.id };
            }
            return {
              id: subItem.id,
              name: subItem.name,
              title: subItem.name,
              status:
                subItem.hit === 0 ? ('finish' as const) : ('undone' as const),
              message: subItem.tips,
            };
          }) || [],
      };
    })
    .sort((a, b) => a.sort - b.sort);

  return {
    flowId: flowIdMap,
    currentFlow,
    flowResult,
  };
};

/** 转换质检数据结构 */
export const transferQCResult = (
  data: CallQcResult,
  config?: { aiRealtimeZhijianStatus?: 0 | 1; aiAssistStatus?: 0 | 1 },
) => {
  const {
    index,
    msgID,
    message,
    qcResult,
    cowDlResult,
    channelID,
    startTime,
    connectTs,
    normalNotice,
  } = data;
  const { aiRealtimeZhijianStatus = 1, aiAssistStatus = 1 } = config || {};
  let rules: CallMessageType['regular'] | undefined = undefined;
  let alarms: Array<AlarmItem> | undefined = undefined;
  let knowledge: CallMessageType['recommend'] | undefined = undefined;
  let tags = [];
  /** 客户画像  */
  let customerRuleMaper: typeof tags = [];
  /** 质检结果 */
  if (qcResult && aiRealtimeZhijianStatus) {
    const { checkPointInfo, alarmInfo } = qcResult;
    alarms = (JSON.parse(alarmInfo || '[]') as QCAlarmInfo)?.map(
      (item, index) => ({
        regularName: item?.checkPointName,
        messageId: item?.checkPointId,
        color: item.color,
        index: item.index,
        level: item.warningLevel,
        levelName: item.warningLevelName,
        tip: item.tip,
        text: item.text,
        key: index + 1,
        hitDetail: item.hitDetail?.HitTextIndexInfo,
      }),
    );
    const pointInfo = JSON.parse(checkPointInfo || '[]') as QCRules;
    rules = Object.keys(pointInfo)
      ?.filter((key) =>
        pointInfo[key].detail?.find((item) => item.index === index),
      )
      .map((key) => {
        const { name, warn, msg } = pointInfo[key];
        const alarm = alarms?.find((item) => item.messageId === Number(key));
        return {
          name,
          warn: warn === 1,
          tooltip: msg,
          index: alarm?.key,
          color: alarm?.color,
        };
      });
    // emotions = {
    //   waiter_emotion,
    //   customer_emotion,
    //   speed_detect,
    //   qianghua: qianghua ? '抢话' : '正常',
    //   seat_sensitive_word_detect: seat_sensitive_word_detect?.join('、'),
    //   customer_sensitive_word_detect:
    //     customer_sensitive_word_detect?.join('、'),
    // };
  }
  /** 智能推荐结果 */
  if (cowDlResult?.length && aiAssistStatus) {
    knowledge = cowDlResult?.map((item) => ({
      title: item.knowledgeName,
      id: item.knowledgeID,
      favStatus: Number(item.favStatus || 0) as 0 | 1 | 2,
      content: item.content,
      fileList: JSON.parse(item.fileInfo || '[]'),
    }));
  }
  /** 流程信息 */
  const flowInfo = formatFlowResult(data?.flowResult, data?.index);

  return {
    result: message,
    sentence_id: msgID,
    role: (message !== '_end_'
      ? channelID === '0'
        ? 'seat'
        : 'user'
      : 'system') as CallMessageType['role'],
    ts: connectTs + startTime / 1000,
    regular: rules,
    recommend: knowledge,
    emotions: normalNotice,
    tags,
    customerRuleMaper,
    alarm: alarms,
    flowId: flowInfo?.flowId,
    flowResult: flowInfo?.flowResult,
    currentFlow: flowInfo?.currentFlow,
  };
};

export const formatQCHistoryV2 = (data: CallHistoryResult) => {
  const {
    callStartTime,
    checkDetail,
    content,
    normalNotice,
    processNavigationDetail,
    callMarkId,
    callMarkName,
    callSummary,
    callAbstract,
  } = data;

  const alarms = (JSON.parse(checkDetail?.alarmInfo || '[]') as QCAlarmInfo)
    ?.filter((item) => item.index >= 0)
    .map((item, index) => ({
      regularName: item?.checkPointName,
      messageId: item.checkPointId,
      color: item.color,
      index: item.index,
      level: item.warningLevel,
      levelName: item.warningLevelName,
      tip: item.tip,
      text: item.text,
      key: index + 1,
      hitDetail: item.hitDetail?.HitTextIndexInfo,
    }));

  /** 整通会话命中的规则信息 */
  let regularMap = Object.entries(
    JSON.parse(checkDetail?.checkPointInfo || '{}') as QCRules,
  )?.reduce<Record<string, CallMessageType['regular']>>(
    (result, [ruleId, current]) => {
      const { detail = [], name, warn, msg } = current;
      if (!detail) return {};
      for (const item of detail) {
        const ruleItem = alarms.find(
          (item) => item.messageId === Number(ruleId),
        );
        if (item.index !== -1) {
          const regularItem = {
            name,
            warn: warn === 1,
            tooltip: msg,
            color: ruleItem?.color,
            index: ruleItem?.key,
            id: ruleId,
          };
          result[item.index] = result[item.index]?.length
            ? result[item.index]?.concat([regularItem])
            : [regularItem];
        }
      }
      return result;
    },
    {},
  );

  const { flowResult } =
    formatFlowResult({
      ...processNavigationDetail,
      processInfo: JSON.parse(processNavigationDetail?.processInfo || '[]'),
    }) || {};

  const messages = content?.map<CallMessageType>(
    ({ msgID, text, index, type, bps, ...rest }) => {
      const recommendMap = JSON.parse(data?.speechRecommend || '{}');
      const recommend = recommendMap?.[index]?.map((item) => ({
        id: item.knowledgeID,
        favStatus: Number(item.favStatus || 0),
        title: item.knowledgeName,
        content: item.content,
        fileList: JSON.parse(item.fileInfo || '[]'),
      }));
      return {
        sentence_id: msgID,
        result: text,
        index,
        recommend,
        role: (text !== '_end_'
          ? type === '0'
            ? 'seat'
            : 'user'
          : 'system') as CallMessageType['role'],
        ts: callStartTime + bps,
        regular: regularMap[index],
        bps,
        ...rest,
      };
    },
  );

  return {
    alarm: alarms,
    flowGuide: flowResult,
    messages,
    emotions: normalNotice
      ? (JSON.parse(normalNotice) as CallQcResult['normalNotice'])
      : undefined,
    callMark: {
      callMarkId: callMarkId?.split('@')?.filter((str) => str),
      callMarkName: callMarkName?.split('@')?.filter((str) => str),
      callSummary,
    },
    sessionSummary: callAbstract
      ? (JSON.parse(callAbstract)?.content as string[])?.filter((str) => str)
      : undefined,
  };
};

/** 处理质检历史数据 */
export const formatQCHistory = (data: {
  flow_result: string;
  keywords_duration_location: string;
}) => {
  const { keywords_duration_location, flow_result } = data;
  const FlowResult = JSON.parse(flow_result || '[]') as FlowType[];
  const flowResultMap: Record<string | number, CallMessageType['flow']> = {};
  /** 流程结果 */
  const flowId = FlowResult?.reduce((acc, current) => {
    const {
      main_process_id: id,
      sub_process,
      main_process_result,
      main_process_name,
    } = current;
    const { index, sim_text, distance } = main_process_result || {};
    const temp = flowResultMap[index] || [];
    temp?.push({
      processName: main_process_name,
      text: sim_text,
      score: distance,
    });
    flowResultMap[index] = temp;
    /** 子流程命中结果 */
    const subProcessId = sub_process.map((item) => {
      const { sub_process_id, sub_process_name, sub_process_result } = item;
      sub_process_result?.forEach(({ index: subIndex, sim_text, distance }) => {
        const temp = flowResultMap[subIndex] || [];
        temp?.push({
          processName: sub_process_name,
          text: sim_text,
          score: distance,
        });
        flowResultMap[subIndex] = temp;
      });
      return sub_process_id;
    });
    acc.set(id, subProcessId);
    return acc;
  }, new Map<string | number, Array<string | number>>());
  const regular = JSON.parse(keywords_duration_location || '[]');
  /** 质检结果 */
  const qcMap: Record<string, CallMessageType['regular']> = {};
  regular?.forEach(
    (item: {
      index: number;
      rule: Array<Record<'name' | 'alarm_txt', string> & { alarm: 0 | 1 }>;
    }) => {
      const { index, rule } = item;
      qcMap[index] = rule?.map(({ name, alarm, alarm_txt }) => ({
        name,
        warn: alarm === 1,
        tooltip: alarm_txt,
      }));
    },
  );
  return {
    flowId,
    flowResultMap,
    qcMap,
    FlowResult,
  };
};

/** 常规检测警告 */
export const emotionsWarn = (
  result: CallQcResult['normalNotice'],
  config: PhoneConfigType | null,
) => {
  const normal = ['满意', '自然', '无', '共情', '热情'];
  const {
    seatSensitiveNotice,
    userSensitiveNotice,
    seatEmotionValue,
    userEmotionValue,
    seatTalkingSpeed: speed_detect,
    seatForestall,
  } = result;
  const text: Record<'text' | 'type', string>[] = [];
  const {
    sensitiveWarning = '',
    sensitiveConversion,
    seatMoodConversion,
    seatMoodWarning = '',
    customerMoodConversion,
    customerMoodWarning = '',
    seatTalkingSpeed = 0,
    seatTalkingSpeedConversion,
    seatTalkingWarning = '',
    seatForestallConversion,
    seatForestallWarning = '',
  } = config || {};

  if (sensitiveConversion && seatSensitiveNotice?.length) {
    text.push({ type: '坐席敏感词', text: sensitiveWarning });
  }
  if (sensitiveConversion && userSensitiveNotice?.length) {
    text.push({ type: '客户敏感词', text: sensitiveWarning });
  }
  if (!normal.includes(seatEmotionValue || '自然') && seatMoodConversion) {
    text.push({ type: '坐席情绪', text: seatMoodWarning });
  }
  if (!normal.includes(userEmotionValue || '自然') && customerMoodConversion) {
    text.push({ type: '客户情绪', text: customerMoodWarning });
  }
  if (
    seatTalkingSpeedConversion &&
    Number(speed_detect || 0) > seatTalkingSpeed
  ) {
    text.push({ type: '坐席语速过快', text: seatTalkingWarning });
  }
  if (seatForestallConversion && seatForestall === '1') {
    text.push({ type: '坐席抢话', text: seatForestallWarning });
  }
  return text;
};

export const prefix = 'call-message';

export {
  Customer,
  Recommend,
  Regulation,
  Seat,
  Emotions,
  UserProfile,
  Knowledge,
};
