import { GradientColor } from '@/pages/MotionVideo/types/slides';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import './index.less';

interface GradientBarProps {
  value: GradientColor[];
  onChange: (value: GradientColor[]) => void;
  onIndexUpdate: (index: number) => void;
}

const GradientBar: React.FC<GradientBarProps> = ({
  value,
  onChange,
  onIndexUpdate,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<GradientColor[]>(value);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    pointsRef.current = value;
    if (activeIndex > value.length - 1) {
      setActiveIndex(0);
    }
  }, [JSON.stringify(value), activeIndex]);

  useEffect(() => {
    onIndexUpdate(activeIndex);
  }, [activeIndex, onIndexUpdate]);

  const gradientStyle = () => {
    const list = pointsRef.current.map((item) => `${item.color} ${item.pos}%`);
    return `linear-gradient(to right, ${list.join(',')})`;
  };

  const removePoint = (index: number) => {
    if (pointsRef.current.length <= 2) return;

    if (index === activeIndex) {
      setActiveIndex(index - 1 < 0 ? 0 : index - 1);
    } else if (activeIndex === pointsRef.current.length - 1) {
      setActiveIndex(pointsRef.current.length - 2);
    }

    const values = pointsRef.current.filter((item, _index) => _index !== index);
    onChange(values);
  };

  const movePoint = (index: number) => {
    let isMouseDown = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      if (!barRef.current) return;

      let pos = Math.round(
        ((e.clientX - barRef.current.getBoundingClientRect().left) /
          barRef.current.clientWidth) *
          100,
      );
      if (pos > 100) pos = 100;
      if (pos < 0) pos = 0;

      pointsRef.current = pointsRef.current.map((item, _index) => {
        if (_index === index) return { ...item, pos };
        return item;
      });
      const point = pointsRef.current[index];
      const _points = [...pointsRef.current];
      _points.splice(index, 1);

      let targetIndex = 0;
      for (let i = 0; i < _points.length; i++) {
        if (point.pos > _points[i].pos) targetIndex = i + 1;
      }

      setActiveIndex(targetIndex);
      _points.splice(targetIndex, 0, point);

      onChange(_points);
    };

    const handleMouseUp = () => {
      isMouseDown = false;

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const addPoint = (e: MouseEvent) => {
    if (pointsRef.current.length >= 6) return;
    if (!barRef.current) return;
    const pos = Math.round(
      ((e.clientX - barRef.current.getBoundingClientRect().left) /
        barRef.current.clientWidth) *
        100,
    );

    let targetIndex = 0;
    for (let i = 0; i < pointsRef.current.length; i++) {
      if (pos > pointsRef.current[i].pos) targetIndex = i + 1;
    }
    const color = pointsRef.current[targetIndex - 1]
      ? pointsRef.current[targetIndex - 1].color
      : pointsRef.current[targetIndex].color;
    const values = [...pointsRef.current];
    values.splice(targetIndex, 0, { pos, color });
    setActiveIndex(targetIndex);
    onChange(values);
  };

  return (
    <div className="gradient-bar">
      <div
        className="bar"
        ref={barRef}
        style={{ backgroundImage: gradientStyle() }}
        onClick={(e) => addPoint(e)}
      ></div>
      {pointsRef.current.map((item, index) => (
        <div
          key={item.pos + '-' + index}
          className={clsx('point', { active: activeIndex === index })}
          style={{
            backgroundColor: item.color,
            left: `calc(${item.pos}% - 5px)`,
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            setActiveIndex(index);
            movePoint(index);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            removePoint(index);
          }}
        />
      ))}
    </div>
  );
};

export default GradientBar;
