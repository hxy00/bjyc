// 引入utils包下的js文件
var Constant = require('../../../../utils/constant.js');
var time = require('../../../../utils/util.js');

//获取应用实例
var app = getApp();
Page({
        data: {
                items: []
        },

        onLoad: function (options) {
                var that = this
                requestData(that);
                if (options == null || options.photoUrl == null) {
                        return;
                }
        },
        add: function (e) {
                if (this.data.items.length >= 5) {
                        wx.showToast({
                                title: '该数据最多能保存5条',
                                icon: 'none',
                                duration: 3000
                        })
                        return;
                }
                wx.navigateTo({
                        url: '/pages/user/location/location',
                })
        },
        onItemClick: function (e) {
                var that = this;
                var id = e.currentTarget.dataset.text;
                wx.showModal({
                        title: '删除',
                        content: '确定要删除该条记录吗？',
                        success(res) {
                                if (!id) {
                                        wx.showToast({
                                                title: '参数为空',
                                                icon: 'none',
                                                duration: 3000
                                        })
                                        return;
                                }
                                if (res.confirm) {
                                        wx.request({
                                                url: Constant.TEST_URL + '/originAndDest/delete',
                                                data: {
                                                        id: id
                                                },
                                                success(res) {
                                                        if (res.data.retCode == 0) {
                                                                that.onLoad();
                                                                wx.showToast({
                                                                        icon: 'success',
                                                                        title: '删除成功',
                                                                        duration: 3000
                                                                });
                                                        } else {
                                                                wx.showToast({
                                                                        title: res.data.retMsg,
                                                                        icon: 'none',
                                                                        duration: 3000
                                                                })
                                                        }
                                                },
                                                fail(res) {
                                                        wx.showToast({
                                                                title: '删除失败，请稍后重试。',
                                                                icon: 'none',
                                                                duration: 3000
                                                        })
                                                }
                                        })
                                } else {
                                        console.log('取消删除');
                                }
                        }
                })


        }
})

/**
 * 请求数据
 * @param that Page的对象，用来setData更新数据
 */
function requestData(that) {
        wx.showToast({
                title: '加载中',
                icon: 'loading'
        });
        var openId = null;
        try {
                openId = app.globalData.userInfo.openId;
        } catch (e) {
                console.log(e.message);
                wx.showToast({
                        title: '获取openId出错：' + e.message,
                        icon: 'none',
                        duration: 3000
                });
                return;
        }
        if (openId == '' || openId == 'undefined') {
                wx.showToast({
                        title: '没有获取到openId',
                        icon: 'none',
                        duration: 3000
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
                success: function (res) {
                        if (res == null) {
                                console.error("god bless you...");
                                return;
                        }

                        //将获得的各种数据写入itemList，用于setData
                        var itemList = [];
                        for (var i = 0; i < res.data.data.list.length; i++)
                                itemList.push({
                                        id: res.data.data.list[i].id,
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