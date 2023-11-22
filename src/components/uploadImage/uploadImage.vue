<template>
  <view class="upload-container">
    <view v-for="item in imageList" :key="item" class="img-wrap">
      <image mode="aspectFit" :src="item" class="image" />
      <v-icon
        @tap.stop="handleDel(item)"
        class="clear-icon"
        type="clear"
        color="#666"
        size="44rpx"
      />
    </view>
    <view v-if="imageList.length < num" class="upload-icon" @tap="handleUpload">
      <v-icon type="plusempty" color="#E8EAEC" size="60rpx" />
    </view>
  </view>
</template>

<script setup>
import { toRefs, onMounted, ref } from 'vue'
import { msg } from '@/utils'
import request from '@/http'

import { ossUpload } from '@/utils/wxUploadFile/oss'

const emit = defineEmits(['update:imgList', 'change'])

const props = defineProps({
  imgList: {
    // 图片地址列表
    type: Array,
    default: () => []
  },
  num: {
    // 最多能上传多少张图片
    type: [Number, String],
    default: 8
  }
})

const { imgList } = toRefs(props)

const imageList = ref([])

const ossConfig = ref({})

onMounted(() => {
  console.log('imgList', imgList.value)
  request('getAliyunosssts', {}, { appName: 'mallSiteApi' }).then((res) => {
    console.log('res', res)
    if (res.result) {
      ossConfig.value = res.result
    }
  })
})

// 点击触发
const handleUpload = () => {
  console.log('上传')
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], //从相册选择还是使用相机 jpg、jpeg、png、 gif
    success(file) {
      imageInfoHandle(file)
    },
    fail(e) {
      console.log('上传图片失败', e)
      // msg('上传图片失败')
    }
  })
}
// 图片信息处理
const imageInfoHandle = (file) => {
  console.log('file', file)
  const { path, size } = file.tempFiles[0]
  if (!path) return

  // 判断后缀是否符合
  const suffixs = ['jpg', 'jpeg', 'png', 'gif']
  const reg = /\.(.*)$/g
  if (!suffixs.includes(reg.exec(path)[1])) {
    msg('仅支持jpg、jpeg、png、 gif文件')
    return
  }

  // 判断图片大小是否符合
  const tempSize = size / 1024 // 图片大小，单位K
  if (tempSize > 10 * 1024) {
    msg('文件不能大于10M')
    return
  }

  uploadFile(file)
}
// 上传文件
const uploadFile = async (file) => {
  console.log('file', file)
  uni.showLoading({
    title: '图片上传中'
  })

  const env = {
    accessKeyId: ossConfig.value.accessKeyId,
    accessKeySecret: ossConfig.value.accessKeySecret,
    bucketName: ossConfig.value.bucketName,
    regionId: ossConfig.value.regionId,
    securityToken: ossConfig.value.securityToken
  }

  const { success, data } = await ossUpload(file.tempFiles[0].path, env)
  uni.hideLoading()
  if (success) {
    uni.showToast({
      title: '上传成功',
      icon: 'none'
    })
    console.log('data', data)
    imageList.value.push(data)
    emit('change', imageList.value)
    emit('update:imgList', imageList.value)
  } else {
    uni.showToast({
      title: '上传失败',
      icon: 'none'
    })
  }
}

// 删除图片
const handleDel = (img) => {
  const imgs = imageList.value.filter((item) => item !== img) // 过滤删除的
  imageList.value = imgs
  emit('change', imageList.value)
  emit('update:imgList', imageList.value)
}
</script>

<style lang="scss" scoped>
.upload-container {
  display: flex;
  flex-wrap: wrap;
  .upload-icon {
    width: 120rpx;
    height: 120rpx;
    border: 2rpx solid #e8eaec;
    border-radius: 4rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20rpx;
  }
  .img-wrap {
    width: 120rpx;
    height: 120rpx;
    border: 2rpx solid #e8eaec;
    border-radius: 4rpx;
    position: relative;
    margin-right: 20rpx;
    margin-bottom: 20rpx;
    .image {
      width: 100%;
      height: 100%;
    }
    .clear-icon {
      position: absolute;
      z-index: 9;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }
  }
}
</style>
