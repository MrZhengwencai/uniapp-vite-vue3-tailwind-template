<template>
  <view @touchmove.stop.prevent="moveHandle" @tap.stop>
    <view
      v-show="show"
      :style="{ top: offsetTop + 'px' }"
      class="uni-mask"
      @click="maskClose ? hide() : () => {}"
      @touchmove.stop.prevent="moveHandle"
    />
    <view
      v-show="show"
      :class="['uni-popup-' + position, 'uni-popup-' + mode, show ? '_show' : '_hide']"
      class="uni-popup"
      :style="{ borderRadius: raduis }"
    >
      {{ msg }}
      <slot />
    </view>
  </view>
</template>

<script>
export default {
  name: 'UniPopup',
  props: {
    /**
     * 页面显示
     */
    show: {
      type: Boolean,
      default: false
    },
    /**
     * 对齐方式
     */
    position: {
      type: String,
      // top - 顶部， middle - 居中, bottom - 底部
      default: 'middle'
    },
    /**
     * 显示模式
     */
    mode: {
      type: String,
      default: 'insert'
    },
    /**
     * 额外信息
     */
    msg: {
      type: String,
      default: ''
    },
    /**
     * h5遮罩是否到顶
     */
    h5Top: {
      type: Boolean,
      default: false
    },
    raduis: {
      type: String,
      default: '0px 0px 0px 0px'
    },
    /**
     * 点击遮罩层关闭
     */
    maskClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      offsetTop: 0
    }
  },
  watch: {
    h5Top(newVal) {
      if (newVal) {
        this.offsetTop = 44
      } else {
        this.offsetTop = 0
      }
    }
  },
  created() {
    let offsetTop = 0
    // #ifdef H5
    if (!this.h5Top) {
      offsetTop = 44
    } else {
      offsetTop = 0
    }
    // #endif
    this.offsetTop = offsetTop
  },
  methods: {
    hide() {
      if (this.showClose) return
      this.$emit('hidePopup')
    },
    moveHandle() {}
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/animations.scss';

.uni-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
}

.uni-popup {
  position: fixed;
  z-index: 1001;
}

.uni-popup-middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 380upx;
  min-height: 380upx;
  max-width: 100%;
  max-height: 80%;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.uni-popup-none,
.uni-popup-insert {
  background: none;
  box-shadow: none;
}

.uni-popup-middle {
  transform: translate(-50%, -60%);
}
.uni-popup-middle {
  transform: translate(-50%, -55%);
}

.uni-popup-middle.uni-popup-fixed {
  border-radius: 10upx !important;
  padding: 30upx;
}

.uni-close-bottom,
.uni-close-bottom-unconne,
.uni-close-right {
  position: absolute;
  bottom: -100upx;
  text-align: center;
  border-radius: 50%;
  color: #f5f5f5;
  font-size: 68upx;
  font-weight: bold;
  opacity: 0.8;
  z-index: -1;
}

.uni-close-bottom,
.uni-close-bottom-unconne {
  margin: auto;
  left: 0;
  right: 0;
  opacity: 0;
  animation: scaleIn ease-in-out 500ms 500ms both;
}

.uni-close-right {
  right: -60upx;
  top: -80upx;
}
.uni-close-bottom-unconne:after {
  content: '';
  position: absolute;
  width: 0px;
  top: -200upx;
  bottom: 70upx;
  left: 50%;
  transform: translate(-50%, -0%);
  opacity: 0.8;
}
.uni-popup-top,
.uni-popup-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}

.uni-popup-top {
  top: 0;
  left: 0;
  width: 100%;
  height: 100upx;
  line-height: 100upx;
  text-align: center;
}

.uni-popup-bottom {
  left: 0;
  bottom: 0;
  width: 100%;
  min-height: 100upx;
  line-height: 100upx;
  text-align: center;
}
.uni-popup-bottom._show {
  animation: showLayer 0.15s linear both;
}
._hide {
  display: none;
}
@keyframes showLayer {
  from {
    transform: translateY(100%);
  }
}
</style>
