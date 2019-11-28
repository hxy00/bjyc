var tcity = require("../../../utils/citys.js");
var constant = require('../../../utils/constant.js');

Page({
        /**
         * 页面的初始数据
         */
        data: {
                provinces: [],
                province: "",
                province1: "",
                citys: [],
                city: "",
                city1: "",
                countys: [],
                county: '',
                county1: '',
                value: [0, 0, 0],
                values: [0, 0, 0],
                condition: false,
                isSearching: false,
                hasSelected: false,
                idxType: "",
                userInfo: {}
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                console.log("onLoad");
                var that = this;
                wx.showToast({
                        title: '载入中(•ᴗ•)',
                        icon: 'loading',
                        mask: true
                });

                that.setData({
                        userInfo: getApp().globalData.userInfo
                })
                tcity.init(that); //将城市列表载入data
                var cityData = that.data.cityData;
                const provinces = [];
                for (let i = 0; i < cityData.length; i++) {
                        provinces.push(cityData[i].name); //将省份信息记入provinces数组
                }
                console.log('省份完成');
                that.setData({
                        'provinces': provinces //储存在Page.data中 
                })
                console.log('初始化完成');
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        bindChange: function (event) { //当picker列表变化时，相应修改地区input中显示的位置值
                var val = event.detail.value;
                var t = this.data.values;
                var cityData = this.data.cityData;
                var idxType = this.data.idxType;
                this.setData({
                        hasSelected: false
                });
                if (idxType == 'cfd') { // 出发地
                        if (val[0] != t[0]) { //省份是否相同
                                console.log('province no ');
                                const citys = [];
                                const countys = [];
                                for (let i = 0; i < cityData[val[0]].sub.length; i++) {
                                        citys.push(cityData[val[0]].sub[i].name)
                                }
                                for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
                                        countys.push(cityData[val[0]].sub[0].sub[i].name)
                                }
                                this.setData({
                                        province: this.data.provinces[val[0]],
                                        city: cityData[val[0]].sub[0].name,
                                        citys: citys,
                                        county: cityData[val[0]].sub[0].sub[0].name,
                                        countys: countys,
                                        values: val,
                                        value: [val[0], 0, 0]
                                })
                                return;
                        }
                        if (val[1] != t[1]) { //城市是否相同
                                console.log('city no');
                                const countys = [];
                                for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
                                        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
                                }
                                this.setData({
                                        city: this.data.citys[val[1]],
                                        county: cityData[val[0]].sub[val[1]].sub[0].name,
                                        countys: countys,
                                        values: val,
                                        value: [val[0], val[1], 0]
                                })
                                return;
                        }
                        if (val[2] != t[2]) { //区县是否相同
                                console.log('county no');
                                this.setData({
                                        county: this.data.countys[val[2]],
                                        values: val
                                })
                                return;
                        }
                } else if (idxType == 'mdd') { //目的地
                        if (val[0] != t[0]) { //省份是否相同
                                console.log('province no ');
                                const citys = [];
                                const countys = [];
                                for (let i = 0; i < cityData[val[0]].sub.length; i++) {
                                        citys.push(cityData[val[0]].sub[i].name)
                                }
                                for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
                                        countys.push(cityData[val[0]].sub[0].sub[i].name)
                                }
                                this.setData({
                                        province1: this.data.provinces[val[0]],
                                        city1: cityData[val[0]].sub[0].name,
                                        citys: citys,
                                        county1: cityData[val[0]].sub[0].sub[0].name,
                                        countys: countys,
                                        values: val,
                                        value: [val[0], 0, 0]
                                })
                                return;
                        }
                        if (val[1] != t[1]) { //城市是否相同
                                console.log('city no');
                                const countys = [];
                                for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
                                        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
                                }
                                this.setData({
                                        city1: this.data.citys[val[1]],
                                        county1: cityData[val[0]].sub[val[1]].sub[0].name,
                                        countys: countys,
                                        values: val,
                                        value: [val[0], val[1], 0]
                                })
                                return;
                        }
                        if (val[2] != t[2]) { //区县是否相同
                                console.log('county no');
                                this.setData({
                                        county1: this.data.countys[val[2]],
                                        values: val
                                })
                                return;
                        }
                }
        },

        onfocus: function (event) { //打开搜索页面
                var city = this.data.city;
                var county = this.data.county;
                var province = this.data.province;
                wx.navigateTo({
                        url: '../house_search/search?city=' + city + '&county=' + county + '&province=' + province
                })
        },

        open: function (event) { //打开地址选择picker
                var idxType = event.currentTarget.dataset.text;
                this.setData({
                        condition: true,
                        idxType: idxType
                });
                if (idxType == 'mdd') {
                        this.setData({
                                value: [0, 0, 0],
                                values: [0, 0, 0],
                                citys: [],
                                countys: []
                        })
                }
        },

        close: function () {
                this.setData({
                        condition: false
                });
        },

        ensure: function () { //确认
                var origin = this.data.province + '-' + this.data.city + '-' + this.data.county;
                var dest = this.data.province1 + '-' + this.data.city1 + '-' + this.data.county1;
                wx.request({
                        url: constant.TEST_URL + '/originAndDest/save',
                        data: {
                                'uid': this.data.userInfo.openId,
                                'origin': origin,
                                'destination': dest
                        },
                        header: {
                                "Content-Type": "application/json"
                        },
                        success: function (res) {
                                //debugger;
                                if (res.data.retCode == 0) {

                                        wx.navigateBack({
                                                delta: 1
                                        })

                                        wx.showToast({
                                                title: '数据保存成功',
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

                // var pages = getCurrentPages(); // 获取页面栈
                // var currPage = pages[pages.length - 1]; // 当前页面
                // var prevPage = pages[pages.length - 2]; // 上一个页面

                // prevPage.setData({
                //         cfd: this.data.province + "-" + this.data.city + "-" + this.data.county,
                //         mdd: this.data.county1,
                //         mdd1: this.data.province + "-" + this.data.city + "-" + this.data.county
                // });

                // wx.navigateBack({
                //         delta: 1
                // })
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () { },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function () { },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function () { },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () { },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () { },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () { }
})