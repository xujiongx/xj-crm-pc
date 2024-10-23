import BaseApply, {
  ApplyElementProps,
} from '@/components/Designer/components/Element/Base';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/** 获取距离开播时间多久 */
export const getDiffTime = (t: string) => {
  let date = dayjs().diff(dayjs(t, 'YYYY-MM-DD HH:mm'), 'ms');
  date = Math.abs(date);
  const time = dayjs.duration(date);
  const d = time.days();
  const h = time.hours();
  const m = time.minutes();
  return dayjs
    .duration(date)
    .format(`${d > 0 ? 'D天' : ''}${h ? 'HH时' : ''}${m ? 'mm分' : ''}ss秒`);
};

const LiveApplyElement = (props: ApplyElementProps) => (
  <BaseApply
    {...props}
    renderDeadline={(item) =>
      !item?.status && !dayjs().isAfter(item?.deadline)
        ? `距开始还有：45分`
        : ''
    }
    statusMap={{
      0: '未开始',
      1: '直播中',
      2: '已结束',
    }}
  />
);

export default LiveApplyElement;
