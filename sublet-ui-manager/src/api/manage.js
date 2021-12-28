import request from '@/http/request'

/*
 *  全系列 restful api格式, 定义通用req对象
 *
 *  @author wrh
 *  @site https://www.sublet.com
 *  @date 2021/12/15
 */
export const req = {

  // 通用列表查询接口
  list: (url, params) => {
    return request.request({ url: url, method: 'GET', params: params }, true, true, false)
  },

  // 通用新增接口
  add: (url, data) => {
    return request.request({ url: url, method: 'POST', data: data }, true, true, false)
  },

  // 通用查询单条数据接口
  getById: (url, bizId) => {
    return request.request({ url: url + '/' + bizId, method: 'GET' }, true, true, false)
  },

  // 通用修改接口
  updateById: (url, bizId, data) => {
    return request.request({ url: url + '/' + bizId, method: 'PUT', data: data }, true, true, false)
  },

  // 通用删除接口
  delById: (url, bizId) => {
    return request.request({ url: url + '/' + bizId, method: 'DELETE' }, true, true, false)
  }
}

// 全系列 restful api格式 (全局loading方式)
export const reqLoad = {

  // 通用列表查询接口
  list: (url, params) => {
    return request.request({ url: url, method: 'GET', params: params }, true, true, true)
  },

  // 通用新增接口
  add: (url, data) => {
    return request.request({ url: url, method: 'POST', data: data }, true, true, true)
  },

  // 通用查询单条数据接口
  getById: (url, bizId) => {
    return request.request({ url: url + '/' + bizId, method: 'GET' }, true, true, true)
  },

  // 通用修改接口
  updateById: (url, bizId, data) => {
    return request.request({ url: url + '/' + bizId, method: 'PUT', data: data }, true, true, true)
  },

  // 通用删除接口
  delById: (url, bizId) => {
    return request.request({ url: url + '/' + bizId, method: 'DELETE' }, true, true, true)
  }
}

/** 用户管理页面 **/
export const API_URL_SYS_USER_LIST = '/api/sublet-user/user'
export const API_URL_USER_LOCK = '/api/sublet-user/user/lock'

/** 角色管理页面 **/
export const API_URL_ROLE_LIST = '/api/sublet-user/role'
export const API_URL_ROLE_AUTH_RELA_LIST = '/api/sublet-user/roleAuthRel'
export const API_URL_USER_ROLE_RELA_LIST = '/api/sublet-user/userRoleRel'

/** 权限管理页面 **/
export const API_URL_PERMISSION_LIST = '/api/sublet-user/authority'

/** 转租信息页面 **/
export const API_URL_SUBLET_INFO_LIST = '/api/sublet-post/sublet-info/middle/page'
export const API_URL_SUBLET_INFO_BASE = '/api/sublet-post/sublet-info'
export const API_URL_SUBLET_INFO_LOCK = '/api/sublet-post/sublet-info/lock'
export const API_URL_COMMENT_LIST = '/api/sublet-post/comment'
export const API_URL_COMMENT_MIDDLE = '/api/sublet-post/comment/middle'

/** 标签管理 **/
export const API_URL_LABEL_LIST = '/api/sublet-post/label/page'
export const API_URL_LABEL_BASE = '/api/sublet-post/label'

/** 日志管理 **/
export const API_URL_SYS_LOG = '/api/sublet-user/log'

/** 上传图片/文件地址 **/
export const upload = {
  avatar: '/api/sublet-user/file/upload'
}

const api = {
  user: '/user',
  role_list: '/role'
}

export default api

/** 获取权限树状结构图 **/
export function getEntTree () {
  return request.request({ url: '/api/sublet-user/authority/tree', method: 'GET' })
}

/** 用户分配角色信息 */
export function assignRole (userId, roleIdList) {
  return request.request({
    url: 'api/sublet-user/userRoleRel/role',
    method: 'POST',
    data: { userId: userId, roleIds: roleIdList }
  })
}

export function updateUserPass (parameter) {
  return request.request({
    url: '/api/sublet-user/user/modifyPwd',
    method: 'put',
    data: parameter
  })
}

export function updateUserInfo (parameter) {
  return request.request({
    url: '/api/sublet-user/user',
    method: 'put',
    data: parameter
  })
}
