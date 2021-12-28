import storage from '@/utils/jeepayStorageWrapper'
import { login, logout, refreshToken } from '@/api/login'

const user = {
    state: {
        token: '',
        userName: '', // 真实姓名
        userId: '', // 用户ID
        avatarImgPath: '', // 头像
        accessList: [], // 用户权限集合
        isAdmin: '', // 是否是超级管理员
        loginUsername: '', // 登录用户名
        state: '', // 用户状态
        sysType: '', // 所属系统
        telphone: '', // 手机号
        sex: '', // 性别
        roles: [], // 角色
        allMenuRouteTree: [], // 全部动态 router
        isSaveStorage: false
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        // 设置头像
        SET_AVATAR (state, avatarPath) {
            state.avatarImgPath = avatarPath
        },
        // 设置用户信息
        SET_USER_INFO: (state, userInfo) => {
            state.userId = userInfo.user.userId // 用户ID
            state.userName = userInfo.user.username // 真实姓名
            state.avatarImgPath = userInfo.user.avatar // 头像
            state.accessList = userInfo.permissions // 权限集合
            // state.isAdmin = userInfo.isAdmin // 是否是超级管理员
            // state.loginUsername = userInfo.user.username // 登录用户名
            state.state = userInfo.user.lockFlag // 用户状态
            // state.sysType = userInfo.sysType // 所属系统
            // state.telphone = userInfo.telphone // 手机号
            // state.sex = userInfo.sex // 性别
            state.state = userInfo.roles
            state.allMenuRouteTree = userInfo.menus // 全部路由集合
        }
    },

    actions: {
        // 登录
        Login ({ commit, state }, { loginParams, isSaveStorage }) {
            return new Promise((resolve, reject) => {
                login(loginParams).then(bizData => {
                    const tokenVal = 'Bearer ' + bizData['access_token']
                    storage.setToken(tokenVal, isSaveStorage)
                    storage.setRefreshToken(bizData['refresh_token'])
                    commit('SET_TOKEN', tokenVal)
                    state.isSaveStorage = isSaveStorage
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        Logout ({ commit, state }) {
            return new Promise((resolve) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    storage.cleanToken()
                    location.reload() // 退出时 重置缓存
                    resolve()
                }).catch(() => {
                    resolve()
                }).finally(() => {

                })
            })
        },

        // 刷新token
        RefreshToken ({ commit, state }) {
            return new Promise((resolve) => {
                refreshToken(storage.getRefreshToken()).then((bizData) => {
                    const tokenVal = 'Bearer ' + bizData['access_token']
                    storage.setToken(tokenVal, state.isSaveStorage)
                    storage.setRefreshToken(bizData['refresh_token'])
                    commit('SET_TOKEN', tokenVal)
                    resolve()
                }).catch(() => {
                    resolve()
                })
            })
        }
    }

}

export default user
