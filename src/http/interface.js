/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
import { empty } from '@/utils'
import { useUserStore } from '@/stores/user'

export default {
  contentType: {
    form: 'application/x-www-form-urlencoded;charset=UTF-8',
    json: 'application/json;charset=UTF-8'
  },
  config: {
    baseUrl: '',
    data: {},
    header: {
      'X-Requested-With': 'XMLHttpRequest',
      sysCode: 'SAAS_SHOPWORK_MINAPP'
    },
    type: 'json' /*contentType类型索引*/,
    method: 'GET',
    dataType: 'json' /* 如设为json，会对返回的数据做一次 JSON.parse */,
    responseType: 'text',
    customError: false /*是否自定义错误提示处理*/,
    reuse: true /*是否可重复请求（短时：1秒内）*/,
    isDirect: false, // 是否不走网关，直接请求
    success() {},
    fail() {},
    complete() {}
  },
  interceptor: {
    request: null,
    response: null
  },
  request(options) {
    if (empty(options)) {
      return Promise.reject(new Error('参数异常'))
    }

    // 处理提交数据的格式
    this.config.header['content-type'] = this.contentType[options.type]

    // token
    const userStore = useUserStore()
    console.log('userStore.userInfo', userStore.token)
    if (userStore.token) {
      this.config.header.HCP = userStore.token
      this.config.header.Cookie = `HCP=${userStore.token}`
    } else {
      delete this.config.header.HCP
      delete this.config.header.Cookie
    }

    options.dataType = options.dataType || this.config.dataType
    options.url = options.baseUrl + options.url
    options.data = options.data
    options.method = options.method.toLocaleUpperCase()
    options.header = { ...this.config.header, ...options.header }

    return new Promise((resolve, reject) => {
      const { config } = this
      options.complete = (response) => {
        console.log('request->response', response)
        const { statusCode, data } = response
        ;(this.interceptor.response &&
          this.interceptor
            .response({ ...response, config, options })
            .then(resolve)
            .catch(reject)) ||
          (statusCode === 200 ? resolve(data) : reject(response))
      }

      this.interceptor
        .request(Object.assign({}, config, options))
        .then((options) => {
          uni.request(Object.assign({}, config, options))
        })
    })
  }
}
