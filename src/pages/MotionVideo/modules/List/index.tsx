import VIDEO_LOADING_URL from '@/assets/mg/video-loading.gif';
import VIDEO_ICON_URL from '@/assets/mg/video.svg';
import { fetchVideoList } from '@/pages/MotionVideo/services';
import { convertSecondsToTime } from '@/utils';
import EMPTY_ROBOT_URL from '@aicc/assets/empty/robot.png';
import { IconFont, SchemaGridForm } from '@aicc/components';
import { SchemaGridFormType } from '@aicc/components/es/SchemaGridForm';
import { downloadUrlFile } from '@aicc/shared';
import { CloseCircleFilled } from '@ant-design/icons';
import { Empty, message, Space, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { ActionGroup, ProCard, ProPagination } from 'qnzs-ui';
import { useFormTable } from 'qnzs-ui/es/pro-table';
import { useState } from 'react';
import { history } from 'umi';
import {
  useOperateVideo,
  useSaveOrUpdateVideo,
} from '../../hooks/useVideoServices';
import EditInput from './components/EditNumber';
import PPTImportModal from './components/ImportPPTModal';
import styles from './index.less';
import VideoCreate from './modules/create';

const MotionVideo = () => {
  const [isShowPPTImportModal, setIsShowPPTImportModal] = useState(false);
  const [curVideoDetail, setCurVideoDetail] = useState();

  const [form] = useForm();
  const schemas: SchemaGridFormType[] = [
    {
      name: 'videoRecordName',
      label: '名称',
      type: 'text',
    },
  ];

  const [isLoaded, setIsLoaded] = useState(false);

  const {
    tableProps,
    refresh,
    search: { submit },
  } = useFormTable(
    ({ current, pageSize }, formData) =>
      fetchVideoList({
        pageNo: current,
        pageSize,
        ...formData,
      }).then((res) => {
        setIsLoaded(true);
        return {
          list: res?.result?.records || [],
          total: res?.result?.total || 0,
        };
      }),
    {
      form,
      refreshDeps: [],
      defaultParams: [
        {
          pageSize: 12,
          current: 1,
        },
        {},
      ],
    },
  );

  const {
    deleteVideoAsync,
    deleteVideoLoading,
    copyVideoAsync,
    copyVideoLoading,
    retryRecordingVideoAsync,
    retryRecordingVideoLoading,
    cancelRecordingVideoAsync,
    cancelRecordingVideoLoading,
  } = useOperateVideo();
  const { updateVideoAsync } = useSaveOrUpdateVideo();

  const handleEdit = (item: any) => {
    history.push(
      `/motion-video/editor?id=${item.id}&dimensionRatio=${item.dimensionRatio}&name=${item.name}`,
    );
  };
  const handleCopy = async (item: any) => {
    const res = await copyVideoAsync(item.id);
    if (!res?.code) message.success(res?.msg);
    refresh();
  };
  const handleExport = (item: any) => {
    downloadUrlFile(
      item.videoUrl,
      `${item.name}__${dayjs().format('YYYYMMDDHHmmss')}.mp4`,
    );
  };
  const handleDelete = async (item: any) => {
    const res = await deleteVideoAsync(item.id);
    if (res.code) return;
    message.success(res.msg);
    refresh();
  };
  const handleCancelRecoding = async (item: any) => {
    const res = await cancelRecordingVideoAsync({ id: item.id });
    if (res.code) return;
    message.success(res.msg);
    refresh();
  };
  const handleRetryRecoding = async (item: any) => {
    const res = await retryRecordingVideoAsync({ id: item.id });
    if (res.code) return;
    message.success(res.msg);
    refresh();
  };

  const handleNameChange = async (id: string, name: string) => {
    const res = await updateVideoAsync({
      id,
      name,
    });

    if (res?.code) return;
    message.success(res?.msg);
    refresh();
  };

  const EMPTY_VIDEO_BG_RENDER = (
    <div className={styles['empty-video']}>
      <img src={VIDEO_ICON_URL} />
    </div>
  );
  const PARSER_LOADING_RENDER = (
    <div className={styles['video-loading']}>
      <img src={VIDEO_LOADING_URL} className={styles['loading-icon']} />
      <div className={styles['loading-text']}>文档转换中...</div>
    </div>
  );
  const OUT_LOADING_RENDER = (
    <div className={styles['video-loading']}>
      <img src={VIDEO_LOADING_URL} className={styles['loading-icon']} />
      <div className={styles['loading-text']}>视频合成中...</div>
    </div>
  );

  const FooterRender = (item: any) => {
    //解析中
    if (item.parseStatus === 1) {
      return [];
    }
    //解析失败
    if (item.parseStatus === -1) {
      return [
        <div
          key="parseFail"
          style={{
            color: 'rgba(238, 100, 85, 1)',
            fontSize: '12px',
            lineHeight: '20px',
          }}
        >
          <CloseCircleFilled style={{ marginRight: '4px' }} />
          文档转换失败
        </div>,
        <ActionGroup
          size="small"
          gap={12}
          actions={[
            {
              key: 'delete',
              title: '删除',
              confirm: {
                title: `确定删除“${item?.name}”？`,
              },
              loading: deleteVideoLoading,
              onClick: () => {
                handleDelete(item);
              },
            },
            {
              key: 'retry',
              title: '重试',
              onClick: () => {
                // 打开弹窗
                setIsShowPPTImportModal(true);
                // 设置数据
                setCurVideoDetail(item);
              },
            },
          ]}
          key="parse"
        />,
      ];
    }
    //合成失败
    if (item.outStatus === 3) {
      return [
        <div
          key="parseFail"
          style={{
            color: 'rgba(238, 100, 85, 1)',
            fontSize: '12px',
            lineHeight: '20px',
          }}
        >
          <CloseCircleFilled style={{ marginRight: '4px' }} />
          视频合成失败
        </div>,
        <ActionGroup
          size="small"
          gap={12}
          actions={[
            {
              key: 'retry',
              title: '重试',
              loading: retryRecordingVideoLoading,
              onClick: () => {
                handleRetryRecoding(item);
              },
            },
            {
              key: 'edit',
              title: '取消',
              confirm: {
                title: `确定取消合成“${item?.name}”？`,
              },
              onClick: () => {
                handleCancelRecoding(item);
              },
              loading: cancelRecordingVideoLoading,
            },
          ]}
          key="out"
        />,
      ];
    }
    // 合成中
    if (item.outStatus === 1) {
      return [
        <ActionGroup
          gap={12}
          onlyIcon
          maxLength={5}
          actions={[
            {
              key: 'edit',
              title: '编辑',
              icon: <IconFont type="icon-edit" style={{ fontSize: '16px' }} />,
              onClick: () => {
                handleEdit(item);
              },
              disabled: item.outStatus === 1,
            },
            {
              key: 'copy',
              title: '复制',
              icon: <IconFont type="icon-copy1" style={{ fontSize: '16px' }} />,
              confirm: {
                title: `确定复制“${item?.name}”？`,
              },
              loading: copyVideoLoading,
              onClick: () => {
                handleCopy(item);
              },
              disabled: item.outStatus === 1,
            },
            {
              key: 'delete',
              title: '删除',
              icon: (
                <IconFont type="icon-shanchu3" style={{ fontSize: '16px' }} />
              ),
              confirm: {
                title: `确定删除“${item?.name}”？`,
              },
              loading: deleteVideoLoading,
              onClick: () => {
                handleDelete(item);
              },
              disabled: item.outStatus === 1,
            },
            {
              key: 'import',
              title: '导出',
              icon: (
                <IconFont type="icon-download" style={{ fontSize: '16px' }} />
              ),
              onClick: () => {
                handleExport(item);
              },
              disabled: item.outStatus === 1 || !item.videoUrl,
            },
          ]}
          key="action"
        />,
        <ActionGroup
          size="small"
          gap={12}
          actions={[
            {
              key: 'edit',
              title: '取消',
              onClick: () => {
                handleCancelRecoding(item);
              },
              confirm: {
                title: `确定取消合成“${item?.name}”？`,
              },
              loading: cancelRecordingVideoLoading,
              disabled: item.parseStatus === 1,
            },
          ]}
          key="out"
        />,
      ];
    }

    // 合成成功或者解析成功
    return [
      <ActionGroup
        gap={12}
        onlyIcon
        maxLength={5}
        actions={[
          {
            key: 'edit',
            title: '编辑',
            icon: <IconFont type="icon-edit" style={{ fontSize: '16px' }} />,
            onClick: () => {
              handleEdit(item);
            },
            disabled: item.outStatus === 1,
          },
          {
            key: 'copy',
            title: '复制',
            icon: <IconFont type="icon-copy1" style={{ fontSize: '16px' }} />,
            confirm: {
              title: `确定复制“${item?.name}”？`,
            },
            loading: copyVideoLoading,
            onClick: () => {
              handleCopy(item);
            },
            disabled: item.outStatus === 1,
          },
          {
            key: 'delete',
            title: '删除',
            icon: (
              <IconFont type="icon-shanchu3" style={{ fontSize: '16px' }} />
            ),
            confirm: {
              title: `确定删除“${item?.name}”？`,
            },
            loading: deleteVideoLoading,
            onClick: () => {
              handleDelete(item);
            },
            disabled: item.outStatus === 1,
          },
          {
            key: 'import',
            title: '导出',
            icon: (
              <IconFont type="icon-download" style={{ fontSize: '16px' }} />
            ),
            onClick: () => {
              handleExport(item);
            },
            disabled: item.outStatus === 1 || !item.videoUrl,
          },
        ]}
        key="action"
      />,
    ];
  };

  const CoverImgRender = (item: any) => {
    return (
      <div style={{ height: '186px', position: 'relative' }}>
        {item.coverUrl ? (
          <div
            style={{
              backgroundImage: `url("${item.coverUrl}")`,
            }}
            className={styles['img-container']}
          ></div>
        ) : (
          EMPTY_VIDEO_BG_RENDER
        )}
        {item.parseStatus === 1 && PARSER_LOADING_RENDER}
        {item.outStatus === 1 && OUT_LOADING_RENDER}
      </div>
    );
  };

  const getTagsRender = (item: any) => {
    if (item.outStatus === 2 && item.duration) {
      return [
        {
          text: `时长：${convertSecondsToTime(item.duration)}`,
          color: 'processing',
        },
      ];
    }
    return [];
  };

  return (
    <div className={styles.container}>
      <SchemaGridForm
        className={styles.header}
        form={form}
        onFinish={submit}
        schemas={schemas}
      />
      <Space
        direction="horizontal"
        align="start"
        className={styles['header-title']}
      >
        <div className="ant-pro-table-toolbar-title-wrapper">数字人视频</div>
        <VideoCreate refresh={refresh} />
      </Space>
      <Spin className={styles.content} spinning={tableProps.loading}>
        {tableProps?.dataSource?.length ? (
          <>
            <ProCard ghost wrap>
              {tableProps.dataSource.map((item) => (
                <ProCard
                  key={item.id}
                  colSpan
                  hoverable
                  cover={{
                    image: CoverImgRender(item),
                    direction: 'top',
                  }}
                  meta={{
                    title: (
                      <EditInput
                        maxLength={20}
                        showCount
                        value={item.name}
                        onBlur={async (e) => {
                          if (item.name === e.target.value) return;
                          handleNameChange(item.id, e.target.value);
                        }}
                      />
                    ),
                    tags: getTagsRender(item),
                    description: `更新时间：${item.updateTime}`,
                  }}
                  footer={FooterRender(item)}
                />
              ))}
            </ProCard>
            <div
              style={{
                position: 'sticky',
                bottom: '0',
                backgroundColor: '#F2F2F4',
              }}
            >
              <ProPagination
                defaultCurrent={1}
                defaultPageSize={12}
                current={tableProps?.pagination.current}
                total={tableProps?.pagination.total}
                pageSizeOptions={[12, 24, 48, 96]}
                onChange={(current, pageSize) => {
                  tableProps.onChange({ current, pageSize });
                }}
                showTotal={(total, range) =>
                  `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`
                }
                showSizeChanger
              />
            </div>
          </>
        ) : !isLoaded ? null : (
          <Empty
            image={EMPTY_ROBOT_URL}
            imageStyle={{ marginBottom: '0' }}
            description={
              <span style={{ color: 'rgba(112, 112, 112, 1)' }}>
                <p style={{ margin: '0', padding: '0', lineHeight: '22px' }}>
                  点击右上方按钮，
                </p>
                <p style={{ margin: '0', padding: '0', lineHeight: '22px' }}>
                  新增你的第一个视频吧～
                </p>
              </span>
            }
            style={{
              margin: '10% 0',
              color: 'rgba(112, 112, 112, 1)',
            }}
          />
        )}
      </Spin>
      <PPTImportModal
        visible={isShowPPTImportModal}
        setVisible={setIsShowPPTImportModal}
        refresh={refresh}
        data={curVideoDetail}
      />
    </div>
  );
};

export default MotionVideo;
