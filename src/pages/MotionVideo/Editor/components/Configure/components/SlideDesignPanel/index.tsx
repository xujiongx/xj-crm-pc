import { Button, ColorPicker, Select, Slider } from 'antd';
import React, { useMemo } from 'react';
import Divider from '../Divider/index';
import FileInput from '../FileInput/index';
import { getImageDataURL } from '../../../../utils/image';
import useMainStore from '@/pages/MotionVideo/Editor/store/main';
import useSlideTheme from '@/pages/MotionVideo/Editor/store/slideTheme';
import useSlidesStore from '@/pages/MotionVideo/Editor/store/slides';
import useHistorySnapshot from '@/pages/MotionVideo/Editor/store/snapshot';
import FontSizeOutlined from '@ant-design/icons/FontSizeOutlined';
import FormatPainterFilled from '@ant-design/icons/FormatPainterFilled';
import FunnelPlotOutlined from '@ant-design/icons/FunnelPlotOutlined';
import IconPlus from '@ant-design/icons/PlusOutlined';
import { WEB_FONTS } from '../../../../config/font';
import './index.less';

interface Background {
  type: 'solid' | 'image' | 'gradient';
  color?: string;
  image?: string;
  imageSize?: 'contain' | 'cover' | 'repeat';
  gradientType?: 'linear' | 'radial';
  gradientColor?: [string, string];
  gradientRotate?: number;
}

