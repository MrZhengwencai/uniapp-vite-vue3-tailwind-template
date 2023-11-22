import { navTo } from '@/utils'

export function toWebview(path) {
  uni.navigateTo({
    url: `/pages/webview/index?path=${encodeURIComponent(path)}`
  })
}

export default function jumpToOther(path) {
  if (!path) return
  if (path.includes('http')) {
    toWebview(path)
  } else if (path.includes('/pages') || path.includes('/pagesOther')) {
    navTo(path)
  } else {
    uni.showToast({
      title: '跳转链接配置不正确，请检查',
      icon: 'none'
    })
  }
}
