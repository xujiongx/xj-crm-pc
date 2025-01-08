import { useCountDown } from 'ahooks';

interface CountdownProps {
  leftTime: number;
  onEnd?: () => void;
}

const getNumber = (number: number) => {
  return number < 10 ? `0${number}` : number;
};

const Countdown = ({ leftTime, onEnd }: CountdownProps) => {
  const [_, formattedRes] = useCountDown({ leftTime, onEnd });

  return (
    <span>
      {!!formattedRes.days && `${formattedRes.days}天 `}
      {getNumber(formattedRes.hours)}:{getNumber(formattedRes.minutes)}:
      {getNumber(formattedRes.seconds)}
    </span>
  );
};

export default Countdown;
