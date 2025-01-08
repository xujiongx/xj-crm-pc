import useHistorySnapshot from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/components/PPTEditor/store';
import {
  SHAPE_LIST,
  SHAPE_PATH_FORMULAS,
  ShapePoolItem,
} from '@/pages/MotionVideo/config/shapes';
import {
  GradientType,
  PPTElement,
  PPTShapeElement,
  ShapeText,
} from '@/pages/MotionVideo/interface';
import { Gradient } from '@/pages/MotionVideo/types/slides';
import {
  AlignTextBottomOne,
  AlignTextMiddleOne,
  AlignTextTopOne,
  Down,
  FormatBrush,
} from '@icon-park/react';
import { ColorPicker, Popover, Slider } from 'antd';
import { useEffect, useState } from 'react';
import ShapeItemThumbnail from '../../../../Material/components/ShapeMaterial/ShapeItemThumbnail';
import CheckboxButton from '../../../components/CheckboxButton';
// import ColorPicker from '../../../components/ColorPicker';
import useShapeFormatPainter from '@/pages/MotionVideo/components/PPTEditor/hooks/useShapeFormatPainter';
import { BgColorsOutlined } from '@ant-design/icons';
import ActionIcon from '../../../../Canvas/components/ActionIcon';
import ElementFlip from '../../../components/common/ElementFlip';
import ElementOpacity from '../../../components/common/ElementOpacity';
import ElementOutline from '../../../components/common/ElementOutline';
import ElementShadow from '../../../components/common/ElementShadow';
import Divider from '../../../components/Divider';
import GradientBar from '../../../components/GradientBar';
import RadioButton from '../../../components/RadioButton';
import RadioGroup from '../../../components/RadioGroup';
import RichTextBase from '../../../components/RichTextBase';
import Select from '../../../components/Select';
import './index.less';

