<script setup lang="ts">
onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
  // 更新提示
  const updateManager = uni.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      updateManager.onUpdateReady(function () {
        uni.showModal({
          title: '更新提示',
          content: '发现新版本，是否重启应用?',
          cancelColor: '#999',
          confirmColor: '#007AFF',
          success(res2) {
            if (res2.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
    }
  })
  updateManager.onUpdateFailed(function () {
    // 新的版本下载失败
    uni.showModal({
      title: '提示',
      content: '新版本下载失败，请检查网络设置',
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
@import 'nutui-uniapp/styles/index';
@import '@/styles/index.scss';
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>
