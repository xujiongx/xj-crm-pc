export interface RobotItemType {
  id?: string;
  robotName?: string;
  isStatusOpen?: string;
  createTime?: string;
  updateTime?: string;
  isOpen?: number | string;
  createBy?: string;
  trainStatus?: string; //训练状态 null：未训练，展示文案：不需要展示文案   -1 排队中 0 训练中 1训练完成 2训练失败
  modelId?: string; //模型id
  onlineStatus?: number; //发布状态 0 未发布 1已发布 3 发布中
  proTime?: string;
  proBy?: string;
  updateBy?: string;
  pageNo?: number;
  pageSize?: number;
  orderBy?: string;
  robotType?: number;
  pushFlag?: number;
  knowledgeSynStatus?: string;
}
