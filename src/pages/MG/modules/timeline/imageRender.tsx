import gsap from 'gsap';
import { useEffect, useRef } from 'react';

const ImageRender = (props) => {
  const { item } = props;
  const ref = useRef(null);
  const gaspRef = useRef<null | gsap.core.Tween>(null);

  useEffect(() => {
    if (!ref.current || gaspRef.current) return;
    gaspRef.current = gsap
      .to(ref.current, {
        x: 200,
        rotation: 360,
        duration: item.duration,
      })
      .pause();
  }, [ref.current, item]);

  useEffect(() => {
    if (item.status === 'start') {
      gaspRef.current?.play();
    }
    if (item.status === 'update') {
      gaspRef.current?.progress(item.progress);
    }
    if (item.status === 'stop') {
      gaspRef.current?.pause();
    }
    if (item.status === 'leave') {
      gaspRef.current?.pause();
    }
  }, [item]);

  return (
    <img
      style={{
        visibility: item.visible ? 'visible' : 'hidden',
      }}
      ref={ref}
      src={item.src}
      alt={item.name}
    />
  );
};

export default ImageRender;
