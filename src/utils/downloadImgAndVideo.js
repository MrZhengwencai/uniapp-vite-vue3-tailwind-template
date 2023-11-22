//引导用户开启权限
const isAuth = () => {
  uni.showModal({
    content:
      '由于您还没有允许保存图片或视频到您相册里,无法进行保存,请点击确定允许授权。',
    success: (res) => {
      if (res.confirm) {
        uni.openSetting({
          success: (result) => {
            console.log(result.authSetting)
          }
        })
      }
    }
  })
}

//保存网络图片到本地
const saveNetImageToLocal = (url, type) => {
  uni.showLoading({
    title: '正在保存图片...'
  })
  uni.downloadFile({
    url: url,
    success: (res) => {
      if (res.statusCode === 200) {
        const fnType =
          type === 'image' ? 'saveImageToPhotosAlbum' : 'saveVideoToPhotosAlbum'
        uni[fnType]({
          filePath: res.tempFilePath,
          success: () => {
            console.log('成功')
            setTimeout(() => {
              uni.showToast({ title: '保存成功!' })
            }, 1000)
          },
          fail: (err) => {
            console.log('失败', err.errMsg)
            uni.showToast({ title: '保存失败!' })
          },
          //无论成功失败都走的回调
          complete: () => {
            uni.hideLoading()
          }
        })
      } else {
        uni.showToast({ title: '网络错误！', type: 'none' })
      }
    }
  })
}

/**
 * @description: 点击保存
 * @return {*}
 */

export default function downloadImgAndVideo(url, type = 'image') {
  //向用户发起授权请求
  uni.authorize({
    scope: 'scope.writePhotosAlbum',
    success: () => {
      //授权成功保存图片到系统相册
      saveNetImageToLocal(url, type)
    },
    //授权失败
    fail: () => {
      uni.showToast({ title: '未授权保存图片或视频到相册！', type: 'none' })
      //获取用户的当前设置。获取相册权限
      uni.getSetting({
        success: (res) => {
          // uni.showToast(res)
          //如果没有相册权限
          if (!res.authSetting['scope.writePhotosAlbum']) {
            isAuth()
          }
        },
        complete: () => {
          // uni.hideLoading()
        }
      })
    }
  })
}
