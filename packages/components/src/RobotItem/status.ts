// 关卡状态
export const ROBOT_TYPE_STATUS = [
  { label: '交互类', value: 1, status: 'processing' },
  { label: '通知类', value: 0, status: 'warn' },
];

/** 外呼机器人，录音合成状态 */
export const ROBOT_VOICE_STATUS: Record<number, string> = {
  0: '未合成',
  1: '合成中',
  2: '已完成',
};
