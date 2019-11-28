//app.js
App({
        onLaunch: function () {
                var that = this;
                // 展示本地存储能力
                var logs = wx.getStorageSync('logs') || []
                logs.unshift(Date.now())
                wx.setStorageSync('logs', logs)

                // 登录
                wx.login({
                        success: res => {
                                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                                getOpenId(res.code); //获取openId
                        }
                })
                // 获取用户信息
                wx.getSetting({
                        success: res => {
                                if (res.authSetting['scope.userInfo']) {
                                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
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
                                                }
                                        })
                                }
                        }
                })
        },
        globalData: {
                userInfo: null
        }
})

/**
 * 获取openId
 */
function getOpenId(code) {
        if (code) {
                //发送code到后台，分析openid
                wx.request({
                        url: 'http://127.0.0.1:8080/user/getOpenId',
                        data: {
                                'code': code
                        },
                        header: {
                                "Content-Type": "application/json"
                        },
                        success: function(res) {
                                //debugger;
                                if (res.data.retCode == 0) {
                                        var openId = res.data.data.openid;
                                        wx.setStorageSync("openId", openId);
                                }
                        }
                })
        }
}

/**
 * 用户注册
 */
function register(that, userInfo) {
        var openId =  wx.getStorageSync("openId");
        if (openId) {
                //发送code到后台，分析openid
                wx.request({
                        url: 'http://127.0.0.1:8080/user/register',
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
                        success: function(res) {
                                //debugger;
                                if (res.data.retCode == 0) { //操作成功
                                        //status为空时登录凭证code为空
                                        console.log(res.data.data);
                                        that.globalData.userInfo = res.data.data;
                                } else {
                                        wx.showToast({
                                                title: '登录凭证code为空...',
                                                icon: "none",
                                                duration: 2500
                                        })
                                        that.globalData.userInfo = userInfo;
                                }
                        }
                })
        }
}