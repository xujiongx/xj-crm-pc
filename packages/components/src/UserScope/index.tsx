import { ConfigContext } from '@aicc/context/es/ConfigProvider';
import { treeToList } from '@aicc/shared';
import { CrmApiListResultType, CrmApiResultType } from '@aicc/types';
import { useRequest } from 'ahooks';
import {
  Button,
  Empty,
  Input,
  Modal,
  Pagination,
  Space,
  Tabs,
  Tag,
  Tooltip,
  Tree,
  TreeProps,
  Typography,
  message,
} from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { DataNode } from 'antd/es/tree';
import { uniq } from 'lodash';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useImmer } from 'use-immer';
import WWOpenData from '../WWOpenData';
import styles from './index.less';

export type GroupType = {
  id?: string;
  departName?: string;
  /** 企业微信组织ID */
  qwId?: string;
  children?: GroupType[];
  viewTag?: boolean;
  level?: number;
};

const { Text } = Typography;

interface UserScopeProps {
  id?: string;
  title?: string;
  disabled?: boolean;
  value?: {
    user: string[];
    department: string[];
    label: string[];
  };
  /** 是否显示标签 */
  showLabel?: boolean;
  size?: SizeType;
  onChange?: (value: {
    user: string[];
    department: string[];
    label: string[];
  }) => void;
  children?: React.ReactNode;
}

type StateTypes = Record<ActiveKeys, string[]>;

type ActiveKeys = 'user' | 'department' | 'label';

export const validateUserScope = (label?: string) => ({
  validator(_: any, value: any) {
    if (
      !value?.user?.length &&
      !value?.department?.length &&
      !value?.label?.length
    ) {
      return Promise.reject(`${label || '任务推送范围'}不能为空`);
    }
    return Promise.resolve();
  },
});

