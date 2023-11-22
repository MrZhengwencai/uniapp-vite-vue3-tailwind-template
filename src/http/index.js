import http from './interface'
import apis from './apis/index.js'
import { throttle } from '@/utils'
import { useUserStore } from '@/stores/user'

let urlInfo = {}

export function httpRequest(name, params = {}, options = { appName: '' }) {
  let api = {}
  api = apis[name]
  if (!api) throw TypeError('请求接口名称出错')

  options.isDirect = options.isDirect || api.isDirect || http.config.isDirect
  let BASE_URL = import.meta.env.VITE_BASE_URL + '/' + options.appName
  if (options.isDirect) {
    BASE_URL = import.meta.env.VITE_DIRECT_BASE_URL
  }
  options.baseUrl = api.baseUrl || BASE_URL

  if (options.appName.includes('https')) {
    options.baseUrl = appName
  }

  const reqParams =
    typeof api.params === 'string' ? api.params : { ...api.params, ...params }
  options.name = name
  options.url = api.url
  options.data = reqParams
  options.header = { ...api.header, ...options.header }
  options.method = api.method || options.method || http.config.method
  options.type = options.type || api.type || http.config.type
  options.customError =
    options.customError || api.customError || http.config.customError
  options.reuse = options.reuse || api.reuse || http.config.reuse

  return http.request(options)
}

//节流抛错
let alertError = throttle(function (msg, statusCode) {
  uni.showModal({
    title: '提示',
    content: msg || '网络繁忙' + statusCode
  })
}, 2000)
//设置请求拦截器(用于防止重复请求)
http.interceptor.request = (options) => {
  let nowTime = new Date().getTime()
  if (urlInfo[options.url]) {
    //相同请求
    let reuse = !!options.reuse
    if (nowTime - urlInfo[options.url] < 1000 && !reuse) {
      return Promise.reject(new Error('重复请求' + options.url))
    }
  }
  //记录请求时间戳
  urlInfo[options.url] = nowTime
  return Promise.resolve(options)
}

//设置响应拦截器
http.interceptor.response = (c) => {
  if (c.errMsg.includes('fail')) {
    alertError('网络繁忙')
    return Promise.reject('网络繁忙')
  }

  console.log('http.interceptor.response ====>', c)
  const { header, statusCode, data, options } = c,
    { succ = false, errorMessage } = data

  switch (succ || statusCode) {
    case true:
      return Promise.resolve({ ...data, header })
    case 401:
      // 登陆失效，清除用户信息和token
      const userStroe = useUserStore()
      userStroe.logout()

      let loginUrl = '/pages/login/index'
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      let gotoUrl = currentPage.$page.fullPath
      gotoUrl = encodeURIComponent(gotoUrl)
      loginUrl = `${loginUrl}?gotoUrl=${gotoUrl}`
      setTimeout(function () {
        switch (currentPage.route) {
          default:
            uni.redirectTo({ url: loginUrl })
            break
        }
      }, 200)

      return Promise.reject(401)
    case 404:
      return Promise.reject(`地址[${options.url}]无法找到资源`)
    default:
      if (!options.customError) {
        alertError(errorMessage, statusCode)
      } else if (
        ['GET_LOGIN_SMS', 'LOGIN_BY_WXPHONE', 'LOGIN_BY_PHONE_CODE'].includes(
          options.name
        )
      ) {
        if (data.errorCode == 999) {
          alertError('您的手机号未绑定店铺\n请线下联系商家进行绑定')
        } else {
          alertError(errorMessage, statusCode)
        }
      }

      // data.errorMessage &&
      //   uni.showToast({
      //     title: data.errorMessage,
      //     icon: 'none'
      //   })
      return Promise.reject(data)
  }
}
