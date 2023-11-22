<template>
  <view
    class="custom-nav-container"
    :style="{
      height: `calc(${containerHeight}px + ${extraHeight}rpx)`
    }"
  >
    <view
      class="fix-wrap"
      :style="{
        position: isFixed ? 'fixed' : 'static',
        height: `calc(${containerHeight}px + ${extraHeight}rpx)`,
        paddingTop: `${paddingTop}px`
      }"
    >
      <view class="content" :style="{ height: `${contentHeight}px` }">
        <!-- 默认插槽 -->
        <slot>
          <view
            v-if="isShowMenu"
            class="left-wrap"
            :style="{ borderRadius: `${contentHeight / 2}px` }"
          >
            <view class="back-wrap" @tap="handleBack">
              <image class="img" :src="`${_IMG_BASE}/back_icon.png`"></image>
            </view>

            <view class="menu-wrap" @tap="handleMenu">
              <image class="img" :src="`${_IMG_BASE}/menu_icon.png`"></image>
            </view>
          </view>

          <view
            class="title"
            :style="{
              color: color,
              opacity: linearTitle ? scrollTop / scrollMaxHeight : 1
            }"
          >
            {{ title }}
          </view>
        </slot>
      </view>

      <view
        class="bg-wrap"
        :style="{
          opacity: linearBg ? scrollTop / scrollMaxHeight : 1,
          backgroundColor: isShowBgImg ? 'transparent' : bgColor
        }"
        :class="{ 'show-bg-img': isShowBgImg }"
      />
    </view>

    <view
      v-if="isFixed && isFixedHeight"
      :style="{ height: `calc(${containerHeight}px + ${extraHeight}rpx)` }"
    />

    <!-- 菜单弹框 -->
    <menu-popup v-model:show="showMenu" :top="containerHeight" />
  </view>
</template>

<script setup>
import menuPopup from './components/menu-popup.vue'

defineProps({
  title: {
    // 标题
    type: String,
    default: ''
  },
  color: {
    // 标题颜色
    type: String,
    default: '#FFFFFF'
  },
  bgColor: {
    // 背景颜色
    type: String,
    default: '#0CAD83'
  },
  isFixed: {
    // 是否固定标题
    type: Boolean,
    default: true
  },
  isFixedHeight: {
    // fixed固定时是否撑满高度
    type: Boolean,
    default: true
  },
  scrollTop: {
    type: Number,
    default: 0
  },
  scrollMaxHeight: {
    type: Number,
    default: 150
  },
  linearBg: {
    // 渐变背景
    type: Boolean,
    default: false
  },
  linearTitle: {
    // 渐变标题
    type: Boolean,
    default: false
  },
  extraHeight: {
    // 高度
    type: Number,
    default: 0
  },
  isShowBgImg: {
    // 是否显示背景图片
    type: Boolean,
    default: true
  },
  isShowMenu: {
    // 是否显示菜单
    type: Boolean,
    default: false
  }
})

const _IMG_BASE = _IMG_BASE

// 状态栏高度
const { statusBarHeight } = uni.getSystemInfoSync()
// 胶囊按钮信息
const { top, height } = uni.getMenuButtonBoundingClientRect()

const paddingTop = computed(() => top)
const contentHeight = computed(() => height)
const containerHeight = computed(
  () => height + (top - statusBarHeight) * 2 + statusBarHeight
)

// 点击返回
const handleBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    navTo('/pages/home/index')
  }
}

const showMenu = ref(false)
// 点击菜单
const handleMenu = () => {
  showMenu.value = !showMenu.value
}

defineExpose({
  containerHeight
})
</script>

<style lang="scss" scoped>
.custom-nav-container {
  .fix-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding-left: 26rpx;
    padding-right: 26rpx;
    z-index: 9999;
    .content {
      z-index: 10000000;
      position: relative;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      .left-wrap {
        width: 154rpx;
        height: 100%;
        background: #ffffff;
        border: 1px solid #eeeeee;
        opacity: 0.8;
        position: relative;
        display: flex;
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 2rpx;
          height: 34rpx;
          background: #eeeeee;
          opacity: 0.5;
        }
        .back-wrap {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          .img {
            width: 17rpx;
            height: 28rpx;
          }
        }
        .menu-wrap {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          .img {
            width: 28rpx;
            height: 23rpx;
          }
        }
      }
      .title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 28rpx;
      }
    }
    .bg-wrap {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      box-sizing: content-box;
    }

    .show-bg-img {
      background-image: url(#{$_IMG_BASE}/head_bg1.jpg);
      background-repeat: no-repeat;
      background-position: center top;
      background-size: cover;
    }
  }
}
</style>
