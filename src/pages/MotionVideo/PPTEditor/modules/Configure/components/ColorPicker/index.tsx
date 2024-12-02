import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { message } from 'antd';
import tinycolor, { ColorFormats } from 'tinycolor2';
import { debounce } from 'lodash';
import { toCanvas } from 'html-to-image';
import Alpha from './Alpha';
import Checkboard from './Checkboard';
import Hue from './Hue';
import Saturation from './Saturation';
import EditableInput from './EditableInput';
import './index.less';

interface ColorPickerProps {
  modelValue?: string;
  onChange?: (color: string) => void;
}

const RECENT_COLORS = 'RECENT_COLORS';

const presetColorConfig = [
  ['#7f7f7f', '#f2f2f2'],
  ['#0d0d0d', '#808080'],
  ['#1c1a10', '#ddd8c3'],
  ['#0e243d', '#c6d9f0'],
  ['#233f5e', '#dae5f0'],
  ['#632623', '#f2dbdb'],
  ['#4d602c', '#eaf1de'],
  ['#3f3150', '#e6e0ec'],
  ['#1e5867', '#d9eef3'],
  ['#99490f', '#fee9da'],
];

const gradient = (startColor: string, endColor: string, step: number) => {
  const _startColor = tinycolor(startColor).toRgb();
  const _endColor = tinycolor(endColor).toRgb();

  const rStep = (_endColor.r - _startColor.r) / step;
  const gStep = (_endColor.g - _startColor.g) / step;
  const bStep = (_endColor.b - _startColor.b) / step;
  const gradientColorArr = [];

  for (let i = 0; i < step; i++) {
    const gradientColor = tinycolor({
      r: _startColor.r + rStep * i,
      g: _startColor.g + gStep * i,
      b: _startColor.b + bStep * i,
    }).toRgbString();
    gradientColorArr.push(gradientColor);
  }
  return gradientColorArr;
};

const getPresetColors = () => {
  const presetColors = [];
  for (const color of presetColorConfig) {
    presetColors.push(gradient(color[1], color[0], 5));
  }
  return presetColors;
};

