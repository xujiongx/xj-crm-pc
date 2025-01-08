export interface RecordTapeItem {
  id: string;
  name: string;
  originId: string;
  robotId: string;
  recordType: number;
  contentText?: string;
  recordName?: string;
  recordUrl?: string;
  recordText?: string;
  isRecord?: 0 | 1;
  langType?: string;
  /** json 格式，scPosition、zjPosition、thPosition  */
  nlpAsrIndex?: string;
  nlpScore?: number;
  asrIndex?: {
    start: number;
    end: number;
    type: 'skip' | 'surplus' | 'error';
  }[];
  status?: 1 | 2 | -1;
  statusText?: string;
  actRecordName?: string;
  manualRecordId?: string;
  webUrl?: string;
}

export interface NLPAsrIndex {
  /** asr漏转的字 */
  sc_position: number[];
  /** asr多转的字 */
  zj_position: number[];
  /**
   * asr转错的字 下标0代表 asr转写文本下标，下标1代表 标准文本下标
   */
  th_position: [number, number][];
}