const SlideDesignPanel: React.FC = () => {
  const availableFonts = useMainStore((store) => store.availableFonts);
  const slides = useSlidesStore((store) => store.slides);
  const currentSlide = useSlidesStore((store) => store.currentSlide);
  const theme = useSlidesStore((store) => store.theme);
  const updateSlide = useSlidesStore((store) => store.updateSlide);
  const setSlides = useSlidesStore((store) => store.setSlides);
  const setTheme = useSlidesStore((store) => store.setTheme);
  const addHistorySnapshot = useHistorySnapshot((store) => store.add);
  const {
    applyThemeToAllSlides,
  } = useSlideTheme();

  const background: Background = useMemo(() => {
    return (
      currentSlide()?.background || {
        type: 'solid',
        color: '#fff',
      }
    );
  }, [currentSlide]);

  const updateBackgroundType = (type: Background['type']) => {
    let newBackground: Background = { ...background };
    if (type === 'solid') {
      newBackground = {
        ...newBackground,
        type: 'solid',
        color: newBackground.color || '#fff',
      };
    } else if (type === 'image') {
      newBackground = {
        ...newBackground,
        type: 'image',
        image: newBackground.image || '',
        imageSize: newBackground.imageSize || 'cover',
      };
    } else {
      newBackground = {
        ...newBackground,
        type: 'gradient',
        gradientType: newBackground.gradientType || 'linear',
        gradientColor: newBackground.gradientColor || ['#fff', '#fff'],
        gradientRotate: newBackground.gradientRotate || 0,
      };
    }
    updateSlide({ background: newBackground });
    addHistorySnapshot();
  };

  const updateBackground = (props: Partial<Background>) => {
    updateSlide({ background: { ...background, ...props } });
    addHistorySnapshot();
  };

  const uploadBackgroundImage = async (files: FileList) => {
    const imageFile = files[0];
    if (imageFile) {
      const dataURL = await getImageDataURL(imageFile);
      updateBackground({ image: dataURL });
    }
  };

  const applyBackgroundAllSlide = () => {
    const newSlides = slides.map((slide) => ({
      ...slide,
      background: currentSlide()?.background,
    }));
    setSlides(newSlides);
    addHistorySnapshot();
  };

  const updateThemeProps = (themeProps: Partial<typeof theme>) => {
    setTheme(themeProps);
  };

  return (
    <div className="slide-design-panel">
      <div className="title">背景填充</div>
      <div className="row">
        <Select
          onChange={(value: Background['type']) => updateBackgroundType(value)}
          value={background.type}
          style={{ flex: 1 }}
          options={[
            { value: 'solid', label: <span>纯色填充</span> },
            { value: 'image', label: <span>图片填充</span> },
            { value: 'gradient', label: <span>渐变填充</span> },
          ]}
        />
        <div style={{ width: 10 }}></div>
        {background.type === 'solid' && (
          <ColorPicker
            value={background.color || '#fff'}
            onChange={(color) =>
              updateBackground({ color: color.toRgbString() })
            }
          >
            <div
              className="colorPick-btn"
              style={{ backgroundColor: background?.color || '#fff' }}
            >
              <FormatPainterFilled className="colorPick-btn-icon" />
            </div>
          </ColorPicker>
        )}
        {background.type === 'image' && (
          <Select
            onChange={(value: Background['imageSize']) =>
              updateBackground({ imageSize: value })
            }
            value={background.imageSize || 'cover'}
            style={{ flex: 1 }}
            options={[
              { value: 'contain', label: <span>缩放</span> },
              { value: 'repeat', label: <span>拼贴</span> },
              { value: 'cover', label: <span>缩放铺满</span> },
            ]}
          />
        )}
        {background.type === 'gradient' && (
          <Select
            onChange={(value: Background['gradientType']) =>
              updateBackground({ gradientType: value })
            }
            value={background.gradientType || null}
            style={{ flex: 1 }}
            options={[
              { value: 'linear', label: <span>线性渐变</span> },
              { value: 'radial', label: <span>径向渐变</span> },
            ]}
          />
        )}
      </div>

      {background.type === 'image' && (
        <div className="background-image-wrapper">
          <FileInput onChange={uploadBackgroundImage}>
            <div className="background-image">
              <div
                className="content"
                style={{ backgroundImage: `url(${background.image})` }}
              >
                <IconPlus />
              </div>
            </div>
          </FileInput>
        </div>
      )}

      {background.type === 'gradient' && (
        <div className="background-gradient-wrapper">
          <div className="row">
            <div style={{ width: '40%' }}>起点颜色：</div>
            <ColorPicker
              value={background.gradientColor
                ? background.gradientColor[0]
                : '#fff'}
              onChange={(color) =>
                updateBackground({
                  gradientColor: [
                    color.toRgbString(),
                    background.gradientColor
                      ? background.gradientColor[1]
                      : '#fff',
                  ],
                })
              }
            >
              <div
                className="colorPick-btn"
                style={{
                  backgroundColor: background.gradientColor
                    ? background.gradientColor[0]
                    : '#fff', width: '60%'
                }}
              >
                <FormatPainterFilled className="colorPick-btn-icon" />
              </div>
            </ColorPicker>
          </div>
          <div className="row">
            <div style={{ width: '40%' }}>终点颜色：</div>
            <ColorPicker
              value={background.gradientColor
                ? background.gradientColor[1]
                : '#fff'}
              onChange={(color) =>
                updateBackground({
                  gradientColor: [
                    background.gradientColor
                      ? background.gradientColor[0]
                      : '#fff',
                    color.toRgbString(),
                  ],
                })
              }
            >
              <div
                className="colorPick-btn"
                style={{
                  backgroundColor: background.gradientColor
                    ? background.gradientColor[1]
                    : '#fff', width: '60%'
                }}
              >
                <FormatPainterFilled className="colorPick-btn-icon" />
              </div>
            </ColorPicker>
          </div>
          {background.gradientType === 'linear' && (
            <div className="row">
              <div style={{ width: '40%' }}>渐变角度：</div>
              <Slider
                min={0}
                max={360}
                step={15}
                tooltip={{ placement: 'left' }}
                value={background.gradientRotate || 0}
                onChange={(value) =>
                  updateBackground({ gradientRotate: value })
                }
                style={{ width: '50%' }}
              />
            </div>
          )}
        </div>
      )}

      <div className="row">
        <Button style={{ flex: 1 }} onClick={applyBackgroundAllSlide}>
          应用背景到全部
        </Button>
      </div>

      <Divider />
      <div className="row">
        <div style={{ width: '40%' }}>字体：</div>
        <Select
          onChange={(value: string) => updateThemeProps({ fontName: value })}
          value={theme.fontName}
          style={{ width: '60%' }}
          options={availableFonts.concat(WEB_FONTS).map(font => (
            { value: font.value, label: font.label }
          ))}
        />
      </div>
      <div className="row">
        <div style={{ width: '40%' }}>字体颜色：</div>
        <ColorPicker
          value={theme.fontColor}
          onChange={(color) =>
            updateThemeProps({ fontColor: color.toRgbString() })
          }
        >
          <div
            className="colorPick-btn"
            style={{ backgroundColor: theme.fontColor, width: '60%' }}
          >
            <FontSizeOutlined className="colorPick-btn-icon" />
          </div>
        </ColorPicker>
      </div>
      <div className="row">
        <div style={{ width: '40%' }}>背景颜色：</div>
        <ColorPicker
          value={theme.backgroundColor}
          onChange={(color) =>
            updateThemeProps({ backgroundColor: color.toRgbString() })
          }
        >
          <div
            className="colorPick-btn"
            style={{ backgroundColor: theme.backgroundColor, width: '60%' }}
          >
            <FormatPainterFilled className="colorPick-btn-icon" />
          </div>
        </ColorPicker>
      </div>
      <div className="row">
        <div style={{ width: '40%' }}>主题色：</div>
        <ColorPicker
          value={theme.themeColor}
          onChange={(color) =>
            updateThemeProps({ themeColor: color.toRgbString() })
          }
        >
          <div
            className="colorPick-btn"
            style={{ backgroundColor: theme.themeColor, width: '60%' }}
          >
            <FunnelPlotOutlined className="colorPick-btn-icon" />
          </div>
        </ColorPicker>
      </div>


      <div className="row">
        <Button style={{ flex: 1 }} onClick={() => applyThemeToAllSlides()}>
          应用主题到全部
        </Button>
      </div>
    </div>
  );
};

export default SlideDesignPanel;
