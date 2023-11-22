export function typeOf(target) {
  const r = /\[object (\w+)]/g.exec(Object.prototype.toString.apply(target))
  return r && r[1].toLowerCase()
}

export function empty(target) {
  switch (typeOf(target)) {
    case 'object':
    case 'string':
    case 'array':
      return !Object.keys(target).length
    default:
      return target == null
  }
}

// showToast
export function msg(title, icon = 'none', duration = 1500, mask = false) {
  // 统一提示方便全局修改
  if (Boolean(title) === false) {
    return
  }
  uni.showToast({
    title,
    duration,
    mask,
    icon
  })
}

// 页面跳转
export function navTo(url, isReplace = false) {
  url = url || '/pages/home/index'
  let gotoUrl = '/' + url
  // 防止双斜杠
  gotoUrl = gotoUrl.replace(/^\/\//, '/')

  const switchUrl = [
    '/pages/home/index',
    '/pages/image/index',
    '/pages/video/index',
    '/pages/me/index'
  ]
  if (switchUrl.includes(gotoUrl)) {
    uni.switchTab({ url: gotoUrl })
  } else {
    if (isReplace) {
      uni.redirectTo({ url: gotoUrl })
    } else {
      uni.navigateTo({ url: gotoUrl })
    }
  }
}

/**
 *@param {fn : function : 需要防抖的函数}
 *@param {delay : Number : 延时}
 *@param {eachInit : Boolean : 是否重置首次执行}
 *@description 防抖函数
 *@return {fn}
 */
export function debounce(fn, delay = 2000, eachInit = false) {
  let timer,
    count = 0
  return function () {
    let th = this,
      args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    if (eachInit && !count) {
      fn.apply(th, args)
      count++
    } else {
      timer = setTimeout(function () {
        timer = null
        fn.apply(th, args)
        if (eachInit) count = 0
      }, delay)
    }
  }
}
/**
 *@param {fn : function : 需要节流的函数}
 *@param {delay : Number : 延时}
 *@description 节流函数
 *@return {fn}
 */
export function throttle(fn, delay = 2000) {
  let canRun = true // 标记
  return function () {
    if (!canRun) return
    canRun = false
    fn.apply(this, arguments)
    setTimeout(() => {
      // fn.apply(this, arguments);
      canRun = true
    }, delay)
  }
}

/**
 * 获取当前页的路由里的参数
 * tip：该方法一定要在页面加载后，可在onMounted，onShow，nextTick
 */
export const getPageOptions = () => {
  const pages = getCurrentPages()
  if (pages.length === 0) return {}
  const options = pages[pages.length - 1].options
  // console.log(2222, pages[0]);
  return options
}

/**
 * 根据页码，页条数，总条数计算总页数
 */
export const getTotalPages = (recordCount, pageSize = 10) => {
  let totalPages = Math.floor(recordCount / pageSize)
  if (recordCount % pageSize > 0) {
    totalPages += 1
  }
  return totalPages
}

/**
 * 判断两个数组相等
 */
export const ArrEqua = (arr1 = [], arr2 = []) => {
  const result =
    arr1.length === arr2.length &&
    arr1.every((a) => arr2.some((b) => a === b)) &&
    arr2.every((_b) => arr1.some((_a) => _a === _b))
  // 相等result = true,不等result = true
  return result
}

/**
 * 跳转登录页是带当前页面的信息
 */
export const toLogin = () => {
  let loginUrl = '/pages/login/index'
  let pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  let gotoUrl = currentPage.$page.fullPath
  gotoUrl = encodeURIComponent(gotoUrl)
  loginUrl = `${loginUrl}?gotoUrl=${gotoUrl}`
  uni.redirectTo({ url: loginUrl })
}

/**
 * 小程序里scene
 * @param sceneStr
 * @returns {{}}
 */
export function sceneToJson(sceneStr) {
  sceneStr = decodeURIComponent(sceneStr)
  let splitStr = sceneStr.split('&')
  let sceneJson = {}
  let hash
  splitStr.forEach((item) => {
    hash = item.split('=')
    sceneJson[hash[0]] = hash[1]
  })

  return sceneJson
}

// 金额求和（相加/相减） arr = [a, b ,c]/[a, -b, -c]
export const countSum = (arr) => {
  if (!arr.length) return 0
  arr = arr.map((v) => {
    if (v && !Number.isNaN(Number(v))) return Math.round(v * 100)
    return 0
  })
  const result = arr.reduce((prev, curr) => {
    return prev + curr
  }, 0)
  return result / 100
}
