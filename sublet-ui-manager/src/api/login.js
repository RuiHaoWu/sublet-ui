import request from '@/http/request'
import { Base64 } from 'js-base64'

// 登录认证接口
export function login ({ username, password, vercode, vercodeToken }) {
    const data = {
        ia: Base64.encode(username), // 账号
        ip: Base64.encode(password), // 密码
        vc: Base64.encode(vercode), // 验证码值
        vt: Base64.encode(vercodeToken) // 验证码token
    }
    return request.request({
        url: '/api/sublet-auth/auth',
        method: 'post',
        data: data,
        headers: { Authorization: 'Basic c3VibGV0LW1pZGRsZToxMjM0NTY=' }
    }, true, false, false)
}

// 获取图形验证码信息接口
export function vercode () {
    return request.request({ url: '/api/code', method: 'get' }, true, true, true)
}

// 获取当前用户信息
export function getInfo () {
    return request.request({
        url: '/api/sublet-user/user/info',
        method: 'get'
    })
}

// 退出接口
export function logout () {
    return request.request({ url: '/api/sublet-auth/auth/logout', method: 'post' }, true, true, true)
}

// 刷新登录接口
export function refreshToken (refreshToken) {
    const data = {
        refresh_token: refreshToken, // 刷新token
        grant_type: 'refresh_token' // 模式
    }
    return request.request({
        url: '/api/sublet-auth/auth',
        method: 'post',
        data: data,
        headers: { Authorization: 'Basic c3VibGV0LW1pZGRsZToxMjM0NTY=' }
    }, true, false, false)
}
