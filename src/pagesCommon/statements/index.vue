<template>
  <view class="nav-wrap">
    <view
      class="header-area"
      :style="{ top: `calc(${top} + (${height} - 40rpx)/2 )` }"
    >
      <v-icon
        class="back-icon"
        type="back"
        size="46rpx"
        color="#fff"
        @tap="handleBack"
      ></v-icon>
      <view class="nav-title">声明与政策</view>
    </view>
  </view>

  <view class="scan-login">
    <!-- <view class="img-container">
      <image class="banner-img" :src="`${_IMG_BASE}/login/logo.png`"></image>
    </view> -->

    <view class="content">
      <view class="title">声明与政策</view>

      <view class="text-line-one">欢迎您来至爱门店管理!</view>

      <view class="text-line-two">
        在使用至爱门店小程序前，请您阅读并充分理解
        <text class="protocol" @click="goToAgreement(25, '用户协议')">
          《用户协议》
        </text>
        、
        <text class="protocol" @click="goToAgreement(24, '隐私政策')">
          《隐私政策》
        </text>
        如您同意以上内容，请点击“同意”并开始使用我们的产品和服务。
      </view>

      <view class="text-line-three">
        我们将严格遵守相关法律法规和隐私政策以保护您的个人信息，感谢您对门店工作台的信任。
      </view>

      <view class="agreement-btn" @click="submitChange(1)">同意</view>

      <view class="against-btn" @click="submitChange(2)">不同意</view>
    </view>

    <uni-popup :show="showPopup" position="middle" :maskClose="false">
      <view class="authorization-modal">
        <view class="title-head">
          <view class="title">您需要同意相关政策条款方可使用</view>
          <view class="title special-title">门店工作台小程序</view>
        </view>
        <view class="authorizationBtn">
          <view class="btn">
            <navigator open-type="exit" target="miniProgram" @click="close()">
              不同意并退出
            </navigator>
          </view>
          <view class="btn agree-btn" @click="close()">我知道了</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/popup/popup'
import { useUserStore } from '@/stores/user'
import { navTo } from '@/utils'

const userStore = useUserStore()
export default {
  name: 'statement',
  props: {},
  components: {
    uniPopup
  },
  data() {
    return {
      isOpen: false,
      showPopup: false,
      $imgBase: _IMG_BASE,
      top: ''
    }
  },
  computed: {},
  created() {
    // 胶囊按钮信息
    const { top, height } = uni.getMenuButtonBoundingClientRect()
    this.top = top + 'px'
    this.height = height + 'px'
  },
  methods: {
    submitChange(type) {
      console.log('是否同意==>', type)
      if (type === 1) {
        userStore.setIsAgree()
        this.handleBack()
      } else {
        this.showPopup = true
      }
    },
    close() {
      this.showPopup = false
    },
    goToAgreement(helpId, helpTitle) {
      uni.navigateTo({
        url: `/pages/webview/index?url=${encodeURIComponent(
          'https://zashoph5.i72.com/#/pagesOther/protocol/index?id='
        )}${encodeURIComponent(helpId)}&title=${encodeURIComponent(helpTitle)}`
      })
    },
    // 点击返回
    handleBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        navTo('/pages/home/index')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-wrap {
  width: 100vw;
  height: 40vh;
  position: relative;
  display: flex;
  align-items: center;
  background-image: url(#{_IMG_BASE}/statement/top_pic.jpg);
  background-repeat: no-repeat;
  background-position: left top;
  background-size: 100% 100%;

  .header-area {
    position: absolute;
    top: 100rpx;
    display: flex;
    justify-content: center;
    width: 100%;

    .back-icon {
      position: absolute;
      left: 20rpx;
    }

    .nav-title {
      font-size: 36rpx;
      color: #fff;
    }
  }
}
.scan-login {
  .login-text {
    color: #333333;
    font-size: 48rpx;
    margin-bottom: 92rpx;
  }
  .login-tips {
    text-align: center;
    margin: 0 auto;
    width: 620rpx;
    color: #aaaaaa;
    font-size: 28rpx;
    line-height: 1.4;
  }
  .login-by-phone-btn {
    margin-top: 52rpx;
    width: 674rpx;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 5px;
    color: #fff;
    font-size: 32rpx;
    box-shadow: darkgrey 0rpx 0rpx 20rpx;
  }
  .accept-agrrment {
    margin-top: 40rpx;
  }

  .img-container {
    display: flex;
    justify-content: center;
    .banner-img {
      width: 140rpx;
      height: 140rpx;
    }
  }
}
.content {
  padding: 0px 60rpx 0px 60rpx;
  @include safe-area('p', 20rpx);
  .title {
    width: 100%;
    text-align: center;
    font-size: 36rpx;
    margin-bottom: 60rpx;
  }
  .text-line-two,
  .text-line-three {
    margin-top: 30rpx;
    line-height: 50rpx;
  }
  .protocol {
    color: #1e7ccc;
  }
  .agreement-btn,
  .against-btn {
    background: #1e7ccc;
    width: 100%;
    border-radius: 44rpx;
    font-size: 28rpx;
    font-weight: bold;
    text-align: center;
    height: 88rpx;
    line-height: 88rpx;
    color: #ffffff;
    margin-top: 60rpx;
  }
  .against-btn {
    border: 1px solid #eeeeee;
    background: #fff;
    margin-top: 30rpx;
    color: #999;
  }
}
.is-agreement {
  background-color: rgba(44, 65, 152, 1);
  color: #ffffff;
}
.authorization-modal {
  background: #fff;
  border-radius: 16rpx;
  text-align: center;
  width: 560rpx;
  .title-head {
    padding: 40rpx;
    .title {
      font-size: 32rpx;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 52rpx;
      text-align: center;
    }
  }
  .authorizationBtn {
    display: flex;
    justify-content: space-around;
    margin: 0 auto;
    border-top: 1rpx solid #ddd;
    .btn {
      flex: 1;
      color: #333;
      text-align: center;
      font-size: 32rpx;
      padding: 20rpx 0;
    }
    .agree-btn {
      border-left: 1rpx solid #ddd;
      color: red;
    }
  }
}
</style>
