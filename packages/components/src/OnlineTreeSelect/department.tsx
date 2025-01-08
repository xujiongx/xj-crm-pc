import { ConfigContext } from '@aicc/context/es/ConfigProvider';
import { treeFindByKey, treeToList } from '@aicc/shared';
import { CaretDownOutlined } from '@ant-design/icons';
import { useControllableValue, useRequest } from 'ahooks';
import { TreeSelect } from 'antd';
import React, { useMemo, useState } from 'react';

const { SHOW_ALL } = TreeSelect;

type GroupType = {
  id?: string;
  departName?: string;
  children?: GroupType[];
};

interface TreeData {
  value: string;
  title: string;
  children?: Array<TreeData>;
}

interface DepartmetTreeSelectProps {}

/**
 * 默认只展示一级部门，二级部门等子部门默认收起；展开1级，就展开全部
 * */
const DepartmetTreeSelect = ({ ...rest }: DepartmetTreeSelectProps) => {
  const { request } = React.useContext(ConfigContext);

  const [value = [], onChange] = useControllableValue<any>(rest);

  /** 要展开的所有节点 */
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<string[]>([]);

  const { data = [] } = useRequest(
    () =>
      request?.('/sys/sysDepart/queryAllTreeList').then((res) => {
        if (res?.code !== 0) return [];
        const { children = res?.result } =
          res?.result?.find(({ id }) => id === 'All') || {};
        const transfer = (data: Array<GroupType>): TreeData[] =>
          data?.map(({ id = '', departName = '', children }) => {
            return {
              value: id,
              title: departName,
              children: children?.length ? transfer(children) : undefined,
            };
          });
        const lists = transfer(children || []);
        return lists;
      }),
    {
      cacheKey: 'online:tree:select:departmet',
    },
  );

  // 有子部门的一级部门
  const topNodeHasChild = useMemo(() => {
    const defaultKeys =
      data?.filter((c) => c.children?.length)?.map((c) => c.value) || [];
    return defaultKeys;
  }, [data]);

  // useEffect(() => {
  //   const keys = selectedKey?.map((c: any) => c.value) || [];
  //   onChange?.(keys);
  // }, [selectedKey]);

  const onClickArrow = (expanded: boolean, key: any, data: any) => {
    const childrenKeys =
      treeToList(data.children || [])?.map((c) => c.value) || [];

    if (!expanded) {
      /**
       * 展开有子节点的一级节点: 要展开所有层级的子节点;
       * 展开非一级节点: 只需要展开最近下级节点，不需要展开所有层级子节点
       * */
      const expandedKeys = topNodeHasChild?.includes(key)
        ? [key, ...treeExpandedKeys, ...childrenKeys]
        : [key, ...treeExpandedKeys];
      setTreeExpandedKeys(expandedKeys);
    } else {
      /** 收缩  收起所有层级子节点*/
      const treeKeys =
        treeExpandedKeys?.filter((k) => ![...childrenKeys, key].includes(k)) ||
        [];
      setTreeExpandedKeys(treeKeys);
    }
  };

  // 勾选节点
  const onSelect = (val: any, node: any) => {
    const childrenKeys =
      treeToList(node?.children || []).map((item) => item.value) || [];
    onChange(Array.from(new Set([...value, node.value, ...childrenKeys])));
  };

  // 节点勾选状态改变
  const onChangeNode = (val: any, label: any, extra: any) => {
    /** 取消勾选，就取消该部门及所有子部门 */
    if (!extra.checked) {
      const item = treeFindByKey(data, extra.triggerValue, { idKey: 'value' });
      if (item) {
        const childrenNodes = treeToList([item]);
        // 勾选的节点
        const selected = value?.filter(
          (s) => !childrenNodes?.find((c) => c.value === s),
        );
        onChange(selected);
      }
    }
  };

  return (
    <TreeSelect
      allowClear
      multiple
      placeholder="请选择"
      {...rest}
      treeCheckable={true}
      treeExpandedKeys={treeExpandedKeys}
      treeNodeFilterProp="title"
      treeCheckStrictly={true}
      showCheckedStrategy={SHOW_ALL}
      maxTagCount="responsive"
      treeData={data}
      value={value}
      onChange={onChangeNode}
      onSelect={onSelect}
      switcherIcon={({ expanded, value, data }: any) => (
        <CaretDownOutlined
          onClick={() => onClickArrow(expanded, value, data)}
        />
      )}
    />
  );
};

export default DepartmetTreeSelect;
