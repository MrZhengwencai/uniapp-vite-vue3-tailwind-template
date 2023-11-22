import { empty, msg as showToast } from '@/utils'

// 验证规则的函数
/**
 * 
 * fn 为const validatePhone = (value, cb) => {
  if(validPhone(value)) {
    cb()
  } else {
    cb('手机号码不符合')
  }
}
 */
export const validFn = (data, rules) => {
  try {
    Object.keys(rules).forEach((key) => {
      rules[key].forEach((item) => {
        const { require, fn, msg } = item
        if (require && empty(data[key])) {
          throw new Error(msg || `${key}不能为空`)
        } else if (fn) {
          fn(data[key], (res) => {
            if (res) {
              throw new Error(res)
            }
          })
        }
      })
    })
    return true
  } catch ({ message }) {
    showToast(message)
    return false
  }
}

/* 手机号码规则 */
export const regPhone = /^0?(1[2-9])[0-9]{9}$/
export function validPhone(value) {
  const reg = regPhone
  return reg.test(value)
}

/* 姓名正则，英文、数字或汉字 */
export function validName(value) {
  const reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
  return reg.test(value)
}

/* 邮箱正则 */
export function validEMail(value) {
  const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  return reg.test(value)
}

/* 座机规则 */
export function validLandline(value) {
  const reg = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
  return reg.test(value)
}

/* 身份证正则 */
export function validIdCard(value) {
  const _IDRe18 =
    /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ // 18位身份证
  const _IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/ // 15位身份证

  return _IDRe18.test(value) || _IDre15.test(value)
}

/* 纳税人识别号正则 */
export function validTaxpayer(value) {
  const reg = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/
  return reg.test(value)
}
