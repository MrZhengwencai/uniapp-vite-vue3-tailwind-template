<template>
  <view class="tabbar-container">
    <view class="tab-list">
      <view
        class="tab-item"
        v-for="item in tabList"
        :key="item.pagePath"
        @tap="handleTabItem(item)"
      >
        <image
          v-show="activeTab !== item.pagePath"
          class="img"
          :src="item.iconPath"
        />

        <image
          v-show="activeTab === item.pagePath"
          class="img"
          :src="item.selectedIconPath"
        />

        <text class="text" :class="{ 'act-text': activeTab === item.pagePath }">
          {{ item.text }}
        </text>
      </view>
    </view>
    <!-- 撑起底部的高度 -->
    <view v-if="isHadHeight" class="tab-h"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  isHadHeight: {
    // 是否有撑起的高度
    type: Boolean,
    default: true
  }
})

// 隐藏官方tabbar
uni.hideTabBar({})

// tab列表
const tabList = ref([])

tabList.value = [
  {
    text: '首页',
    pagePath: 'pages/home/index',
    iconPath: `${_IMG_BASE}/home.png`,
    selectedIconPath: `${_IMG_BASE}/home_active.png`
  },
  {
    text: '图片去水印',
    pagePath: 'pages/image/index',
    iconPath: `${_IMG_BASE}/image.png`,
    selectedIconPath: `${_IMG_BASE}/image_active.png`
  },
  {
    text: '视频去水印',
    pagePath: 'pages/video/index',
    iconPath: `${_IMG_BASE}/video.png`,
    selectedIconPath: `${_IMG_BASE}/video_active.png`
  }
  // {
  //   text: '我的',
  //   pagePath: 'pages/me/index',
  //   iconPath: `${_IMG_BASE}/me.png`,
  //   selectedIconPath: `${_IMG_BASE}/me_active.png`
  // }
]

// 高亮的tab
const activeTab = ref('')
activeTab.value = 'pages/home/index'

// 根据路由判断tab
const pages = getCurrentPages()
activeTab.value = pages[pages.length - 1].route

// 点击tab
const handleTabItem = (item) => {
  navTo(item.pagePath)
}
</script>

<style lang="scss" scoped>
$tabHeight: 98rpx;
.tabbar-container {
  .tab-list {
    @include safe-area;
    height: $tabHeight;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: content-box;
    background-color: #fff;
    z-index: 9999;
    box-shadow: 0rpx -2rpx 2rpx 0rpx rgba(153, 153, 153, 0.05);
    .tab-item {
      height: $tabHeight;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .img {
        width: 48rpx;
        height: 48rpx;
        margin-bottom: 10rpx;
      }
      .text {
        font-size: 20rpx;
        line-height: 1;
        color: #999999;
        &.act-text {
          color: #333;
        }
      }
    }
  }
  .tab-h {
    @include safe-area('h', $tabHeight);
  }
}
</style>
