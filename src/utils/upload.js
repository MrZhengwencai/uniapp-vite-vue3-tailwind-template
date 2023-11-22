import ENV_CONFIG2 from '@/config/config'
import store from '@/store/index'

async function _uploadFile({ filePath, isZZB }) {
  return new Promise((resolve, reject) => {
    const {
      state: {
        userInfo: { token }
      }
    } = store

    ENV_CONFIG2().then((ENV_CONFIG) => {
      let BASE_URL = ``
      let apiPath = ``
      if (isZZB) {
        BASE_URL = `${ENV_CONFIG.ZZB_OSS_URL}`
        apiPath = `/openEvaluation/uploadSingleFile`
      } else {
        BASE_URL = `${ENV_CONFIG.OSS_URL}`
        apiPath = `/oss/uploadPic`
      }
      uni.uploadFile({
        url: `${BASE_URL}${apiPath}`,
        filePath: filePath,
        name: 'file',
        // #ifdef MP
        header: {
          'Content-Type': 'multipart/form-data',
          HCP: token,
          sysCode: 'zayjwxapp'
        },
        // #endif
        success(res) {
          console.log('uni.uploadFile res=>', res)

          if (res.statusCode === 200) {
            let resData = res.data
            if (isZZB) {
              resData = resData ? JSON.parse(resData) : {}
              resolve(resData)
            } else {
              resolve(resData)
            }
          } else {
            reject(res)
            uni.hideLoading()
            uni.showToast({
              title: '上传图片失败!',
              icon: 'none'
            })
          }
          if (isZZB) {
          } else {
            resolve(res.data)
          }
        },
        fail(err) {
          console.log(`上传图片接口err：`, err)
          uni.hideLoading()
          uni.showToast({
            title: '上传图片失败!',
            icon: 'none'
          })
        }
      })
    })
  })
}

async function uploadImagesFn({ files = [], isZZB = true }) {
  const arr = []
  for (const item of files) {
    arr.push(_uploadFile({ filePath: item, isZZB }))
  }
  try {
    if (isZZB) {
      console.log('图片集合Promise：', arr)
      const res = await Promise.all(arr)
      console.log('图片集合Promise res：', res)
      const imgList = []
      res.forEach((data) => {
        imgList.push(data.result.id)
      })
      return imgList
    } else {
      console.log('图片集合Promise：', arr)
      const res = await Promise.all(arr)
      console.log('图片集合Promise res：', res)
      const imgList = []
      res.forEach((data) => {
        imgList.push(data)
      })
      return imgList
    }
  } catch (err) {
    console.log('图片上传错误：', err)
    return []
  }
}

export { uploadImagesFn }
