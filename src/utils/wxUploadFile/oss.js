import { Base64 } from './base64.js'
import { util } from './crypto.js'
import { HMAC } from './hmac.js'
import { SHA1 } from './sha1.js'
import GET_ENV from '@/config/globalData'

// 下面这3个信息必填
// const url = 'https://cloud-platform.oss-cn-shenzhen.aliyuncs.com/'
// const OSSAccessKeyId = 'STS.NUrXFqfySG8q8j4FykSxB9pJ2'
// const OssAccesskeySercet = 'H6o7TTxpCGa2e6f4ejdPMYNtmZ2q5Bt7N1dAa3BFtbmC'

const policyText = {
  expiration: '2034-01-01T12:00:00.000Z', // 设置Policy的有效期，格式为UTC时间。如果Policy失效，将无法上传文件。
  conditions: [
    ['content-length-range', 0, 1048576000] // 限制上传文件的大小，单位为字节，此处限制文件大小为1 GB。如果上传的文件大小超过此限制，文件将无法上传到OSS。如果未设置该限制，则默认文件大小最大为5 GB。
  ]
}

// 生成文件名随机字符串
function random_string(len) {
  const strLeng = len || 32
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < strLeng; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

// 获取文件后缀
function get_suffix(filename) {
  const pos = filename.lastIndexOf('.')
  let suffix = ''
  if (pos != -1) {
    suffix = filename.substring(pos)
  }
  return suffix
}

// dir格式：'img/'
export const ossUpload = (filePath, env, dir = '') => {
  const { accessKeyId, accessKeySecret, securityToken } = env
  const policy = Base64.encode(JSON.stringify(policyText))
  const bytes = HMAC(SHA1, policy, accessKeySecret, { asBytes: true })
  const signature = util.bytesToBase64(bytes)
  const key = dir + random_string(10) + get_suffix(filePath)
  const envData = GET_ENV()
  const url = `https://${envData.BACUET_NAME}.oss-cn-shenzhen.aliyuncs.com/`
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url,
      filePath,
      // fileType: 'image',
      name: 'file',
      formData: {
        filePath,
        key,
        policy,
        OSSAccessKeyId: accessKeyId,
        success_action_status: '200',
        signature,
        'x-oss-security-token': securityToken
      },
      header: { 'x-oss-object-acl': 'public-read' },
      success: (e) => {
        console.log('成功', e)
        resolve({ success: true, data: url + key })
      },
      fail: (e) => {
        console.log('失败', e)
        reject({ success: false, data: '上传失败' })
      }
    })
  })
}
