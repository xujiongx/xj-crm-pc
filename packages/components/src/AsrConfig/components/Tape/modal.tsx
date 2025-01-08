import { Modal } from 'antd';
import { FC } from 'react';
import HighlightText from './highlight';
import type { StateTypes } from './index';

interface Props {
  open?: boolean;
  data: StateTypes['textComparison'];
  onClose: () => void;
}

const TextCompareModal: FC<Props> = ({ open, data, onClose }) => {
  return (
    <Modal
      title="话术内容"
      open={open}
      styles={{ body: { maxHeight: '80vh', overflow: 'auto' } }}
      footer={null}
      onCancel={onClose}
    >
      <HighlightText
        text={data?.text!}
        index={data?.index || []}
        ellipsis={{
          symbol: ['更多', '收起'],
          expandable: true,
          showMore: true,
        }}
      />
    </Modal>
  );
};

export default TextCompareModal;