const themeColors = ['#000000', '#ffffff', '#eeece1', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c'];
const standardColors = ['#c21401', '#ff1e02', '#ffc12a', '#ffff3a', '#90cf5b', '#00af57', '#00afee', '#0071be', '#00215f', '#72349d'];

const ColorPicker: React.FC<ColorPickerProps> = ({ modelValue = '#e86b99', onChange }) => {
  const [color, setColor] = useState(tinycolor(modelValue).toRgb());
  const [hue, setHue] = useState(-1);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const presetColors = useMemo(() => getPresetColors(), []);
  const currentColor = useMemo(() => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`, [color]);

  useEffect(() => {
    const recentColorsCache = localStorage.getItem(RECENT_COLORS);
    if (recentColorsCache) setRecentColors(JSON.parse(recentColorsCache));
  }, []);

  useEffect(() => {
    localStorage.setItem(RECENT_COLORS, JSON.stringify(recentColors));
  }, [recentColors]);

  const updateRecentColorsCache = useCallback(debounce(() => {
    const _color = tinycolor(color).toRgbString();
    if (!recentColors.includes(_color)) {
      setRecentColors(prev => [_color, ...prev.slice(0, 9)]);
    }
  }, 300), [color, recentColors]);

  const changeColor = (value: ColorFormats.RGBA | ColorFormats.HSLA | ColorFormats.HSVA) => {
    if ('h' in value) {
      setHue(value.h);
      setColor(tinycolor(value).toRgb());
    } else {
      setHue(tinycolor(value).toHsl().h);
      setColor(value);
    }
    updateRecentColorsCache();
    if (onChange) onChange(`rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`);
  };

  const selectPresetColor = (colorString: string) => {
    setHue(tinycolor(colorString).toHsl().h);
    setColor(tinycolor(colorString).toRgb());
    if (onChange) onChange(colorString);
  };

  const openEyeDropper = () => {
    if ('EyeDropper' in window) {
      browserEyeDropper();
    } else {
      customEyeDropper();
    }
  };

  const browserEyeDropper = () => {
    message.success('按 ESC 键关闭取色吸管', 0);
    const eyeDropper = new (window as any).EyeDropper();
    eyeDropper.open().then((result: { sRGBHex: string }) => {
      const tColor = tinycolor(result.sRGBHex);
      setHue(tColor.toHsl().h);
      setColor(tColor.toRgb());
      updateRecentColorsCache();
    }).catch(() => {
      message.destroy();
    });
  };

  const customEyeDropper = () => {
    const targetRef: HTMLElement | null = document.querySelector('.canvas');
    if (!targetRef) return;

    const maskRef = document.createElement('div');
    maskRef.style.cssText = 'position: fixed; top: 0; left: 0; bottom: 0; right: 0; z-index: 9999; cursor: wait;';
    document.body.appendChild(maskRef);

    const colorBlockRef = document.createElement('div');
    colorBlockRef.style.cssText = 'position: absolute; top: -100px; left: -100px; width: 16px; height: 16px; border: 1px solid #000; z-index: 999';
    maskRef.appendChild(colorBlockRef);

    const { left, top, width, height } = targetRef.getBoundingClientRect();

    const filter = (node: HTMLElement) => {
      if (node.tagName && node.tagName.toUpperCase() === 'FOREIGNOBJECT') return false;
      if (node.classList && node.classList.contains('operate')) return false;
      return true;
    };

    toCanvas(targetRef, { filter, fontEmbedCSS: '', width, height, canvasWidth: width, canvasHeight: height, pixelRatio: 1 }).then(canvasRef => {
      canvasRef.style.cssText = `position: absolute; top: ${top}px; left: ${left}px; cursor: crosshair;`;
      maskRef.style.cursor = 'default';
      maskRef.appendChild(canvasRef);

      const ctx = canvasRef.getContext('2d');
      if (!ctx) return;

      let currentColor = '';
      const handleMousemove = (e: MouseEvent) => {
        const x = e.x;
        const y = e.y;

        const mouseX = x - left;
        const mouseY = y - top;

        const [r, g, b, a] = ctx.getImageData(mouseX, mouseY, 1, 1).data;
        currentColor = `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;

        colorBlockRef.style.left = x + 10 + 'px';
        colorBlockRef.style.top = y + 10 + 'px';
        colorBlockRef.style.backgroundColor = currentColor;
      };

      const handleMouseleave = () => {
        currentColor = '';
        colorBlockRef.style.left = '-100px';
        colorBlockRef.style.top = '-100px';
        colorBlockRef.style.backgroundColor = '';
      };

      const handleMousedown = (e: MouseEvent) => {
        if (currentColor && e.button === 0) {
          const tColor = tinycolor(currentColor);
          setHue(tColor.toHsl().h);
          setColor(tColor.toRgb());
          updateRecentColorsCache();
        }
        document.body.removeChild(maskRef);

        canvasRef.removeEventListener('mousemove', handleMousemove);
        canvasRef.removeEventListener('mouseleave', handleMouseleave);
        window.removeEventListener('mousedown', handleMousedown);
      };

      canvasRef.addEventListener('mousemove', handleMousemove);
      canvasRef.addEventListener('mouseleave', handleMouseleave);
      window.addEventListener('mousedown', handleMousedown);
    }).catch(() => {
      message.error('取色吸管初始化失败');
      document.body.removeChild(maskRef);
    });
  };

  return (
    <div className="color-picker">
      <div className="picker-saturation-wrap">
        <Saturation value={color} hue={hue} onColorChange={changeColor} />
      </div>
      <div className="picker-controls">
        <div className="picker-color-wrap">
          <div className="picker-current-color" style={{ background: currentColor }}></div>
          <Checkboard />
        </div>
        <div className="picker-sliders">
          <div className="picker-hue-wrap">
            <Hue value={color} hue={hue} onColorChange={changeColor} />
          </div>
          <div className="picker-alpha-wrap">
            <Alpha value={color} onColorChange={changeColor} />
          </div>
        </div>
      </div>

      <div className="picker-field">
        <EditableInput className="input" value={color} onColorChange={changeColor} />
        <div className="straw" onClick={openEyeDropper}></div>
        <div className="transparent" onClick={() => selectPresetColor('#00000000')}>
          <Checkboard />
        </div>
      </div>

      <div className="picker-presets">
        {themeColors.map(c => (
          <div
            key={c}
            className="picker-presets-color"
            style={{ background: c }}
            onClick={() => selectPresetColor(c)}
          ></div>
        ))}
      </div>

      <div className="picker-gradient-presets">
        {presetColors.map((col, index) => (
          <div key={index} className="picker-gradient-col">
            {col.map(c => (
              <div
                key={c}
                className="picker-gradient-color"
                style={{ background: c }}
                onClick={() => selectPresetColor(c)}
              ></div>
            ))}
          </div>
        ))}
      </div>

      <div className="picker-presets">
        {standardColors.map(c => (
          <div
            key={c}
            className="picker-presets-color"
            style={{ background: c }}
            onClick={() => selectPresetColor(c)}
          ></div>
        ))}
      </div>

      {recentColors.length > 0 && <div className="recent-colors-title">最近使用：</div>}
      <div className="picker-presets">
        {recentColors.map(c => (
          <div
            key={c}
            className="picker-presets-color alpha"
            onClick={() => selectPresetColor(c)}
          >
            <div className="picker-presets-color-content" style={{ background: c }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
