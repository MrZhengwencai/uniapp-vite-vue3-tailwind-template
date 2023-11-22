<template>
  <view class="upload-container">
    <view v-for="item in list" :key="item" class="img-wrap">
      <text class="word-eclipse">{{ item.name }}</text>
      <v-icon
        @tap.stop="handleDel(item)"
        class="clear-icon"
        type="clear"
        color="#666"
        size="44rpx"
      />
    </view>
    <view v-if="list.length < num" class="upload-icon" @tap="handleUpload">
      <v-icon type="plusempty" color="#E8EAEC" size="60rpx" />
    </view>
  </view>
</template>

<script setup>
import { toRefs, onMounted, ref } from 'vue'
import { msg } from '@/utils'
import request from '@/http'

import { ossUpload } from '@/utils/wxUploadFile/oss'

const emit = defineEmits(['update:fileList', 'change'])

const props = defineProps({
  fileList: {
    // 文件地址列表
    type: Array,
    default: () => []
  },
  num: {
    // 最多能上传多少张图片
    type: [Number, String],
    default: 1
  },
  extension: {
    type: Array,
    default: () => ['.rar', '.zip', '.doc', '.docx', '.pdf', '.jpg', '.jpeg', '.png']
  }
})

const { fileList, num, extension } = toRefs(props)

const list = ref([])

const ossConfig = ref({})

onMounted(() => {
  console.log('fileList', fileList.value)
  request('getAliyunosssts', {}, { appName: 'mallSiteApi' }).then((res) => {
    console.log('res', res)
    if (res.result) {
      ossConfig.value = res.result
    }
  })
})

// 点击触发
function handleUpload() {
  console.log('上传')
  uni.chooseMessageFile({
    count: num.value,
    extension: extension.value,
    success(file) {
      imageInfoHandle(file)
    },
    fail() {
      // msg('上传文件失败')
    }
  })
}
// 图片信息处理
const imageInfoHandle = (file) => {
  console.log('file', file)
  const { path, size, name } = file.tempFiles[0]
  if (!path) return

  // 判断后缀是否符合
  const extensions = extension.value
  if (!extensions.some((item) => name.endsWith(item))) {
    msg(`仅支持${extensions.join('、')}格式的文件`)
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
    title: '文件上传中'
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
    list.value.push({
      path: data,
      name: file.tempFiles[0].name
    })
    emit('change', list.value)
    emit('update:fileList', list.value)
  } else {
    uni.showToast({
      title: '上传失败',
      icon: 'none'
    })
  }
}

// 删除图片
const handleDel = (file) => {
  list.value = list.value.filter((item) => item.path !== file.path) // 过滤删除的
  emit('change', list.value)
  emit('update:fileList', list.value)
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
    display: flex;
    align-items: center;

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
