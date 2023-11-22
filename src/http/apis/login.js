/**
 * 获取手机号验证码
 */
export const GET_LOGIN_SMS = {
  method: 'post',
  url: '/mobile/getVerificationCode',
  customError: true
}

/**
 * 根据wx.login得到的code去后台获取code
 */
export const WX_LOGIN = {
  method: 'post',
  url: '/mobile/wxLogin'
}
/**
 * 微信手机号登录
 */
export const LOGIN_BY_WXPHONE = {
  method: 'post',
  url: '/mobile/wxChatLoginByPhone',
  params: {
    encryptedData: '',
    iv: '',
    oscode: ''
  },
  customError: true
}

/**
 * 通过手机号和验证码登录
 */
export const LOGIN_BY_PHONE_CODE = {
  method: 'post',
  url: '/mobile/loginByPhoneAndCode',
  customError: true
}

/**
 * 通过手机号和验证码登录
 */
export const LOGIN_BY_USER_NAME = {
  method: 'post',
  url: '/h5user/login',
  customError: false
}

/**
 * 获取默认门店
 */
export const GET_DEFAULT_SHOP = {
  method: 'post',
  url: '/scrmdataauth/getDefaultShop',
  customError: true
}

/**
 * 退出登录
 */
export const LOGIN_OUT = {
  method: 'post',
  url: '/user/logout',
  options: {
    appName: 'rest/ums'
  },
  customError: true
}

/**
 * 退出登录
 */
export const GET_USER_INFO = {
  method: 'post',
  url: '/wxminiapp/getUserInfo',
  customError: true
}

/**
 * 获取openId和unionId
 */
export const GET_OPEN_AND_UNION_ID = {
  method: 'post',
  url: '/wxminiapp/jsCode2SessionInfo',
  customError: true
}

/**
 * 微信绑定
 */
export const BIND_WX_BY_OPEN_UNION_ID = {
  method: 'post',
  url: '/wxminiapp/bind',
  customError: false
}

/**
 * 微信解绑
 */
export const UN_BIND_WX = {
  method: 'post',
  url: '/wxminiapp/unBind',
  customError: false
}

/**
 * 微信登录
 */
export const LOGIN_BY_WX = {
  method: 'post',
  url: '/wxminiapp/login',
  customError: true
}
