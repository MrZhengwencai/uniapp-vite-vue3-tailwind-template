/**
 * 小程序分享
 * title: 标题
 * path: 路径
 * imageUrl: 分享图
 */
export function shareAppMessage({ title, url, path, imgUrl }) {
  wx.showShareMenu({
    withShareTicket: true
  })
  // console.log({ title, path: url || path, imgUrl });
  return {
    title: title,
    path: url || path,
    imageUrl: imgUrl,
    success: function (res) {
      if (res.errMsg == 'shareAppMessage:ok') {
        //判断分享是否成功
        if (res.shareTickets == undefined) {
          //判断分享结果是否有群信息
          //分享到好友操作...
        } else {
          //分享到群操作...
          // let shareTicket = res.shareTickets[0];
          // wx.getShareInfo({
          //   shareTicket: shareTicket,
          //   success: function (e) {
          //     //当前群相关信息
          //     var encryptedData = e.encryptedData;
          //     var iv = e.iv;
          //   },
          // });
        }
      }
    }
  }
}
