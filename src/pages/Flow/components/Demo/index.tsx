import { Node } from '@antv/x6';
import { Button, Dropdown, Input, Switch } from 'antd';
import styles from './index.less';

const Demo = ({ node }: { node: Node }) => {
  const data = node.getData() || {};

  return (
    <>
      <Dropdown
        menu={{
          items: [
            {
              key: 'copy',
              label: '复制',
            },
            {
              key: 'paste',
              label: '粘贴',
            },
            {
              key: 'delete',
              label: '删除',
              onClick: () => {
                node.remove();
              },
            },
          ],
        }}
        trigger={['contextMenu']}
      >
        <div className={styles['custom-react-node']}>
          <Input
            value={data.text}
            onChange={(e) => {
              node.setData({
                text: e.target.value,
              });
            }}
          />
          <Button
            onClick={() => {
              node.setData({
                open: !data.open,
              });
            }}
          >
            open
          </Button>
          <Switch value={data.open} />
        </div>
      </Dropdown>
    </>
  );
};

export default Demo;
