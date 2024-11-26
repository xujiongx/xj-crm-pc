import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import './Saturation.less';
import tinycolor, { ColorFormats } from 'tinycolor2';
import { throttle, clamp } from 'lodash';

interface SaturationProps {
  value: ColorFormats.RGBA;
  hue: number;
  onColorChange: (color: ColorFormats.HSVA) => void;
}

const Saturation: React.FC<SaturationProps> = ({ value, hue, onColorChange }) => {
  const saturationRef = useRef<HTMLDivElement>(null);

  const color = useMemo(() => {
    const hsva = tinycolor(value).toHsv();
    if (hue !== -1) hsva.h = hue;
    return hsva;
  }, [value, hue]);

  const bgColor = useMemo(() => `hsl(${color.h}, 100%, 50%)`, [color.h]);
  const pointerTop = useMemo(() => `${(-(color.v * 100) + 1) + 100}%`, [color.v]);
  const pointerLeft = useMemo(() => `${color.s * 100}%`, [color.s]);

  const emitChangeEvent = useCallback(throttle((param: ColorFormats.HSVA) => {
    onColorChange(param);
  }, 20, { leading: true, trailing: false }), [onColorChange]);

  const handleChange = useCallback((e: MouseEvent) => {
    e.preventDefault();
    if (!saturationRef.current) return;

    const containerWidth = saturationRef.current.clientWidth;
    const containerHeight = saturationRef.current.clientHeight;
    const xOffset = saturationRef.current.getBoundingClientRect().left + window.pageXOffset;
    const yOffset = saturationRef.current.getBoundingClientRect().top + window.pageYOffset;
    const left = clamp(e.pageX - xOffset, 0, containerWidth);
    const top = clamp(e.pageY - yOffset, 0, containerHeight);
    const saturation = left / containerWidth;
    const bright = clamp(-(top / containerHeight) + 1, 0, 1);

    emitChangeEvent({
      h: color.h,
      s: saturation,
      v: bright,
      a: color.a,
    });
  }, [color, emitChangeEvent]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    handleChange(e as unknown as MouseEvent);
    window.addEventListener('mousemove', handleChange);
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', handleChange);
    }, { once: true });
  }, [handleChange]);

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleChange);
      window.removeEventListener('mouseup', handleChange);
    };
  }, [handleChange]);

  return (
    <div 
      className="saturation"
      ref={saturationRef}
      style={{ background: bgColor }}
      onMouseDown={handleMouseDown}
    >
      <div className="saturation-white"></div>
      <div className="saturation-black"></div>
      <div className="saturation-pointer" style={{ top: pointerTop, left: pointerLeft }}>
        <div className="saturation-circle"></div>
      </div>
    </div>
  );
};

export default Saturation;