const ShapeStylePanel = () => {
  const handleElement = useMainStore((state: any) => state.handleElement)(); // 根据实际Redux store结构调整
  const handleElementId = useMainStore((state: any) => state.activeElementId); // 根据实际Redux store结构调整
  const shapeFormatPainter = useMainStore(
    (state: any) => state.shapeFormatPainter,
  );

  const { addHistorySnapshot } = useHistorySnapshot();
  const { toggleShapeFormatPainter } = useShapeFormatPainter();

  const shapeUpdateElement = useSlidesStore((store) => store.updateElement);
  const removeElementProps = useSlidesStore(
    (store) => store.removeElementProps,
  );

  const [fill, setFill] = useState<string>('#000');
  const [gradient, setGradient] = useState<Gradient>({
    type: 'linear',
    rotate: 0,
    colors: [
      { pos: 0, color: '#fff' },
      { pos: 100, color: '#fff' },
    ],
  });
  const [fillType, setFillType] = useState<'fill' | 'gradient'>('fill');
  const [textAlign, setTextAlign] = useState<'top' | 'middle' | 'bottom'>(
    'middle',
  );
  const [currentGradientIndex, setCurrentGradientIndex] = useState(0);

  useEffect(() => {
    if (!handleElement || handleElement.type !== 'shape') return;

    setFill(handleElement.fill || '#fff');
    const defaultGradientColor = [
      { pos: 0, color: fill },
      { pos: 100, color: '#fff' },
    ];
    setGradient(
      handleElement.gradient || {
        type: 'linear',
        rotate: 0,
        colors: defaultGradientColor,
      },
    );
    setFillType(handleElement.gradient ? 'gradient' : 'fill');
    setTextAlign(handleElement.text?.align || 'middle');
  }, [JSON.stringify(handleElement), handleElementId]);

  const updateElement = (props: Partial<PPTElement>) => {
    shapeUpdateElement({ id: handleElementId, props });
    addHistorySnapshot();
  };

  const updateFillType = (type: 'gradient' | 'fill') => {
    if (type === 'fill') {
      removeElementProps({
        id: handleElementId,
        propName: 'gradient',
      });
      addHistorySnapshot();
    } else {
      setCurrentGradientIndex(0);
      updateElement({ gradient: gradient });
    }
  };

  const updateGradient = (gradientProps: Partial<Gradient>) => {
    if (!gradient) return;
    const _gradient = { ...gradient, ...gradientProps };
    updateElement({ gradient: _gradient });
  };

  const updateGradientColors = (color: string) => {
    const colors = gradient.colors.map((item, index) => {
      if (index === currentGradientIndex) return { ...item, color };
      return item;
    });
    updateGradient({ colors });
  };

  const updateFill = (value: string) => {
    updateElement({ fill: value });
  };

  const changeShape = (shape: ShapePoolItem) => {
    const { width, height } = handleElement as PPTShapeElement;
    const props: Partial<PPTShapeElement> = {
      viewBox: shape.viewBox,
      path: shape.path,
      special: shape.special,
    };
    if (shape.pathFormula) {
      props.pathFormula = shape.pathFormula;
      props.viewBox = [width, height];

      const pathFormula = SHAPE_PATH_FORMULAS[shape.pathFormula];
      if ('editable' in pathFormula) {
        props.path = pathFormula.formula(
          width,
          height,
          pathFormula.defaultValue,
        );
        props.keypoints = pathFormula.defaultValue;
      } else props.path = pathFormula.formula(width, height);
    } else {
      props.pathFormula = undefined;
      props.keypoints = undefined;
    }
    updateElement(props);
  };

  const updateTextAlign = (align: 'top' | 'middle' | 'bottom') => {
    const _handleElement = handleElement as PPTShapeElement;

    const defaultText: ShapeText = {
      content: '',
      defaultFontName: '微软雅黑',
      defaultColor: '#000',
      align: 'middle',
    };
    const _text = _handleElement.text || defaultText;
    updateElement({ text: { ..._text, align } });
  };

  return (
    <div className="shape-style-panel">
      <div className="title">
        <span>点击替换形状</span>
        <Down />
      </div>
      <div className="shape-pool-config">
        {SHAPE_LIST.map((item) => (
          <div className="category" key={item.type}>
            <div className="shape-list">
              {item.children.map((shape, index) => (
                <ShapeItemThumbnail
                  className="shape-item"
                  key={index}
                  shape={shape}
                  onClick={() => changeShape(shape)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <Select
          style={{ flex: 1 }}
          value={fillType}
          onChange={(value) => updateFillType(value as 'fill' | 'gradient')}
          options={[
            { label: '纯色填充', value: 'fill' },
            { label: '渐变填充', value: 'gradient' },
          ]}
        />
        <div style={{ width: 10 }}></div>
        {fillType === 'fill' ? (
          <ColorPicker
            value={fill}
            onChange={(value) => updateFill(value.toRgbString())}
          >
            <div
              className="colorPick-btn"
              style={{
                backgroundColor: fill,
                width: '50%',
              }}
            >
              <BgColorsOutlined className="colorPick-btn-icon" />
            </div>
          </ColorPicker>
        ) : (
          <Select
            style={{ flex: 1 }}
            value={gradient.type}
            onChange={(value) =>
              updateGradient({ type: value as GradientType })
            }
            options={[
              { label: '线性渐变', value: 'linear' },
              { label: '径向渐变', value: 'radial' },
            ]}
          />
        )}
      </div>
      {fillType === 'gradient' && (
        <>
          <div className="row">
            <GradientBar
              value={gradient.colors}
              onChange={(value: any) => updateGradient({ colors: value })}
              onIndexUpdate={(index: number) => setCurrentGradientIndex(index)}
            />
          </div>
          <div className="row">
            <div style={{ width: '40%' }}>当前色块：</div>
            <Popover trigger="click" style={{ width: '60%' }}>
              <ColorPicker
                value={gradient.colors[currentGradientIndex].color}
                onChange={(value) => updateGradientColors(value.toRgbString())}
              />
            </Popover>
          </div>
          {gradient.type === 'linear' && (
            <div className="row">
              <div style={{ width: '40%' }}>渐变角度：</div>
              <Slider
                style={{ width: '60%' }}
                min={0}
                max={360}
                step={15}
                value={gradient.rotate}
                onChange={(value: number) => updateGradient({ rotate: value })}
              />
            </div>
          )}
        </>
      )}
      <ElementFlip />
      <Divider />
      {handleElement.text?.content && (
        <>
          <RichTextBase />
          <Divider />
          <RadioGroup
            className="row"
            buttonStyle="solid"
            value={textAlign}
            onChange={(value: 'top' | 'middle' | 'bottom') => {
              updateTextAlign(value);
            }}
          >
            <RadioButton value="top" style={{ flex: 1 }}>
              <ActionIcon icon={<AlignTextTopOne />} tooltip="顶对齐" />
            </RadioButton>
            <RadioButton value="middle" style={{ flex: 1 }}>
              <ActionIcon icon={<AlignTextMiddleOne />} tooltip="居中" />
            </RadioButton>
            <RadioButton value="bottom" style={{ flex: 1 }}>
              <ActionIcon icon={<AlignTextBottomOne />} tooltip="底对齐" />
            </RadioButton>
          </RadioGroup>
          <Divider />
        </>
      )}
      <ElementOutline />
      <Divider />
      <ElementShadow />
      <Divider />
      <ElementOpacity />
      <Divider />
      <div className="row">
        <CheckboxButton
          style={{ flex: 1 }}
          checked={!!shapeFormatPainter}
          onClick={() => toggleShapeFormatPainter()}
          onDoubleClick={() => toggleShapeFormatPainter(true)}
        >
          <ActionIcon
            icon={
              <>
                <FormatBrush />
                <span style={{ marginLeft: '6px' }}>形状格式刷</span>
              </>
            }
            tooltip="双击连续使用"
          />
        </CheckboxButton>
      </div>
    </div>
  );
};

export default ShapeStylePanel;
