import {
  LeftCircleOutlined,
  PlusOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Collapse,
  Form,
  FormInstance,
  Input,
  InputRef,
  Row,
  message,
} from 'antd';
import clsx from 'clsx';
import { FC, ReactNode, memo, useEffect, useRef, useState } from 'react';
import { prefix } from '../../main';
import './index.less';

interface ConditionsProps {
  form: FormInstance;
  conditions?: string[];
  extra?: ReactNode;
  defaultActiveKey?: string | string[];
}

const Conditions: FC<ConditionsProps> = ({
  form,
  extra,
  conditions,
  defaultActiveKey,
}) => {
  const [inputVisible, setInputVisible] = useState(false);
  const inputRefs = useRef<InputRef>(null);
  const [fields, updateFields] = useState<string[]>([]);

  const containerRef = useRef<any>(null);

  const [searchData, setSearchData] = useState<{
    value?: string;
    current?: number;
    highlight?: string[];
  }>({});

  /**
   * 滚动条定位事件
   * @param index 下标
   */
  const scrollIndex = (name: string) => {
    if (!containerRef.current) return;
    const children = containerRef.current?.querySelector(
      `[data-highlight="${name}"]`,
    );
    if (!children) return;
    children.scrollIntoView({ block: 'center' });
  };

  /**
   * 下一条
   **/
  const onNext = () => {
    const { current = -1, highlight = [] } = searchData;
    if (current < 0) return;
    const isTail = current >= highlight?.length - 1 || 0;
    const index = isTail ? 0 : current + 1;
    setSearchData((draft) => ({
      ...draft,
      current: index,
    }));
    scrollIndex(highlight[index]);
  };

  /**
   * 上一条
   **/
  const onPrev = () => {
    const { current = -1, highlight = [] } = searchData;
    if (current < 0) return;
    const isHead = current <= 0;

    const index = isHead ? highlight?.length - 1 : current - 1;

    scrollIndex(highlight[isHead ? highlight?.length - 1 : current - 1]);

    setSearchData((draft) => ({
      ...draft,
      current: index,
    }));
  };

  const onSearch = (value: string) => {
    if (!value) {
      setSearchData({ current: undefined, highlight: [] });
      return;
    }
    const isExits = fields?.filter((text) => text.includes(value));
    if (isExits.length < 1) {
      message.warning('未找到符合的参数条件');
      return;
    }
    const { current } = searchData;
    setSearchData((draft) => ({
      value,
      highlight: isExits,
      current: draft?.current || 0,
    }));
    if (current === undefined) {
      setTimeout(() => {
        scrollIndex(isExits[0]);
      });
    } else {
      onNext();
    }
  };

  const suffix = searchData.highlight?.length ? (
    `${(searchData.current || 0) + 1}/${searchData.highlight.length}`
  ) : (
    <span />
  );

  const onPressEnter = () => {
    const { value } = inputRefs?.current?.input || {};
    setInputVisible(false);
    if (!value) return;
    const index = fields?.findIndex((field) => field === value);
    if (index !== -1) return message.error('参数名重复');
    updateFields([...fields, value]);
  };

  useEffect(() => {
    if (conditions) {
      updateFields([...conditions]);
    }
  }, [conditions]);

  useEffect(() => {
    const { value } = searchData;
    if (!value) return;
    const highlight = fields?.filter((text) => text.includes(value));
    setSearchData((draft) => ({
      ...draft,
      highlight,
    }));
  }, [fields?.length]);

  return (
    <Collapse
      className={`${prefix}-conditions`}
      defaultActiveKey={defaultActiveKey}
      items={[
        {
          label: '参数条件',
          key: 'params',
          children: (
            <Form form={form} labelCol={{ span: 24 }}>
              <div className={`${prefix}-conditions-search-wrapper`}>
                <Input.Search
                  style={{ width: 300 }}
                  placeholder="请输入参数条件"
                  onSearch={onSearch}
                  allowClear
                  onChange={({ target }) => {
                    if (target?.value) return;
                    setSearchData({
                      value: '',
                      current: undefined,
                      highlight: undefined,
                    });
                  }}
                  suffix={suffix}
                />
                {(searchData?.highlight?.length || 0) > 1 ? (
                  <>
                    <LeftCircleOutlined
                      onClick={onPrev}
                      className={`${prefix}-conditions-search-icon`}
                    />
                    <RightCircleOutlined
                      onClick={onNext}
                      className={`${prefix}-conditions-search-icon`}
                    />
                  </>
                ) : null}
              </div>
              <Row
                gutter={32}
                align="bottom"
                style={{ maxHeight: 270, overflowY: 'auto' }}
                ref={containerRef}
              >
                {fields?.length ? (
                  fields?.map((field, index) => {
                    const {
                      value: searchText,
                      current,
                      highlight,
                    } = searchData;

                    const active =
                      (current || 0) >= 0
                        ? highlight?.[current!] === field
                        : false;

                    const isExist = searchText
                      ? field.includes(searchText)
                      : undefined;

                    return (
                      <Col
                        key={field}
                        span={12}
                        className={`${prefix}-conditions-label-field`}
                        data-highlight={isExist ? field : undefined}
                      >
                        <Form.Item
                          label={
                            <span
                              className={clsx({
                                [`${prefix}-conditions-active`]: active,
                              })}
                              key={index}
                              dangerouslySetInnerHTML={{
                                __html: isExist
                                  ? field.replace(
                                      new RegExp(searchText || '', 'gi'),
                                      `<strong>${searchText}</strong>`,
                                    )
                                  : field,
                              }}
                            />
                          }
                          name={field}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    );
                  })
                ) : (
                  <Col span={24} className={`${prefix}-conditions-empty`}>
                    暂无参数条件
                  </Col>
                )}
                <Col span={12} style={{ marginBottom: 20 }}>
                  {inputVisible ? (
                    <Input
                      ref={inputRefs}
                      addonBefore="参数名称"
                      placeholder="请输入参数名称"
                      onPressEnter={onPressEnter}
                      onBlur={onPressEnter}
                    />
                  ) : (
                    <Button
                      type="dashed"
                      block
                      icon={<PlusOutlined />}
                      onClick={() => setInputVisible(true)}
                    >
                      新增条件
                    </Button>
                  )}
                </Col>
                {extra ? (
                  <Col span={12} style={{ marginBottom: 20 }}>
                    {extra}
                  </Col>
                ) : null}
              </Row>
            </Form>
          ),
        },
      ]}
    />
  );
};

export default memo(Conditions);
