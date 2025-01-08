export interface SchemaWorkOrderItem {
  id?: string;
  /** 字段名称 */
  fieldName?: string;
  /** 字段类型 */
  fieldType?: number;
  /** 字段具体类型 */
  fieldTypeD?: number;
  /** 字段来源，1-系统，2-用户 */
  fieldFrom?: number;
  createBy?: string;
  createTime?: string;
  updateTime?: string;
  updateBy?: string;
  fieldId?: string;
  fieldRequest?: number;
  fieldContent?: string;
  nullValuePrompt?: string;
  fieldValue?: string;
  preset?: string;
}
