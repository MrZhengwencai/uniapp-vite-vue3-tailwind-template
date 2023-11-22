<template>
  <view class="wrapper-container">
    <customNav ref="customNavRef" bgColor="#333333" title="" />

    <view class="content-container">
      <nut-grid :gutter="10">
        <nut-grid-item text="图片" @tap="toOther('pages/image/index')">
          <nut-icon name="photograph" />
        </nut-grid-item>
        <nut-grid-item text="视频" @tap="toOther('pages/video/index')">
          <nut-icon name="play-circle-fill" />
        </nut-grid-item>
      </nut-grid>
    </view>

    <tabbar ref="tabbar" />
  </view>
</template>

<script setup>
// import { navTo } from '@/utils'

const toOther = (url) => {
  navTo(url)
}
</script>

<style lang="scss" scoped></style>
