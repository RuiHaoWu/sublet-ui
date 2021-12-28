/**
 * storage 存储包装类
 *
 * @author terrfly
 * @site https://www.jeepay.vip
 * @date 2021/5/8 07:18
 */
import storage from 'store'
import appConfig from '@/config/appConfig'

var SESSION_TOKEN = ''
var REFRESH_TOKEN = ''

const wrapper = {

    /* 获取当前Token **/
    getToken: () => {
        return SESSION_TOKEN || storage.get(appConfig.ACCESS_TOKEN_NAME)
    },

    getRefreshToken: () => {
        return REFRESH_TOKEN || storage.get(appConfig.REFRESH_TOKEN)
    },

    /* 清空Token **/
    cleanToken: () => {
        SESSION_TOKEN = ''
        storage.remove(appConfig.ACCESS_TOKEN_NAME)
    },

    /* 设置token信息 **/
    setToken (tokenVal, isSaveStorage
    ) {
        SESSION_TOKEN = tokenVal
        if (isSaveStorage) {
            storage.set(appConfig.ACCESS_TOKEN_NAME, tokenVal, 60 * 60 * 1000)
        }
    },

    /* 设则刷新token */
    setRefreshToken (refreshToken) {
        storage.set(appConfig.REFRESH_TOKEN, refreshToken, 24 * 60 * 60 * 1000)
    }
}
export default wrapper
