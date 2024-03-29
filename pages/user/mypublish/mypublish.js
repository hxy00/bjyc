// 引入utils包下的js文件
var Constant = require('../../../utils/constant.js');
var util = require('../../../utils/util.js');

//获取应用实例
var app = getApp();
Page({
        data: {
                items: [],
                hidden: false,
                loading: false,
                // loadmorehidden:true,
                photoUrl: "",
                plain: false,
                userInfo: {}
        },

        onLoad: function () {
                var that = this
                this.setData({
                        userInfo: app.globalData.userInfo
                });

                //请求数据
                mCurrentPage = 0;
                itemList = [];
                requestData(that, mCurrentPage + 1);
        },

        onItemClick: function (event) {
                console.log('itemClick');
                var targetUrl = "/pages/details/details";
                var params = event.currentTarget.dataset.text;
                if (params != null) {
                        var last = JSON.stringify(params);
                        targetUrl = targetUrl + "?param=" + last;
                        wx.navigateTo({
                                url: targetUrl
                        });
                } else {
                        wx.showToast({
                                title: '参数为空',
                                icon: 'none',
                                duration: 2000
                        })
                }
        },

        onItemLongClick: function (event) {
                var that = this;
                if (event.currentTarget.dataset.text != null) {
                        var id = event.currentTarget.dataset.text.id;
                        wx.showModal({
                                title: '删除',
                                content: '确定删除吗？',
                                success(res) {
                                        console.log(res)
                                        if (res.confirm) {
                                                wx.request({
                                                        url: Constant.TEST_URL + '/publish/delete',
                                                        header: {
                                                                "Content-Type": "application/json"
                                                        },
                                                        data: {
                                                                id: id,
                                                                uId: that.data.userInfo.openId
                                                        },
                                                        success: function(res) {
                                                                if (res.data.retCode == 0) {
                                                                        that.onLoad();
                                                                        wx.showToast({
                                                                                title: '删除成功',
                                                                                icon: 'success',
                                                                                duration: 3000
                                                                        })
                                                                } else {
                                                                        wx.showToast({
                                                                                title: res.data.retMsg,
                                                                                icon: 'none',
                                                                                duration: 3000
                                                                        })  
                                                                }
                                                        }
                                                })

                                        } else {
                                                console.log('用户点击取消')
                                        }
                                }
                        })
                }
        },

        // loadMore: function(event) {
        //         var that = this
        //         requestData(that, mCurrentPage + 1);
        // },

        onReachBottom: function (event) {
                var that = this
                that.setData({
                        hidden: false,
                });
                requestData(that, mCurrentPage + 1);
        },

        publish: function (event) {
                wx.navigateTo({
                        url: '/pages/user/mypublish/publish/publish',
                })
        },

        btnValid: function (event){
                var that = this;
                if (event.currentTarget.dataset.text != null) {
                        var id = event.currentTarget.dataset.text.id;
                        var uId = that.data.userInfo.openId;
                        wx.showModal({
                                title: '置为无效',
                                content: '确定要置为无效吗？',
                                success(res) {
                                        console.log(res)
                                        if (res.confirm) {
                                                wx.request({
                                                        url: Constant.TEST_URL + '/publish/setValid',
                                                        header: {
                                                                "Content-Type": "application/json"
                                                        },
                                                        data: {
                                                                id: id,
                                                                uId: that.data.userInfo.openId
                                                        },
                                                        success: function (res) {
                                                                if (res.data.retCode == 0) {
                                                                        that.onLoad();
                                                                        wx.showToast({
                                                                                title: '置为无效成功',
                                                                                icon: 'success',
                                                                                duration: 3000
                                                                        })
                                                                } else {
                                                                        wx.showToast({
                                                                                title: res.data.retMsg,
                                                                                icon: 'none',
                                                                                duration: 3000
                                                                        })
                                                                }
                                                        }
                                                })

                                        } else {
                                                console.log('用户点击取消')
                                        }
                                }
                        })
                }
        },

        onPullDownRefresh: function () {
                var that = this;
                that.onLoad(); //重新加载onLoad()
                setTimeout(function () {
                        //这里面是你要休眠后所执行的js代码
                        wx.stopPullDownRefresh();
                }, 3000);
        }
})

/**
 * 请求数据
 * @param that Page的对象，用来setData更新数据
 * @param targetPage 请求的目标页码
 */
var mCurrentPage = 0;
var itemList = [];
function requestData(that, targetPage) {
        wx.showToast({
                title: '加载中',
                icon: 'loading'
        });
        wx.request({
                url: Constant.TEST_URL + '/publish/getPage',
                header: {
                        "Content-Type": "application/json"
                },
                data: {
                        pageNum: targetPage,
                        uId: that.data.userInfo.openId
                },
                success: function (res) {
                        if (res == null ||
                                res.data == null ||
                                res.data.data == null ||
                                res.data.data.list.length <= 0) {

                                wx.showToast({
                                        title: '暂没有获取到更多数据。',
                                        icon: 'none',
                                        duration: 3000
                                })
                                return;
                        }

                        for (var i = 0; i < res.data.data.list.length; i++) {
                                var createdAt = util.formatTimeTwo(res.data.data.list[i].createdAt, 'Y-M-D h:m:s');
                                var publishedAt = util.formatTimeTwo(res.data.data.list[i].publishedAt, 'Y-M-D h:m:s');

                                var goTime = res.data.data.list[i].goTime;
                                var sp1 = goTime.split(' ');
                                var sp2 = sp1[0].split('-');
                                var sp3 = sp1[1].split(':');
                                var fGoTime = sp2[1] + '月' + sp2[2] + '日' + ' ' + sp3[0] + '点' + sp3[1] + '分';

                                itemList.push({
                                        createdAt: createdAt,
                                        publishedAt: publishedAt,
                                        id: res.data.data.list[i].id,
                                        goTime: fGoTime,
                                        cellPhone: res.data.data.list[i].cellPhone,
                                        title: res.data.data.list[i].title,
                                        isTimeOut: res.data.data.list[i].isTimeOut,
                                        isValid: res.data.data.list[i].isValid,
                                        direction: res.data.data.list[i].direction,
                                        content: res.data.data.list[i].content,
                                        nickName: res.data.data.list[i].nickName,
                                        avatarUrl: res.data.data.list[i].avatarUrl
                                });
                        }

                        //将获得的各种数据写入itemList，用于setData
                        that.setData({
                                items: itemList,
                                hidden: true,
                                // loadmorehidden:false,
                        });

                        mCurrentPage = targetPage;
                }
        });
}