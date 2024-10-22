// export const DEV_HOST = 'aicc.qnzsai.com';
export const DEV_HOST = 'aicc-test.qnzsai.com';
//
export const DEV_URI = `http${
  DEV_HOST.includes('192') ? '' : 's'
}://${DEV_HOST}/`;

export default {
  /** JAVA 管理台接口 */
  '/aicc-api': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  '/sx-api': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** GO 坐席相关接口 */
  '/agent-api': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** GO IM 服务接口 */
  '/im-api': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  '/smart-assist-api': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** GO 质检接口 */
  '/smartqc': {
    target: DEV_URI,
    changeOrigin: true,
  },
  /** GO 监控数据接口 */
  '/get-api': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** GO 实时质检推送服务 */
  '/assist/': {
    target: DEV_URI,
    changeOrigin: true,
  },
  /** GO 知识库接口 */
  '/assist-api': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** GO 考培服务接口 */
  '/talkbot-api': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** PHP 质检接口 */
  '/analysis-api': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** 标注模型接口 */
  '/model-test-api': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** 阿里ASR模型接口 */
  '/slp-api': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** 资源 */
  '/minio': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** 短信平台 */
  '/speech-api': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** 语音机器人交互测试 */
  '/speech-CSRBroker': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** 语音机器人全量测试 */
  '/sdm/monkey': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** ChatGPT 接口 */
  '/chatgpt': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** ChatGPT 接口 */
  '/reader': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  /** ChatGPT 接口 */
  '/region-api': {
    target: 'http://region-31.seetacloud.com:53095/',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/region-api': '' },
  },
  /** 音色合成 */
  '/nlp': {
    target: DEV_URI,
    changeOrigin: true,
    secure: false,
  },
  '/api-admin': {
    target: 'https://testshop.qnzsai.com/',
    changeOrigin: true,
    secure: false,
  },
};
