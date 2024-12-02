import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import './Alpha.less';
import Checkboard from './Checkboard';

interface ColorFormatsRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface AlphaProps {
  value: ColorFormatsRGBA;
  onColorChange: (color: ColorFormatsRGBA) => void;
}

const Alpha: React.FC<AlphaProps> = ({ value, onColorChange }) => {
  const alphaRef = useRef<HTMLDivElement>(null);

  const color = useMemo(() => value, [value]);

  const gradientColor = useMemo(() => {
    const rgbaStr = `${color.r},${color.g},${color.b}`;
    return `linear-gradient(to right, rgba(${rgbaStr}, 0) 0%, rgba(${rgbaStr}, 1) 100%)`;
  }, [color]);

  const handleChange = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      if (!alphaRef.current) return;

      const containerWidth = alphaRef.current.clientWidth;
      const xOffset = alphaRef.current.getBoundingClientRect().left + window.pageXOffset;
      const left = e.pageX - xOffset;
      let a;

      if (left < 0) a = 0;
      else if (left > containerWidth) a = 1;
      else a = Math.round((left * 100) / containerWidth) / 100;

      if (color.a !== a) {
        onColorChange({ ...color, a });
      }
    },
    [color, onColorChange]
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

  return (
    <div className="alpha">
      <div className="alpha-checkboard-wrap">
        <Checkboard />
      </div>
      <div className="alpha-gradient" style={{ background: gradientColor }}></div>
      <div
        className="alpha-container"
        ref={alphaRef}
        onMouseDown={handleMouseDown}
      >
        <div className="alpha-pointer" style={{ left: `${color.a * 100}%` }}>
          <div className="alpha-picker"></div>
        </div>
      </div>
    </div>
  );
};

export default Alpha;
