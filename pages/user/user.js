var app = getApp();
var Constant = require('../../utils/constant.js');

Page({
        data: {
                userInfo: {},
                cfd: 'xxx',
                mdd: 'xxx',
                mdd1: '',
                mode: ['我的收藏', '我的订单', '我的地址', '联系客服', '关于我们']
        },
        onLoad: function() {
                var that = this;
                that.setData({
                        userInfo: app.globalData.userInfo
                })
                // saveUserInfo(that); //保存用户数据
                // wx.login({
                //         success: function() {
                //                 wx.getUserInfo({
                //                         success: function(res) {
                //                                 that.setData({
                //                                         userInfo: res.userInfo
                //                                 })
                //                                 saveUserInfo(that); //保存用户数据
                //                         }
                //                 })
                //         }
                // });
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
        mypublish: function() {
                var targetUrl = "/pages/user/mypublish/mypublish?photoUrl=" + this.data.userInfo.avatarUrl;
                wx.navigateTo({
                        url: targetUrl
                });
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
                                        title: res.data.retMsg,
                                        duration: 3000
                                })
                                // wx.hideToast();
                        },
                        fail: function(res) {
                                console.log(res)
                                wx.showToast({
                                        icon: 'none',
                                        title: res.errMsg,
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