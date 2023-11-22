import { defineStore } from 'pinia'
import { msg } from '@/utils'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户信息 登录获取
    userInfo: uni.getStorageSync('userInfo')
      ? JSON.parse(uni.getStorageSync('userInfo'))
      : {},
    // wx.login的code请求接口获取的
    osCode: uni.getStorageSync('osCode') || '',
    // 是否同意《声明与政策》
    isAgree: uni.getStorageSync('isAgree') || '',
    // 当前的店铺
    currentShop: uni.getStorageSync('currentShop')
      ? JSON.parse(uni.getStorageSync('currentShop'))
      : {},
    wxInfo: uni.getStorageSync('wxInfo')
      ? JSON.parse(uni.getStorageSync('wxInfo'))
      : {}
  }),
  getters: {
    token: (state) => {
      return (state.userInfo && state.userInfo.token) || null
    },
    // 当前店铺的id
    storeId: (state) => {
      return (state.currentShop && state.currentShop.shopDetail.organId) || ''
    }
  },
  actions: {
    // 设置个人信息
    setUserInfo(v) {
      this.userInfo = v || {}
      uni.setStorageSync('userInfo', JSON.stringify(this.userInfo))
    },
    // 设置osCode
    setOsCode(v) {
      this.osCode = v || ''
      uni.setStorageSync('osCode', v || '')
    },
    // 设置isAgree
    setIsAgree() {
      this.isAgree = true
      uni.setStorageSync('isAgree', 'true')
    },
    // 设置当前店铺
    setCurrentShop(v) {
      this.currentShop = v || {}
      uni.setStorageSync('currentShop', JSON.stringify(this.currentShop))
    },
    // 设置微信信息
    setWxInfo(v) {
      this.wxInfo = v || {}
      uni.setStorageSync('wxInfo', JSON.stringify(this.wxInfo))
    },

    // 获取默认门店信息
    getShopInfo() {
      return new Promise((resolve, reject) => {
        httpRequest('GET_DEFAULT_SHOP', {})
          .then((res) => {
            console.log('res', res)
            resolve()
            if (!res.result) {
              uni.showToast({
                title: '未查询到您的门店，请配置后重试'
              })
            }
            this.setCurrentShop(res.result || { id: '', name: '' })
          })
          .catch(() => {
            reject()
          })
      })
    },
    // 手机验证码登录
    loginByCode(formData) {
      return new Promise((resolve, reject) => {
        uni.showLoading({ title: '正在登录', mask: true })
        httpRequest('LOGIN_BY_PHONE_CODE', formData)
          .then((res) => {
            const { result } = res
            this.setUserInfo(result)
            this.getShopById().then(() => {
              uni.hideLoading()
              resolve(res)
            })
          })
          .catch((e) => {
            uni.hideLoading()
            reject(e)
          })
      })
    },
    // 账密登录
    loginByUserName(formData) {
      return new Promise((resolve, reject) => {
        uni.showLoading({ title: '正在登录', mask: true })
        httpRequest('LOGIN_BY_USER_NAME', formData)
          .then(async (res) => {
            const { result } = res
            this.setUserInfo(result)

            await this.getUserINfoExtra()

            await this.getShopInfo()
            uni.hideLoading()
            resolve()
          })
          .catch((e) => {
            reject(e)
          })
          .finally((e) => {
            uni.hideLoading()
          })
      })
    },
    getUserINfoExtra() {
      return new Promise((resolve, reject) => {
        httpRequest('GET_USER_INFO')
          .then(async (res) => {
            if (res.success) {
              resolve(res.result)
              this.setUserInfo({
                ...this.userInfo,
                ...res.result
              })
            } else {
              reject()
            }
          })
          .catch(() => {
            reject()
          })
      })
    },
    // 获取osscode
    getOsCode() {
      const _this = this
      return new Promise((resolve, reject) => {
        wx.login({
          success(res) {
            if (res.code) {
              httpRequest('WX_LOGIN', { code: res.code })
                .then((res) => {
                  _this.setOsCode(res.result)
                  resolve()
                })
                .catch(() => {
                  reject()
                })
            } else {
              reject()
              msg('wx.login错误：' + res.errMsg)
            }
          }
        })
      })
    },
    // 微信登录
    loginByWX() {
      uni.showLoading({ title: '处理中', mask: true })
      return new Promise((resolve, reject) => {
        httpRequest('LOGIN_BY_WX', { ...this.wxInfo })
          .then(async (res) => {
            if (res.result) {
              this.setUserInfo(res.result)
              await this.getUserINfoExtra()
              await this.getShopInfo()
              resolve()
            } else {
              reject()
            }
          })
          .catch(() => {
            reject()
          })
          .finally(() => {
            uni.hideLoading()
          })
      })
    },
    // 退出登录
    logout() {
      this.setUserInfo(null)
      this.setOsCode('')
    },
    // 获取微信code
    getOpenAndUnionId() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin', //使用微信登录
          success: async ({ code }) => {
            const { result } = await httpRequest('GET_OPEN_AND_UNION_ID', {
              code
            })
            this.setWxInfo(result)
            resolve(result)
          }
        })
      })
    }
  }
})
