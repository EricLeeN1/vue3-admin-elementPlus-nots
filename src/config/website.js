/**
 * 全局配置文件
 */
export default {
  title: 'Vite + Vue3 + Axios + Vue-router + Vuex',
  companyInfos: 'lyz',
  groupInfos: 'lyz',
  slogan: 'fightTogetherInYouth',
  logo: 'Eric',
  key: 'ericLee', // 配置主键,目前用于存储
  indexTitle: 'Eric Practice Platform',
  clientId: 'Sword', // 客户端id
  clientSecret: 'sword_secret', // 客户端密钥
  lockPage: '/lock',
  // http的status默认放行不才用统一处理的,
  statusWhiteList: ['/login'],
  // 上传地址
  uploadUrl: '/api/github/put-file'
}
