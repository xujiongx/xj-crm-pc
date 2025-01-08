import { ConfigContext } from '@aicc/context/es/ConfigProvider';
import { QuestionOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FileModal from '../File/components/FileModal';
import './index.less';

const Guidance = () => {
  const location = useLocation();
  const clickTime = useRef(0);
  const [isClick, setIsClick] = useState(false);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { guidanceData } = React.useContext(ConfigContext);
  const offset = useRef({ x: 0, y: 0 });

  const currentGuidance = guidanceData?.[`${location.pathname}`];

  useEffect(() => {
    if (currentGuidance) {
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('mousemove', onMouseMove);
      return () => {
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [currentGuidance]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsClick(false);
    setTooltipOpen(false);
    clickTime.current = new Date().getTime();
    dragging.current = true;
    const { offsetLeft = 0, offsetTop = 0 } = dragRef.current || {};
    offset.current = {
      x: e.clientX - offsetLeft,
      y: e.clientY - offsetTop,
    };
  };

  const onMouseUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (new Date().getTime() - clickTime.current < 200) {
      setIsClick(true);
    } else {
      setTooltipOpen(true);
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = offset.current;
    const moveX = Math.min(
      Math.max(0, e.clientX - x),
      window.innerWidth - dragRef.current!.offsetWidth,
    );
    const moveY = Math.min(
      Math.max(0, e.clientY - y),
      window.innerHeight - dragRef.current!.offsetHeight,
    );
    dragRef.current!.style.left = moveX + 'px';
    dragRef.current!.style.top = moveY + 'px';
  };

  const tooltipChange = (val: boolean) => {
    if (val && dragging.current) {
      return;
    }
    setTooltipOpen(val);
  };

  return (
    <FileModal
      disabled={!isClick}
      file={{
        name: currentGuidance?.text || '',
        path: currentGuidance?.fileUrl || '',
      }}
    >
      <Tooltip
        open={tooltipOpen}
        onOpenChange={tooltipChange}
        placement="topRight"
        title={currentGuidance?.text}
      >
        <div
          className={clsx('aicc-guidance-action', {
            'aicc-guidance-hide': !currentGuidance,
          })}
          onMouseDown={onMouseDown}
          ref={dragRef}
        >
          <QuestionOutlined />
        </div>
      </Tooltip>
    </FileModal>
  );
};

export default Guidance;
