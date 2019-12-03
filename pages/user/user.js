var app = getApp();
var Constant = require('../../utils/constant.js');

Page({
        data: {
                userInfo: {}
        },
        onLoad: function() {
                var that = this;
                that.setData({
                        userInfo: app.globalData.userInfo
                })
        },
        onItemClick: function(event) {
                console.log('itemClick');
                var targetUrl = "/pages/user/location/list/list";
                // if (event.currentTarget.dataset.url != null)
                //   targetUrl = targetUrl + "?url=" + event.currentTarget.dataset.url;
                wx.navigateTo({
                        url: targetUrl
                });
        },
        collect: function() {
                var targetUrl = "/pages/user/collect/collect";
                wx.navigateTo({
                        url: targetUrl
                });
        },
        mypublish: function () {
                // var targetUrl = "/pages/user/mypublish/mypublish?photoUrl=" + this.data.userInfo.avatarUrl;
                var targetUrl = "/pages/user/mypublish/mypublish";
                wx.navigateTo({
                        url: targetUrl
                });
        },
        about: function(){
                wx.showModal({
                        title: '关于本系统',
                        content: 'V2.1.0',
                        showCancel: false,
                })
        },
        testConnect: function() {
                wx.showToast({
                        title: '加载中',
                        icon: 'loading'
                });
                wx.request({
                        url: Constant.TEST_URL + '/testConnect',
                        header: {
                                "Content-Type": "application/json"
                        },
                        success: function(res) {
                                console.log('test ---------->' + res)
                                wx.showToast({
                                        icon: 'success',
                                        title: '连接成功',
                                        duration: 3000
                                })
                        },
                        fail: function(res) {
                                console.log(res)
                                wx.showToast({
                                        icon: 'none',
                                        title: '连接失败',
                                        duration: 3000
                                })
                        }
                });
        }
})

function saveUserInfo(that) {
        wx.request({
                url: Constant.TEST_URL + '/user/saveUserInfo',
                data: {
                        'nickName': that.data.userInfo.nickName,
                        'avatarUrl': that.data.userInfo.avatarUrl,
                        'gender': that.data.userInfo.gender,
                        'country': that.data.userInfo.country,
                        'province': that.data.userInfo.province,
                        'city': that.data.userInfo.city,
                        'lang': that.data.userInfo.language
                },
                header: {
                        "Content-Type": "application/json"
                },
                success: function(res) {
                        if (res == null) {
                                console.error("用户数据保存失败");
                        } else {
                                console.log(res.data.retMsg);
                        }
                }
        });
}