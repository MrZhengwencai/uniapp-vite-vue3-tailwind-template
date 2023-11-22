Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  }

  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}

export const formatDate = (time, f = 'yyyy/MM/dd') => {
  // time = time.replace(/\-/g, "/");
  return time ? new Date(time.replace(/\-/g, '/')).Format(f) : ''
}

/**
 * 将时间戳转为hh:mm:ss
 * t-时间戳
 */
export function formatTimeStamp(t, type) {
  t = parseInt(t)

  // 除数
  const _second = 1000
  const _minute = 1000 * 60
  const _hour = 1000 * 60 * 60

  // 计算结果
  let hour = parseInt(t / _hour) || 0 // 小时
  let minute = parseInt((t - hour * _hour) / _minute) || 0 // 分钟
  let second = parseInt((t - hour * _hour - minute * _minute) / _second) || 0 // 秒
  let result = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
    .toString()
    .padStart(2, '0')}`

  // 有天数
  if (type === 'day' && hour >= 24) {
    let day = parseInt(hour / 24) || 0
    hour = parseInt(hour % 24) || 0
    result = `${day}天 ${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}:${second.toString().padStart(2, '0')}`
  }

  return result
}

/**
 * 格式化价格、数量
 * v-原来的值
 * n-精度
 */
export function formatPriceNum(v, n) {
  v = Number(v)
  v = String(v)
  let vArr = v.split('.').filter((item) => !!item)

  let intNum = vArr[0] ? Number(vArr[0]) : 0 // 整数部分
  if (n <= 0) return intNum.toString()

  let small = vArr[1] || '' // 小数部分
  small = small.slice(0, n).padEnd(n, '0')
  small = '.' + small
  return intNum + small
}
