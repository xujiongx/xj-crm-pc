import { EditOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import clsx from 'clsx';
// import { ProSwitch } from 'qnzs-ui';
// import { history } from 'umi';
// import DesignerMoblieModal from '../../../List/components/Modal';
// import { apiStatus } from '../../../List/services';
// import useMainStore from '../../store';
import styles from './index.less';

interface HeaderProps {
  className: string;
  onSuccess?: () => void;
}

const Header = ({
  className,
}: // onSuccess
HeaderProps) => {
  // const preview = useMainStore((store) => store.preview);
  // const item = useMainStore((store) => store.viewConfig.pageConfig);

  // const statusConfirm = (id: string, status: 1 | 0, msg: string) => {
  //   Modal.confirm({
  //     title: '启用确认',
  //     content: msg,
  //     cancelText: '保留当前首页',
  //     okText: '启用新首页',
  //     onOk: async () => {
  //       // const res = await apiStatus({ id, status, force: 1 });
  //       // if (res?.code === 0) {
  //       //   message.success(res.msg);
  //       //   // status &&
  //       //   //   history.replace(`/setting/designer/mobile/viewer/${item?.id}`);
  //       // } else {
  //       //   message.error(res?.msg);
  //       // }
  //     },
  //   });
  // };

  return (
    <div className={clsx(className, styles.header)}>
      <Space style={{ cursor: 'pointer' }} onClick={history.back}>
        <LeftOutlined />
        返回
      </Space>

      <Space>
        {/* {item?.title}
        {!preview && (
          <DesignerMoblieModal item={item} onSuccess={onSuccess}>
            <Button type="text" icon={<EditOutlined />} />
          </DesignerMoblieModal>
        )} */}
        <div>
          标题
          <Button type="text" icon={<EditOutlined />} />
        </div>
      </Space>

      <Space size={10}>
        <Button>保存</Button>
        <Button type="primary">发布</Button>
      </Space>
    </div>
  );
};

export default Header;
