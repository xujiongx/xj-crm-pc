import { Checkbox, Collapse, Empty } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FC, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import './index.less';

export interface TreeItem {
  name: string;
  id: string;
  value: string;
  level: number;
  checked: boolean;
  disabled?: boolean;
  children?: Array<TreeItem>;
  status?:number
}

interface PermissionProps {
  value?: string;
  /** 单控件元素上绑定的id字段 */
  id?: string;
  data: Array<TreeItem>;
  onChange?: (val: string) => void;
}

const Permission: FC<PermissionProps> = ({ data, id, value, onChange }) => {
  const [checkboxData, setCheckboxData] = useImmer<Array<TreeItem>>([]);
  /** 当前选中的菜单 */
  const permissionIds = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (data?.length) {
      setCheckboxData([...data]);
    }
  }, [data]);

  useEffect(() => {
    const ids = value ? value?.split(',') : [];
    if (ids?.length) {
      ids?.forEach((key) => {
        permissionIds?.current?.set(key, true);
      });
    } else {
      permissionIds?.current?.clear();
    }
  }, [value]);

  useEffect(() => {
    const empty = !value && !permissionIds.current?.size;
    if (!onChange || empty) return;
    const res: string[] = [];
    for (const [key, value] of permissionIds.current) {
      if (value) {
        res.push(key);
      }
    }
    onChange?.(res?.join(','));
  }, [permissionIds?.current?.size]);

  /**
   * 设置选中状态
   * @param child
   * @param isChecked
   * @returns
   */
  const setChecked = (child: Array<TreeItem>, isChecked: boolean) =>
    child.map((item) => {
      if (item.children) {
        setChecked(item.children, isChecked);
      }
      item.checked = isChecked;
      if (isChecked) {
        permissionIds?.current?.set(item.value, isChecked);
      } else {
        permissionIds?.current?.delete(item.value);
      }
      return item;
    });

  /**
   * 勾选某个模块的菜单权限
   * @param event
   * @param item
   */
  const checkboxSelect = (event: CheckboxChangeEvent, item: TreeItem) => {
    const { checked } = event.target;
    item.checked = checked;
    if (item?.children?.length) {
      item.children = setChecked(item.children, checked);
    }
    setCheckboxData([...checkboxData]);
    if (checked) {
      permissionIds?.current?.set(item.value, checked);
    } else {
      permissionIds?.current?.delete(item.value);
    }
  };

  /**
   * 半选中状态
   * @param item
   * @returns { boolean }
   */
  const indeterminateCheck = (item: TreeItem) => {
    const someChecked = item.children!.filter((i) => i.checked);
    if (!someChecked?.length) return item.checked !== false;
    if (someChecked.length && !item.checked) {
      // 该节点所有子节点全部选中 && 该节点是未选中状态
      item.checked = true;
      setCheckboxData([...checkboxData]);
      permissionIds.current.set(item.value, true);
      return true;
    }
    return (
      someChecked?.length > 0 && someChecked?.length < item.children!.length
    );
  };

  const renderCheckbox = (item: TreeItem) => (
    <Checkbox
      checked={item.checked}
      disabled={item.disabled}
      indeterminate={
        (item?.children?.length || 0) > 0 && indeterminateCheck(item)
      }
      onChange={(e) => checkboxSelect(e, item)}
    >
      {item.name}
    </Checkbox>
  );

  const renderModulChild = (child: Array<TreeItem>, level: number) => {
    return child?.map((item) => (
      <div key={item.id} className={`child-level child-level-${level}`}>
        {renderCheckbox(item)}
        {item?.children?.length ? (
          <div className={`${['module-child']}`}>
            {renderModulChild(item.children, item.level + 1)}
          </div>
        ) : null}
      </div>
    ));
  };

  const renderModules = (child?: Array<TreeItem>) => {
    return child?.map((item) => (
      <div key={item.id} className={`child-level child-level-${item.level}`}>
        {renderCheckbox(item)}
        {item?.children?.length ? (
          <div className={`module-child-wrapper ${['module-child']}`}>
            {renderModulChild(item.children, item.level + 1)}
          </div>
        ) : null}
      </div>
    ));
  };

  if (!data?.length)
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无菜单" />
    );

  return (
    <div id={id}>
      <Collapse
        destroyInactivePanel
        className={'tree-container'}
        expandIconPosition="end"
        expandIcon={(panelProps) => (
          <div className={'expand'}>
            <span>{panelProps.isActive ? '收起' : '展开'}</span>
          </div>
        )}
        items={data?.map((item) => ({
          key: item.id,
          label: (
            <div className="title">
              <Checkbox
                checked={item.checked}
                disabled={item.disabled}
                indeterminate={
                  (item?.children?.length || 0) > 0 && indeterminateCheck(item)
                }
                onClick={(event) => event.stopPropagation()}
                onChange={(e) => checkboxSelect(e, item)}
              />
              <span style={{ marginLeft: 10, fontSize: 16 }}>{item.name}</span>
            </div>
          ),
          children: renderModules(item.children),
        }))}
      />
    </div>
  );
};

export default Permission;
