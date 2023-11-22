<template>
  <view class="wrapper-container">
    <customNav ref="customNavRef" :isShowBgImg="false" title="视频处理" />

    <view class="content-container">
      <template v-if="!isSuccess">
        <view class="mb-4">
          <nut-textarea
            v-model="videoUrl"
            placeholder="长按复制短视频或图集链接，点击解析按钮去水印"
          />
        </view>

        <view class="mt-1 flex justify-around">
          <view class="w-2/5">
            <nut-button
              block
              :loading="isLoading"
              type="success"
              @tap="pasteLink"
            >
              粘贴链接
            </nut-button>
          </view>

          <view class="w-2/5">
            <nut-button block :loading="isLoading" type="info" @tap="handleUrl">
              <template v-if="isLoading">解析中...</template>
              <template v-else>解析</template>
            </nut-button>
          </view>
        </view>
      </template>

      <template v-else>
        <nut-tabs v-model="modelValue">
          <nut-tab-pane title="视频">
            <video
              id="myVideo"
              class="face-image mb-4"
              :src="result.medias[0].resource_url"
              controls
            />

            <view class="mt-1">
              <nut-button
                size="large"
                custom-color="linear-gradient(to right, #ff6034, #ee0a24)"
                @tap="
                  downloadImgAndVideo(result.medias[0].resource_url, 'video')
                "
              >
                下载视频
              </nut-button>
            </view>
          </nut-tab-pane>

          <nut-tab-pane title="标题">
            <view class="mb-4">
              <nut-textarea
                v-model="result.text"
                placeholder="长按复制短视频或图集链接，点击解析按钮去水印"
              />
            </view>

            <view v-if="result.text" class="mt-1">
              <nut-button size="large" type="success" @tap="copyText">
                复制
              </nut-button>
            </view>
          </nut-tab-pane>

          <nut-tab-pane title="封面" style="padding: 0 !important">
            <image
              class="face-image mb-4"
              mode="widthFix"
              :src="result.medias[0].preview_url"
            />

            <view class="mt-1">
              <nut-button
                size="large"
                custom-color="#7232dd"
                @tap="downloadImgAndVideo(result.medias[0].preview_url)"
              >
                下载图片
              </nut-button>
            </view>
          </nut-tab-pane>
        </nut-tabs>
      </template>
    </view>

    <tabbar />
  </view>
</template>

<script setup>
import downloadImgAndVideo from '@/utils/downloadImgAndVideo.js'

const videoUrl = ref('')
const isSuccess = ref(false)
const isLoading = ref(false)

const result = ref({
  text: '',
  medias: [
    {
      media_type: '',
      resource_url: '',
      preview_url: ''
    }
  ]
})
const modelValue = ref(0)

const pasteLink = () => {
  uni.getClipboardData({
    success: function (res) {
      videoUrl.value = res.data
    }
  })
}

const copyText = () => {
  uni.setClipboardData({
    data: result.value.text,
    success: function () {
      console.log('success')
      uni.showToast({
        title: '复制成功'
      })
    }
  })
}

const handleUrl = () => {
  if (!videoUrl.value) {
    uni.showToast({
      title: '请输入视频链接',
      icon: 'none'
    })
    return
  }

  // const reg = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)

  if (!videoUrl.value.includes('http')) {
    uni.showToast({
      title: '链接格式不正确',
      icon: 'none'
    })
    return
  }
  isLoading.value = true
  httpRequest('HANDLE_VIDEO_URL', {
    url: videoUrl.value,
    userId: '04D8431CB0321F3EC94C0C04078F3D2E',
    secretKey: 'b1efed417a2393f790669d3981b14ba9'
  })
    .then(({ data }) => {
      isSuccess.value = true
      result.value = data
    })
    .catch((err) => {
      console.log(err)
      if (err.code === 400) {
        uni.showToast({
          title: '解析失败',
          icon: 'none'
        })
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<style lang="scss" scoped>
.mb-15 {
  margin-bottom: 15rpx;
}

.face-image {
  width: 670rpx;
  // height: 300rpx;
}
</style>
