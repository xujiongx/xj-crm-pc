import { parseValueToDay } from '@aicc/shared';
import { useControllableValue } from 'ahooks';
import { DatePicker } from 'antd';
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { FC } from 'react';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

interface QRangePickerProps extends Omit<RangePickerProps, 'format'> {
  showTime?: boolean;
  /** 是否失效当前时间之前，默认可先前半年 */
  disabledNowBefore?: boolean;
  maxDays?: number;
}

const defaultShowTimeConfig = {
  format: 'HH:mm:ss',
  defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
};

const ProRangePicker: FC<QRangePickerProps> = ({
  style = { width: '100%' },
  showTime,
  disabledNowBefore,
  maxDays,
  ...rest
}) => {
  const [value, onChange] = useControllableValue(rest);
  const format = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';

  const valueChange = (values: any, formatString: [string, string]) => {
    if (values && format === 'YYYY-MM-DD') {
      onChange(
        [
          values[0]?.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          values[1]?.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        ],
        values,
      );
      return;
    }
    onChange(values ? formatString : undefined, values);
  };

  const momentValue = parseValueToDay(value) as any;

  const disabledDate: DatePickerProps['disabledDate'] = (current, { from }) => {
    if (maxDays) {
      if (current && current > dayjs().endOf('days')) {
        return true;
      }
      if (from) {
        return Math.abs(current.diff(from, 'days')) >= maxDays;
      }
      return false;
    } else {
      return disabledNowBefore
        ? current && current < dayjs()
        : current &&
            !current.isBetween(
              dayjs().add(-180, 'day'),
              dayjs().endOf('day'),
              'day',
              '(]',
            );
    }
  };

  return (
    <RangePicker
      presets={[
        {
          label: '今日',
          value: [dayjs(), dayjs().endOf('days')],
        },
        {
          label: '昨日',
          value: [
            dayjs().add(-1, 'days').startOf('days'),
            dayjs().add(-1, 'days').endOf('days'),
          ],
        },
        {
          label: '近7天',
          value: [
            dayjs().add(-6, 'days').startOf('days'),
            dayjs().endOf('days'),
          ],
        },
        {
          label: '近30天',
          value: [
            dayjs().add(-29, 'days').startOf('days'),
            dayjs().endOf('days'),
          ],
        },
      ]}
      placeholder={
        showTime ? ['开始时间', '结束时间'] : ['开始日期', '结束日期']
      }
      disabledDate={disabledDate}
      style={style}
      {...rest}
      format={format}
      showTime={showTime ? defaultShowTimeConfig : false}
      value={momentValue}
      onChange={valueChange}
    />
  );
};

export default ProRangePicker;
