import { Button, Pagination, Popover, Space, Tabs } from 'antd';
// import { ACTIONS_TABS } from "./utils"
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import { useClickAway } from 'ahooks';
import { ActionType } from '@/SSMLEditor';

type DigitalPopoverProps = {
  value?: string;
  disabled?: boolean;
  isUpdate?: boolean;
  actionList: ActionType[];
  onChange: (value?: string) => void;
  children: React.ReactNode;
};

const pageSize = 8

const DigitalPopover: FC<DigitalPopoverProps> = ({
  value,
  disabled,
  isUpdate,
  actionList,
  onChange,
  children,
}) => {
  const [popover, setPopover] = useState(false);
  const popoverRef = useRef(null);
  const [current, serCurrent] = useState(1)
  const clickRef = useRef(null);

  const pageAction = useMemo(() => {
    return actionList.slice((current - 1) * pageSize, current * pageSize)
  }, [actionList, current])

  useEffect(() => {
    if(value){
      const currentValue = Math.ceil((actionList.findIndex(item => item.code === value) + 1) / pageSize)
      serCurrent(currentValue)
    }
  }, [value])

  useClickAway(() => {
    if(!clickRef.current){
      setPopover(false);
    } else {
      clickRef.current = null
    }
  }, popoverRef);

  const handleActionChange = (value: string) => {
    onChange(value);
    setPopover(false);
  };

  const handleRemoveAction = () => {
    onChange();
    setPopover(false);
  };

  const onChangePage = (page: number) => {
    serCurrent(page)
    clickRef.current = true
  }

  const renderActionList = (
    <div className="action-list-wrapper">
      <Space style={{ flexWrap: 'wrap' }}>
        {pageAction?.map((item) => (
          <div
            key={item.id}
            onClick={() => handleActionChange(item.code)}
            className={`action-item-wrapper${
              item.code === value ? ' selected' : ''
            }`}
          >
            {item.sampleUrl?.includes('mp4') ? <video
              className="action-video"
              src={item.sampleUrl}
              loop
              autoPlay
            /> : <img className="action-video" src={item.sampleUrl} />}
            <div className="action-text">{item.name}</div>
          </div>
        ))}
      </Space>
      <Pagination showSizeChanger={false} style={{marginTop: 8}} defaultCurrent={1} current={current} pageSize={pageSize} total={actionList?.length} onChange={onChangePage} />
      {isUpdate ? (
        <div className="remove-title" onClick={handleRemoveAction}>
          移除动作
        </div>
      ) : null}
    </div>
  );

  return (
    <span ref={popoverRef}>
      <Popover
        open={popover || false}
        placement="bottom"
        title="动作列表"
        content={renderActionList}
        trigger="click"
      >
        <span
          onClick={() => {
            if (!disabled) {
              setPopover(!popover);
            }
          }}
        >
          {children}
        </span>
      </Popover>
    </span>
  );
};

export default DigitalPopover;
