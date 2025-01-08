import { PlusCircleOutlined } from '@ant-design/icons';
import { Card, Pagination, Radio, Spin, Typography } from 'antd';
import { ProCard } from 'qnzs-ui';
import RobotItem from '../RobotItem';
import './index.less';
import { RobotItemType } from './interFance';

const { Text } = Typography;

export type RobotCardProps = {
  /**新增机器人弹窗组件 */
  renderItemPro?: React.ReactNode;
  /**页面排序事件 */
  onSortTypeChange?: (e: any) => void;
  /**搜索字段 */
  searchValues?: RobotItemType & {
    pageNo?: number;
    pageSize?: number;
    orderBy?: string;
  };
  /**加载进度条 */
  loading?: boolean;
  /**新增机器人事件 */
  onAdd?: () => void;
  /**列表数据 */
  data?: any;
  /**机器人分页事件 */
  onPaginationChange?: (pageNo: number, pageSize: number) => void;
  /**编辑机器人 */
  onEdit?: (item: RobotItemType) => void;
  refresh?: () => void;
  /**发布记录事件 */
  onPublishVi?: (id?: string) => void;
  /**配置事件 */
  onConfig?: (
    id?: string,
    robotName?: string,
    onlineStatus?: number,
    robotType?: number,
    modelId?: string,
  ) => void;
  /**发布事件 */
  onPublish?: (id: string) => void;
  /**查看事件 */
  onView?: (
    id?: string,
    robotName?: string,
    onlineStatus?: number,
    robotType?: number,
    modelId?: string,
  ) => void;
  /**是否开启机器人事件 */
  onSwitchChange?: (val: boolean, item: RobotItemType) => void;
  /**是否是外呼机器人 */
  isCallout?: boolean;
  /**知识同步事件 */
  onSynchronization?: (robotId: string) => void;
  /**删除机器人事件 */
  onRemove?: (id: string) => void;
};

const RobotCard = (props: RobotCardProps) => {
  const {
    renderItemPro,
    onSortTypeChange,
    searchValues,
    loading,
    onAdd,
    data,
    onPaginationChange,
    onEdit,
    refresh,
    onPublishVi,
    onConfig,
    onPublish,
    onView,
    onSwitchChange,
    isCallout,
    onSynchronization,
    onRemove,
  } = props;

  return (
    <ProCard className={'cardList'}>
      <div className={'sorter'}>
        <span>排序方式：</span>
        <Radio.Group
          options={[
            {
              label: '创建时间',
              value: 'create_time',
            },
            {
              label: '修改时间',
              value: 'update_time',
            },
          ]}
          defaultValue={searchValues?.orderBy}
          onChange={onSortTypeChange}
        ></Radio.Group>
      </div>

      <Spin spinning={loading} className={'spin'}>
        <div className={'mainBody'}>
          <Card hoverable onClick={onAdd} className={'card'}>
            <div className={'addButton'}>
              <div>
                <Text className={'addButtonIcon'}>
                  <PlusCircleOutlined style={{ fontSize: 50 }} />
                </Text>
              </div>
              <Text strong className={'addButtonText'}>
                新增机器人
              </Text>
            </div>
          </Card>
          {data?.dataSource?.map((item) => (
            <RobotItem
              key={item?.id}
              data={item || {}}
              onEdit={onEdit}
              refresh={refresh}
              onPublishVi={onPublishVi}
              onConfig={onConfig}
              onPublish={onPublish}
              onView={onView}
              onSwitchChange={onSwitchChange}
              isCallout={isCallout}
              onSynchronization={onSynchronization}
              onRemove={onRemove}
            />
          ))}
        </div>
      </Spin>

      <Pagination
        defaultCurrent={1}
        defaultPageSize={searchValues?.pageSize}
        current={searchValues?.pageNo}
        total={data?.total}
        pageSizeOptions={[8, 10, 20, 50, 100]}
        onChange={onPaginationChange}
        style={{ marginTop: 10, textAlign: 'right' }}
        showTotal={(total, range) =>
          `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`
        }
        showSizeChanger
      />
      {renderItemPro}
    </ProCard>
  );
};

export default RobotCard;
