var app = getApp();

Page({
  data: {
    userInfo: {},
    mode: ['我的收藏', '我的订单', '我的地址', '联系客服', '关于我们']
  },
  onLoad: function () {
    var that = this;
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              userInfo: res.userInfo
            })
          }
        })
      }
    });
  },
  onItemClick: function (event) {
    console.log('itemClick');
    var targetUrl = "/pages/user/location/location";
    // if (event.currentTarget.dataset.url != null)
    //   targetUrl = targetUrl + "?url=" + event.currentTarget.dataset.url;
    wx.navigateTo({
      url: targetUrl
    });
  },
  collect: function(){
    var targetUrl = "/pages/user/collect/collect";
    wx.navigateTo({
      url: targetUrl
    });
  },
  mypublish: function () {
    var targetUrl = "/pages/user/mypublish/mypublish";
    wx.navigateTo({
      url: targetUrl
    });
  }
})
