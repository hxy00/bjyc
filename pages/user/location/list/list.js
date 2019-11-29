//index.js
//获取应用实例
var app = getApp();
Page({
        data: {
                items: []
        },

        onLoad: function(options) {
                var that = this
                requestData(that);
                if (options == null || options.photoUrl == null) {
                        return;
                }
                this.setData({
                        photoUrl: options.photoUrl
                });
        }
})

// 引入utils包下的js文件
var Constant = require('../../../../utils/constant.js');
var time = require('../../../../utils/util.js');

/**
 * 请求数据
 * @param that Page的对象，用来setData更新数据
 */
function requestData(that) {
        wx.showToast({
                title: '加载中',
                icon: 'loading'
        });
        var openId = app.globalData.userInfo.openId;
        if (openId == '' || openId == 'undefined') {
                wx.showToast({
                        title: '没有获取到openId',
                        icon: 'none'
                });
                return;
        }
        wx.request({
                url: Constant.TEST_URL + '/originAndDest/getPage',
                data: {
                        uid: openId
                },
                header: {
                        "Content-Type": "application/json"
                },
                success: function(res) {
                        if (res == null ||
                                res.data == null ||
                                res.data.data == null ||
                                res.data.data.list.length <= 0) {

                                console.error("god bless you...");
                                return;
                        }

                        //将获得的各种数据写入itemList，用于setData
                        var itemList = [];
                        for (var i = 0; i < res.data.data.list.length; i++)
                                itemList.push({
                                        uid: res.data.data.list[i].uid,
                                        origin: res.data.data.list[i].origin,
                                        destination: res.data.data.list[i].destination,
                                        createAt: time.formatTimeTwo(res.data.data.list[i].createAt, 'Y-M-D h:m:s'),
                                        isDefault: res.data.data.list[i].isDefault
                                });

                        that.setData({
                                items: itemList,
                        });

                        wx.hideToast();
                }
        });
}