//index.js
//获取应用实例
var app = getApp();
Page({
        data: {
                items: [],
                hidden: false,
                loading: false,
                // loadmorehidden:true,
                plain: false
        },

        onItemClick: function(event) {
                console.log('itemClick');
                var targetUrl = "/pages/fl/details/dts";
                if (event.currentTarget.dataset.text != null)
                        targetUrl = targetUrl + "?param=" + event.currentTarget.dataset.text;
                wx.navigateTo({
                        url: targetUrl
                });
        },

        // loadMore: function( event ) {
        //   var that = this
        //   requestData( that, mCurrentPage + 1 );
        // },

        onReachBottom: function() {
                var that = this
                that.setData({
                        hidden: false,
                });
                requestData(that, mCurrentPage + 1);
        },

        onLoad: function() {
                var that = this
                requestData(that, mCurrentPage + 1);
        },

        makePhoneCall: function(e) {
                // console.log(e)
                // console.log(e.currentTarget.dataset.text)
                wx.makePhoneCall({
                        phoneNumber: e.currentTarget.dataset.text,
                        success() {
                                // console.log('拨打成功')
                        }
                })
        }
})

/**
 * 定义几个数组用来存取item中的数据
 */
var mUrl = [];
var mDesc = [];
var mWho = [];
// var mTimes = [];
// var mTitles = [];

var mSource = [];
var mType = [];
var mPublishedAt = [];
var mCreatedAt = [];


var mCurrentPage = 0;

// 引入utils包下的js文件
var Constant = require('../../utils/constant.js');

/**
 * 请求数据
 * @param that Page的对象，用来setData更新数据
 * @param targetPage 请求的目标页码
 */
function requestData(that, targetPage) {
        wx.showToast({
                title: '加载中',
                icon: 'loading'
        });
        wx.request({
                url: Constant.GET_MEIZHI_URL + targetPage,
                header: {
                        "Content-Type": "application/json"
                },
                success: function(res) {
                        if (res == null ||
                                res.data == null ||
                                res.data.results == null ||
                                res.data.results.length <= 0) {

                                console.error("god bless you...");
                                return;
                        }


                        for (var i = 0; i < res.data.results.length; i++)
                                bindData(res.data.results[i]);

                        //将获得的各种数据写入itemList，用于setData
                        var itemList = [];
                        for (var i = 0; i < mUrl.length; i++)
                                itemList.push({
                                        url: mUrl[i],
                                        desc: mDesc[i],
                                        who: mWho[i],

                                        createTime: mCreatedAt[i],
                                        publishTime: mPublishedAt[i],
                                        source: mSource[i],
                                        type: mType[i]
                                });

                        that.setData({
                                items: itemList,
                                hidden: true,
                                // loadmorehidden:false,
                        });

                        mCurrentPage = targetPage;

                        wx.hideToast();
                }
        });
}

/**
 * 绑定接口中返回的数据
 * @param itemData Gank.io返回的content;
 */
function bindData(itemData) {
        var url = itemData.url.replace("//ww", "//ws");
        var desc = itemData.desc;
        var who = itemData.who;
        var createTime = itemData.createdAt.replace("T", " ").split(".")[0];
        var publishTime = itemData.publishedAt.replace("T", " ").split(".")[0];
        var source = itemData.source;
        var type = itemData.type;

        mUrl.push(url);
        mDesc.push(desc);
        mWho.push(who);

        mCreatedAt.push(createTime);
        mPublishedAt.push(publishTime);
        mSource.push(source);
        mType.push(type);
}