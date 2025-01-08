import { Editor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export const interprets = [
  { label: '整数或小数(sayAsCardinal)', value: 'cardinal' },
  { label: '数字(sayAsDigits)', value: 'digits' },
  { label: '电话号码(sayAsTelephones)', value: 'telephone' },
  { label: '人名(sayAsName)', value: 'name' },
  { label: '地址(sayAsAddress)', value: 'address' },
  { label: 'ID(sayId)', value: 'id' },
  { label: '字符(sayAsCharacters)', value: 'characters' },
  { label: '标点符号(sayASPunctuation)', value: 'punctuation' },
  { label: '日期(sayAsDate)', value: 'date' },
  { label: '时间(sayAsTime)', value: 'time' },
  { label: '金额(sayAsCurrency)', value: 'currency' },
  { label: '计量单位(sayAsMeasure)', value: 'measure' },
];

export type EditorType = Editor & ReactEditor & HistoryEditor;
