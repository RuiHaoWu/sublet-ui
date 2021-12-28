/**
 * 全局配置信息， 包含网站标题，  动态组件定义
 *
 * @author terrfly
 * @site https://www.jeepay.vip
 * @date 2021/5/8 07:18
 */

/** 应用配置项 **/
export default {
  APP_TITLE: '“房转”系统管理中台', // 设置浏览器title
  ACCESS_TOKEN_NAME: 'Authorization', // 设置请求token的名字， 用于请求header 和 localstorage中存在名称
  REFRESH_TOKEN: 'RefreshToken'
}

/**
 * 与后端开发人员的路由名称及配置项
 * 组件名称 ：{ 默认跳转路径（如果后端配置则已动态配置为准）， 组件渲染 }
 * */
export const asyncRouteDefine = {

  // 'CurrentUserInfo': { defaultPath: '/current/userinfo', component: () => import('@/views/current/UserinfoPage') }, // 用户设置

  'MainPage': { defaultPath: '/main', component: () => import('@/views/dashboard/Analysis') },
  'SysUserPage': { defaultPath: '/users', component: () => import('@/views/sysuser/SysUserPage') },
  'RolePage': { defaultPath: '/roles', component: () => import('@/views/role/RolePage') },
  'PermissionPage': { defaultPath: '/ents', component: () => import('@/views/ent/EntPage') },
  'SysLogPage': { defaultPath: '/log', component: () => import('@/views/sys/log/SysLog') }, // 系统日志
  'SubletInfoPage': { defaultPath: '/sublet-info', component: () => import('@/views/subletInfo/SubletInfoPage') }, // 帖子信息管理
  // 'CommentPage': { defaultPath: '/comment', component: () => import('@/views/role/RolePage') }, // 评论管理
  'LabelPage': { defaultPath: '/label', component: () => import('@/views/label/LabelPage') } // 标签管理
}
