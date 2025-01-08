import dayjs from 'dayjs';
import { isNil } from './utils';

/** 开始时间格式 */
export const START_TIME_FORMAT = 'YYYY-MM-DD 00:00:00';
/** 结束时间格式 */
export const END_TIME_FORMAT = 'YYYY-MM-DD 23:59:59';
/** 日期时间格式 */
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 格式日期时间段
 * @param date moment 时间段
 * @param startKey 开始时间key
 * @param endKey 结束时间key
 * @param showTime 是否显示时间
 * @returns
 */
export function getDateRangeValue(
  date: [dayjs.Dayjs, dayjs.Dayjs],
  startKey = 'start',
  endKey = 'end',
  showTime = false,
) {
  const values: Record<string, string | undefined> = {
    [startKey]: undefined,
    [endKey]: undefined,
  };
  if (date && date.length === 2) {
    values[startKey] = date[0].format(
      showTime ? DATE_TIME_FORMAT : START_TIME_FORMAT,
    );
    values[endKey] = date[1].format(
      showTime ? DATE_TIME_FORMAT : END_TIME_FORMAT,
    );
  }
  return values;
}

type DateValue =
  | dayjs.Dayjs
  | dayjs.Dayjs[]
  | string
  | string[]
  | number
  | number[];

export const parseValueToDay = (
  value: DateValue,
  formatter?: string,
): dayjs.Dayjs | dayjs.Dayjs[] | null | undefined => {
  if (isNil(value) || dayjs.isDayjs(value)) {
    return value as dayjs.Dayjs | null | undefined;
  }
  if (Array.isArray(value)) {
    return (value as any[]).map(
      (v) => parseValueToDay(v, formatter) as dayjs.Dayjs,
    );
  }
  if (typeof value === 'number') return dayjs(value);
  return value ? dayjs(value, formatter) : undefined;
};
