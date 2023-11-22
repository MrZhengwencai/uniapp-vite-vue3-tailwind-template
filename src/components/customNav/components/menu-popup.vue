<template>
  <view>
    <v-popup :show="show" position="top" @hidePopup="hidePopup">
      <view class="menu-wrap" :style="{ top: `calc(${top}px + 15rpx)` }">
        <view
          class="nav-item"
          v-for="(item, index) in navList"
          :key="index"
          @tap="handleNavItem(item)"
        >
          <image
            class="img"
            :style="{ width: `${item.w}rpx`, height: `${item.h}rpx` }"
            :src="item.img"
          ></image>
          <view class="text">{{ item.text }}</view>
        </view>
      </view>
    </v-popup>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import vPopup from '@/components/popup/popup'
import { navTo } from '@/utils'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  top: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['update:show'])

// 图片路径
const _IMG_BASE = _IMG_BASE

// 导航列表
const navList = ref([
  {
    w: 44,
    h: 44,
    img: `${_IMG_BASE}/home1.png`,
    text: '首页',
    path: 'pages/home/index'
  },
  {
    w: 42,
    h: 40,
    img: `${_IMG_BASE}/mall.png`,
    text: '商城',
    path: 'pages/goods/cate'
  },
  {
    w: 59,
    h: 47,
    img: `${_IMG_BASE}/shopCart.png`,
    text: '购物车',
    path: 'pages/shopcart/list'
  },
  {
    w: 36,
    h: 46,
    img: `${_IMG_BASE}/uc.png`,
    text: '我的',
    path: 'pages/uc/index'
  }
])

// 点击导航
const handleNavItem = (item) => {
  navTo(item.path)
}

// 关闭
const hidePopup = () => {
  emit('update:show', false)
}
</script>

<style lang="scss" scoped>
.menu-wrap {
  background-color: #fff;
  // width: 698rpx;
  // height: 140rpx;
  position: absolute;
  left: 26rpx;
  border-radius: 16rpx;
  box-shadow: 0rpx 10rpx 24rpx 0rpx rgba(0, 0, 0, 0.2);
  display: flex;
  padding: 0 40rpx;
  &::before {
    content: '';
    width: 0;
    border-width: 0 15rpx 15rpx 15rpx;
    border-style: solid;
    border-color: transparent transparent #fff transparent;
    position: absolute;
    top: -15rpx;
    left: 116rpx;
    transform: translateX(-50%);
  }
  .nav-item {
    line-height: 1;
    padding: 35rpx 50rpx 26rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    .img {
      margin-bottom: 12rpx;
    }
    .text {
      font-size: 24rpx;
      font-weight: bold;
    }
  }
}
</style>
