import React, { useEffect, useRef, useState, useMemo } from 'react';
import tippy, { type Instance, type Placement } from 'tippy.js'
import 'tippy.js/animations/scale.css';
import './index.less';

interface PopoverProps {
  value?: boolean;
  trigger?: 'click' | 'mouseenter' | 'manual';
  placement?: Placement;
  appendTo?: HTMLElement | 'parent';
  contentStyle?: React.CSSProperties;
  center?: boolean;
  onChange: (value: boolean) => void;
  content: React.ReactNode;
  children: React.ReactNode;
  style?: any
  className?: string
}

const Popover: React.FC<PopoverProps> = ({
  value = false,
  trigger = 'click',
  placement = 'bottom',
  appendTo = document.body,
  contentStyle,
  center = false,
  onChange,
  content,
  children,
  style = {},
  className
}) => {
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const instance = useRef<Instance | null>(null);
  const [contentVisible, setContentVisible] = useState(false);

  const computedContentStyle = useMemo(() => contentStyle || {}, [contentStyle]);

  useEffect(() => {
    if (instance.current) {
      if (value) {
        instance.current.show();
      } else {
        instance.current.hide();
      }
    }
  }, [value]);

  useEffect(() => {
    if (!triggerRef.current || !contentRef.current) return;

    instance.current = tippy(triggerRef.current, {
      content: contentRef.current,
      allowHTML: true,
      trigger,
      placement,
      interactive: true,
      appendTo: appendTo === 'parent' ? triggerRef.current.parentElement! : appendTo,
      maxWidth: 'none',
      offset: [0, 8],
      duration: 200,
      animation: 'scale',
      theme: 'light',
      onShow() {
        setContentVisible(true);
      },
      onShown() {
        if (!value && onChange) onChange(true);
      },
      onHidden() {
        if (value && onChange) onChange(false);
        setContentVisible(false);
      },
    });

    return () => {
      if (instance.current) {
        instance.current.destroy();
      }
    };
  }, []);

  return (
    <div className={`popover ${center ? 'center' : ''} ${className}`} style={style} ref={triggerRef as React.RefObject<HTMLDivElement>}>
      <div className="popover-content" style={computedContentStyle} ref={contentRef} onClick={() => { console.log(1222) }}>
        {contentVisible && content}
      </div>
      {children}
    </div>
  );
};

export default Popover;
