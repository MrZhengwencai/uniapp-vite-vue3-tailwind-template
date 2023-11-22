<template>
  <view>
    <web-view :src="webSrc"> </web-view>
  </view>
</template>

<script>
let pageOptions = null
export default {
  onLoad(options) {
    pageOptions = options
  }
}
</script>
<script setup>
import { ref } from 'vue'
import { onReady } from '@dcloudio/uni-app'

// web-view的src
const webSrc = ref('')

onReady(() => {
  const { url, path } = pageOptions
  const _path = decodeURIComponent(path || url)
  console.log('_path', _path)
  console.log('path', path)
  webSrc.value = _path
})
</script>

<style lang="scss" scoped></style>