const UserScope = ({
  value,
  title = '范围选择',
  disabled,
  showLabel = false,
  size,
  onChange,
  children,
  id,
}: UserScopeProps) => {
  const { request } = useContext(ConfigContext);
  const [visible, setVisible] = useState(false);
  const [activeKey, setActiveKey] = useState<ActiveKeys>('department');
  const departmentMap = useRef<
    Map<string, { name: string; disabled: boolean; fullPath: string }>
  >(new Map());
  const departmentWorkWxMap = useRef<Map<string, boolean>>(new Map());
  const userMap = useRef<
    Map<string, { title: string; disabled: boolean; frozen: boolean }>
  >(new Map());
  const labelMap = useRef<Map<string, { name: string; disabled: boolean }>>(
    new Map(),
  );
  const [checkedData, setCheckedData] = useImmer<StateTypes>({
    user: [],
    department: [],
    label: [],
  });

  const SelectModalTabItems = [
    {
      key: 'department',
      label: '组织',
    },
    {
      key: 'user',
      label: '员工',
    },
    {
      key: 'label',
      label: '标签',
      hidden: !showLabel,
    },
  ];

  const pageSize = useRef(12);
  const [current, setCurrent] = useState(1);
  const [filterValue, setFilterValue] = useState('');

  /** 标签 */
  const { data: labelData, run: refreshLabel } = useRequest(
    () =>
      request<
        CrmApiResultType<
          CrmApiListResultType<{ id: string; name: string; viewTag: boolean }>
        >
      >?.('/SysLabel/SysLabel/list', {
        params: {
          name: filterValue || undefined,
          pageNo: 1,
          pageSize: 9999,
        },
      }).then((res) => {
        if (res?.code === 0) {
          const list =
            res?.result?.records?.map(({ id, name, viewTag }) => {
              labelMap.current.set(id!, { name, disabled: !viewTag });
              return {
                key: id!,
                title: name,
                disabled: !viewTag,
              };
            }) || [];

          return {
            total: res?.result?.total || 0,
            list,
          };
        }
      }),
    {
      cacheKey: 'user:scope:label',
      ready: !!visible || activeKey === 'label',
      refreshDeps: [activeKey, current],
    },
  );

  const { data: userData, run: refreshUser } = useRequest(
    () =>
      request<
        CrmApiResultType<
          CrmApiListResultType<{
            id: string;
            realname: string;
            username: string;
            departIdsDictText: string;
            status: 1 | 2;
          }>
        >
      >?.('/sys/user/list', {
        params: {
          realname: filterValue || undefined,
          type: 1,
          pageNo: current || 1,
          pageSize: pageSize.current,
        },
      }).then((res) => ({
        current: current || 1,
        total: res?.result?.total || 0,
        list:
          res?.result?.records?.map(
            ({ id, realname, username, departIdsDictText, status }) => ({
              key: id!,
              frozen: status === 2,
              disabled: status === 2,
              title: realname,
              account: username,
              deptName: departIdsDictText,
            }),
          ) || [],
      })),
    {
      cacheKey: 'user:scope:user',
      ready: !!visible && activeKey === 'user',
      refreshDeps: [activeKey, current],
    },
  );

  const { data: departmentData, run: refreshDept } = useRequest(
    () =>
      request<CrmApiResultType<Array<GroupType>>>?.(
        '/sys/sysDepart/queryDepartTreeList',
        {
          params: {
            departName: filterValue || undefined,
          },
        },
      ).then((res) => {
        if (res?.code === 0) {
          const noop = (child: GroupType[], parentName?: string): DataNode[] =>
            child.map((item) => {
              const name = item.qwId || item.departName!;
              /** 完整菜单路径 */
              const fullPath =
                item.id !== 'All'
                  ? parentName
                    ? `${parentName}/${name}`
                    : name
                  : '';

              departmentMap.current.set(item.id!, {
                name,
                disabled: !item.viewTag,
                fullPath,
              });
              departmentWorkWxMap.current.set(name, !!item.qwId);

              return {
                key: item.id!,
                title: name,
                workWx: !!item.qwId,
                children: item.children
                  ? noop(item.children, fullPath)
                  : undefined,
                disabled: !item.viewTag,
                fullPath,
              };
            });
          const result = !!filterValue
            ? noop(res?.result || [])
            : noop(res?.result?.[0].children || []);
          return result;
        }
      }),
    {
      cacheKey: 'user:scope:department',
      ready: !!visible && activeKey === 'department',
      refreshDeps: [activeKey],
    },
  );

  useEffect(() => {
    if (visible) {
      setCheckedData(value || { user: [], department: [], label: [] });
    }
    return () => {
      afterClose();
    };
  }, [visible]);

  const afterClose = () => {
    setCurrent(1);
    setFilterValue('');
    setCheckedData({ user: [], department: [], label: [] });
    setActiveKey('department');
    userMap.current.clear();
  };

  useRequest(
    () =>
      request<
        CrmApiResultType<Array<{ id: string; realname: string; status: 1 | 2 }>>
      >?.('/sys/user/userInfoById', {
        method: 'post',
        data: {
          id: value?.user?.join(',') || undefined,
        },
      }).then((res) =>
        res?.result?.forEach((c) => {
          userMap.current.set(c.id!, {
            title: c.realname,
            frozen: c.status === 2,
            disabled: c.status === 2,
          });
        }),
      ),
    {
      cacheKey: 'user:scope:user:info',
      ready: !!value?.user?.toString() && visible,
    },
  );

  /** 已选标签 */
  const selectedLabels = useMemo(
    () =>
      checkedData.label
        ?.filter((key) => !!labelMap.current.get(key))
        ?.map((key) => ({
          key,
          title: labelMap.current.get(key)?.name,
          disabled: labelMap.current.get(key)?.disabled,
        })) || [],
    [checkedData.label, labelMap.current.size, labelData?.list],
  );

  /** 已选员工 */
  const selectedUsers = useMemo(
    () =>
      checkedData.user
        ?.filter((key) => !!userMap.current.get(key))
        ?.map((key) => ({
          key,
          title: userMap.current.get(key)?.title,
          frozen: userMap.current.get(key)?.frozen,
          disabled: userMap.current.get(key)?.disabled,
        })) || [],
    [checkedData.user, userMap.current.size, userData?.list],
  );

  /** 已选组织 */
  const selectedDepartments = useMemo(
    () =>
      checkedData.department
        ?.filter((key) => !!departmentMap.current.get(key))
        ?.map((key) => ({
          key,
          title: departmentMap.current.get(key)?.name,
          disabled: departmentMap.current.get(key)?.disabled,
          fullPath: departmentMap.current.get(key)?.fullPath,
        })) || [],
    [checkedData.department, departmentMap.current.size, departmentData],
  );

  const onSelectedKeys = (checked: boolean, node: any) => {
    let childrenKeys = treeToList(node.children || [])?.map((c) => c.key) || [];
    /** 用户的回显 */
    if (activeKey === 'user') {
      if (userMap.current?.size >= 1000) {
        message.warning('最多选择1000个员工');
        return;
      }

      if (checked)
        userMap.current.set(node.key!, {
          title: node.title,
          frozen: false,
          disabled: false,
        });
      else userMap.current.delete(node.key);
    } else if (activeKey === 'label') {
      if (checked)
        labelMap.current.set(node.key!, { name: node.title!, disabled: false });
      else labelMap.current.delete(node.key);
    } else {
      /** 过滤没有使用权限的部门 */
      childrenKeys = childrenKeys?.filter(
        (key) => !departmentMap.current.get(key)?.disabled,
      );
    }

    const selectedKeys = checkedData[activeKey] || [];

    setCheckedData({
      ...checkedData,
      [activeKey]: !checked
        ? selectedKeys.filter(
            (item) => ![node.key, ...childrenKeys].includes(item),
          )
        : uniq([...selectedKeys, ...childrenKeys, node.key]),
    });
  };

  const findKyes = (arr: any, key: string) => {
    return arr?.map((c: any) => {
      if (c.key === key) return c;
      else findKyes(c.children!, key);
    });
  };

  const treeProps: TreeProps = {
    height: 380,
    checkable: true,
    checkStrictly: true,
    defaultExpandAll: true,
    autoExpandParent: true,
    defaultExpandParent: true,
    defaultExpandedKeys:
      activeKey === 'department'
        ? checkedData.department
        : activeKey === 'user'
          ? checkedData.user
          : [],
    onCheck: (_, e: any) => {
      const { checked, node } = e;
      onSelectedKeys(checked, node);
    },
    onSelect: (_, e: any) => {
      const { node } = e;
      onSelectedKeys(!node.checked, node);
    },
  };

  const tagClose = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    key: string,
    type: ActiveKeys,
  ) => {
    e.preventDefault();
    setCheckedData({
      ...checkedData,
      [type]: checkedData[type].filter((item) => item !== key),
    });
  };

  const onOk = () => {
    /** 过滤掉被删除的情况（即名字为空） */
    const checked = {
      user: checkedData.user?.filter((key) => !!userMap.current.get(key)) || [],
      department:
        checkedData.department?.filter(
          (key) => !!departmentMap.current.get(key),
        ) || [],
      label:
        checkedData.label?.filter((key) => !!labelMap.current.get(key)) || [],
    };

    if (checked?.user?.length > 1000) {
      message.warning('最多选择1000个员工');
      return;
    }

    onChange?.(checked);
    setVisible(false);
  };

  const clearSelect = () => {
    if (activeKey === 'department') {
      setCheckedData((data) => ({ ...data, department: [] }));
    } else if (activeKey === 'user') {
      setCheckedData((data) => ({ ...data, user: [] }));
    } else {
      setCheckedData((data) => ({ ...data, label: [] }));
    }
  };

  const onSearch = (val?: string) => {
    setCurrent(1);
    setFilterValue(val ? val : '');
    activeKey === 'department'
      ? refreshDept()
      : activeKey === 'user'
        ? refreshUser()
        : refreshLabel();
  };

  const emptyResult = () => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  const renderDept = () =>
    departmentData?.length == 0 ? (
      emptyResult()
    ) : (
      <Tree
        {...treeProps}
        key="departmentName"
        titleRender={(node: any) => (
          <WWOpenData
            key={node.key}
            workWx={node.workWx}
            type="departmentName"
            openid={node.title as string}
          />
        )}
        disabled={disabled}
        treeData={departmentData || []}
        checkedKeys={checkedData.department}
      />
    );

  const renderUser = () =>
    userData?.list?.length == 0 ? (
      emptyResult()
    ) : (
      <div className={styles['user-box']}>
        <Tree
          key="user"
          {...treeProps}
          height={350}
          titleRender={(node: any) => (
            <Tooltip
              title={
                <div>
                  账号: {node.account}
                  <br />
                  部门: {node.deptName || '无'}
                </div>
              }
            >
              <div style={{ width: 40 }} />
              <WWOpenData key={node.key} openid={node.title as string} />
              {node.frozen ? '(冻结)' : ''}
            </Tooltip>
          )}
          disabled={disabled}
          treeData={userData?.list || []}
          checkedKeys={checkedData.user}
        />
        <div className={styles['user-box__page']}>
          <Pagination
            size="small"
            current={current}
            defaultPageSize={pageSize.current}
            showSizeChanger={false}
            total={userData?.total}
            showLessItems={true}
            hideOnSinglePage={false}
            onChange={(cur) => setCurrent(cur || 1)}
          />
        </div>
      </div>
    );

  const renderLabel = () =>
    labelData?.list?.length == 0 ? (
      emptyResult()
    ) : (
      <div className={styles['user-box']}>
        <Tree
          key="label"
          {...treeProps}
          height={350}
          titleRender={(node) => (
            <WWOpenData key={node.key} openid={node.title as string} />
          )}
          disabled={disabled}
          treeData={labelData?.list || []}
          checkedKeys={checkedData.label}
        />
      </div>
    );

  const allSelect = () => {
    const ids: Array<string> = [];
    const noop = (data: DataNode[]) => {
      data.forEach((item) => {
        !item.disabled && ids.push(String(item.key));
        if (item.children) {
          noop(item.children);
        }
      });
    };
    noop(departmentData || []);
    setCheckedData({ ...checkedData, department: ids });
  };

  return (
    <>
      <Modal
        title={title}
        open={visible}
        styles={{ body: { padding: 0 } }}
        okButtonProps={{ disabled }}
        width={800}
        onCancel={() => setVisible(false)}
        onOk={onOk}
        afterClose={afterClose}
        destroyOnClose={true}
      >
        <div className={styles.row}>
          <div className={styles.group}>
            <div className={styles.search}>
              <Input.Search
                value={filterValue}
                placeholder="输入关键字搜索"
                allowClear
                onSearch={onSearch}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </div>
            <Tabs
              className={styles.tabs}
              activeKey={activeKey}
              onChange={(key) => {
                setFilterValue('');
                setActiveKey(key as ActiveKeys);
              }}
              tabBarExtraContent={
                disabled ? null : (
                  <Space style={{ marginRight: 20 }}>
                    {activeKey === 'department' && (
                      <a onClick={allSelect}>全选</a>
                    )}
                    <a onClick={clearSelect}>清空</a>
                  </Space>
                )
              }
              items={SelectModalTabItems?.filter((o) => !o.hidden)?.map(
                (opt) => ({
                  ...opt,
                  children:
                    opt.key === 'department'
                      ? renderDept()
                      : opt.key === 'user'
                        ? renderUser()
                        : renderLabel(),
                }),
              )}
            />
          </div>
          <div className={styles.selected}>
            <Text type="secondary">已选人群（多个条件叠加取并集）</Text>
            {!!selectedDepartments.length && (
              <div className={styles.selectedGroup}>
                已选组织：
                {selectedDepartments.map((item) => (
                  <Tooltip title={item.fullPath} key={item.key}>
                    <Tag
                      closable={!(disabled || item.disabled)}
                      onClose={(e) => tagClose(e, item.key, 'department')}
                    >
                      <WWOpenData
                        workWx={departmentWorkWxMap.current.get(item.title!)}
                        type="departmentName"
                        openid={item.title}
                      />
                    </Tag>
                  </Tooltip>
                ))}
              </div>
            )}

            {!!selectedUsers.length && (
              <div className={styles.selectedGroup}>
                已选员工：
                {selectedUsers?.map((item) => (
                  <Tag
                    closable={!(disabled || item.disabled)}
                    key={item.key}
                    onClose={(e) => tagClose(e, item.key, 'user')}
                  >
                    <WWOpenData openid={item.title!} />
                    {item.frozen ? '(冻结)' : ''}
                  </Tag>
                ))}
              </div>
            )}

            {!!selectedLabels.length && (
              <div className={styles.selectedGroup}>
                已选标签：
                {selectedLabels?.map((item) => (
                  <Tag
                    closable={!(disabled || item.disabled)}
                    key={item.key}
                    onClose={(e) => tagClose(e, item.key, 'label')}
                  >
                    {item.title}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {children ? (
        <span onClick={() => setVisible(true)}>{children}</span>
      ) : (
        <Button
          id={id}
          type="primary"
          size={size}
          ghost
          onClick={() => setVisible(true)}
        >
          {disabled ? '查看' : '设置/查看'}
        </Button>
      )}
    </>
  );
};

export default UserScope;
