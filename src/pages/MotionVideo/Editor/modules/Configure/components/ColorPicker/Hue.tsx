import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import './Hue.less';
import tinycolor, { ColorFormats } from 'tinycolor2';

interface HueProps {
  value: ColorFormats.RGBA;
  hue: number;
  onColorChange: (color: ColorFormats.HSLA) => void;
}

const Hue: React.FC<HueProps> = ({ value, hue, onColorChange }) => {
  const oldHue = useRef(0);
  const pullDirection = useRef('');

  const color = useMemo(() => {
    const hsla = tinycolor(value).toHsl();
    if (hue !== -1) hsla.h = hue;
    return hsla;
  }, [value, hue]);

  const pointerLeft = useMemo(() => {
    if (color.h === 0 && pullDirection.current === 'right') return '100%';
    return `${(color.h * 100) / 360}%`;
  }, [color]);

  const hueRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      if (!hueRef.current) return;

      const containerWidth = hueRef.current.clientWidth;
      const xOffset = hueRef.current.getBoundingClientRect().left + window.pageXOffset;
      const left = e.pageX - xOffset;
      let h;
      if (left < 0) h = 0;
      else if (left > containerWidth) h = 360;
      else {
        const percent = (left * 100) / containerWidth;
        h = (360 * percent) / 100;
      }
      if (hue === -1 || color.h !== h) {
        onColorChange({
          h,
          l: color.l,
          s: color.s,
          a: color.a,
        });
      }
    },
    [color, hue, onColorChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      handleChange(e as unknown as MouseEvent);
      window.addEventListener('mousemove', handleChange);
      window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', handleChange);
      }, { once: true });
    },
    [handleChange]
  );

  useEffect(() => {
    const hsla = tinycolor(value).toHsl();
    const h = hsla.s === 0 ? hue : hsla.h;
    if (h !== 0 && h - oldHue.current > 0) pullDirection.current = 'right';
    if (h !== 0 && h - oldHue.current < 0) pullDirection.current = 'left';
    oldHue.current = h;
  }, [value, hue]);

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleChange);
      window.removeEventListener('mouseup', handleChange);
    };
  }, [handleChange]);

  return (
    <div className="hue">
      <div
        className="hue-container"
        ref={hueRef}
        onMouseDown={handleMouseDown}
      >
        <div
          className="hue-pointer"
          style={{ left: pointerLeft }}
        >
          <div className="hue-picker"></div>
        </div>
      </div>
    </div>
  );
};

export default Hue;
