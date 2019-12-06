var Constant = require('../utils/constant.js');
//获取应用实例
const app = getApp()

Page({
        data: {
                //判断小程序的API，回调，参数，组件等是否在当前版本可用。
                canIUse: wx.canIUse('button.open-type.getUserInfo'),
                isHide: false
        },

        onLoad: function () {
                var that = this;
                // 登录
                wx.login({
                        success: res => {
                                console.log('login success');
                                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                                getOpenId(res.code); //获取openId
                        }
                })
               
               //获取用户授权信息
                getSetting(this);
        },

        bindGetUserInfo: function (e) {
                if (e.detail.userInfo) {
                        //用户按了允许授权按钮
                        var that = this;

                        //获取用户授权信息
                        getSetting(that);
                        
                        // 获取到用户的信息了，打印到控制台上看下
                        //授权成功后
                        wx.switchTab({
                                url: '/pages/index/index',
                        });
                } else {
                        //用户按了拒绝按钮
                        wx.showModal({
                                title: '警告',
                                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                                showCancel: false,
                                confirmText: '返回授权',
                                success: function (res) {
                                        // 用户没有授权成功
                                        if (res.confirm) {
                                                console.log('用户点击了“返回授权”');
                                        }
                                }
                        });
                }
        }
})


/**
 * 获取openId
 */
function getOpenId(code) {
        console.log('根据code获取openId，code = ' + code);
        if (code) {
                //发送code到后台，分析openid
                wx.request({
                        url: Constant.TEST_URL + '/user/getOpenId',
                        data: {
                                'code': code
                        },
                        header: {
                                "Content-Type": "application/json"
                        },
                        success: function (res) {
                                console.log('getOpenId success');
                                //debugger;
                                if (res.data.retCode == 0) {
                                        var openId = res.data.data.openid;
                                        console.log('openId = ' + openId);
                                        wx.setStorageSync("openId", openId);
                                }
                        },
                        fail: function(res){
                                console.log(res);
                        },
                        complete: function (res) {
                                console.log(res);

                        }
                })
        }
}

/**
 * 获取用户授权信息
 */
function getSetting(that) {
        // 获取用户信息
        wx.getSetting({
                success: res => {
                        console.log('getSetting success');
                        if (res.authSetting['scope.userInfo']) {
                                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                                that.setData({
                                        isHide: false
                                });

                                wx.getUserInfo({
                                        success: res => {
                                                // 可以将 res 发送给后台解码出 unionId
                                                // this.globalData.userInfo = res.userInfo

                                                register(that, res.userInfo);

                                                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                                // 所以此处加入 callback 以防止这种情况
                                                if (that.userInfoReadyCallback) {
                                                        that.userInfoReadyCallback(res)
                                                }

                                                //授权成功后
                                                wx.switchTab({
                                                        url: '/pages/index/index',
                                                });
                                        }
                                })
                        } else {
                                // 用户没有授权
                                // 改变 isHide 的值，显示授权页面
                                that.setData({
                                        isHide: true
                                });
                        }
                }
        })
}

/**
 * 用户注册
 */
function register(that, userInfo) {
        var openId = wx.getStorageSync("openId");
        console.log('根据openId进行注册，openId = ' + openId);
        if (openId) {
                //发送code到后台，分析openid
                wx.request({
                        url: Constant.TEST_URL + '/user/register',
                        data: {
                                'nickName': userInfo.nickName,
                                'avatarUrl': userInfo.avatarUrl,
                                'gender': userInfo.gender,
                                'country': userInfo.country,
                                'province': userInfo.province,
                                'city': userInfo.city,
                                'lang': userInfo.language,
                                'openId': openId
                        },
                        header: {
                                "Content-Type": "application/json"
                        },
                        success: function (res) {
                                console.log('register success');
                                //debugger;
                                if (res.data.retCode == 0) { //操作成功
                                        app.globalData.userInfo = res.data.data;
                                } else {
                                        wx.showToast({
                                                title: '注册失败...',
                                                icon: "none",
                                                duration: 3000
                                        })
                                        app.globalData.userInfo = userInfo;
                                }
                        },
                        fail: function (res) {
                                console.log(res);
                        },
                        complete: function (res) {
                                console.log(res);
                        }
                })
        }
}