// 引入utils包下的js文件
var Constant = require('../../../../utils/constant.js');

//获取应用实例
var app = getApp();

var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();

Page({
        data: {
                height: 20,
                focus: false,
                userInfo: {},

                select: false,
                grade_name: '--请选择行驶方向--',
                items: [],

                select2: false,
                grade_name2: '--请选择出行类别--',
                grades: [
                        '人找车',
                        '车找人'
                ],


                startDate: "--请选择出行日期--",
                multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
                multiIndex: [0, 0, 0],
        },
        onLoad: function() {
                this.setData({
                        userInfo: app.globalData.userInfo
                });

                //请求方向数据
                requestData(this);
        },

        bindShowMsg: function() {
                this.setData({
                        select: !this.data.select
                }) 
        },
        bindShowMsg2: function () {
                this.setData({
                        select2: !this.data.select2
                })
        },

        mySelect: function(e) {
                console.log(e)
                var name = e.currentTarget.dataset.name
                this.setData({
                        grade_name: name,
                        select: false
                })      
        },
        mySelect2: function (e) {
                console.log(e)
                var name = e.currentTarget.dataset.name
                this.setData({
                        grade_name2: name,
                        select2: false
                })
        },
        formSubmit: function(e) {
                var that = this;
                if (!validFrm(that, e.detail.value)) //表单验证
                        return;
                console.log('form发生了submit事件，携带数据为：', e.detail.value);
                save(this, e.detail.value); //保存数据
        },


        pickerTap: function () {
                date = new Date();

                var monthDay = ['今天', '明天'];
                var hours = [];
                var minute = [];

                currentHours = date.getHours();
                currentMinute = date.getMinutes();

                // 月-日
                for (var i = 2; i <= 28; i++) {
                        var date1 = new Date(date);
                        date1.setDate(date.getDate() + i);
                        var md = (date1.getMonth() + 1) + "-" + date1.getDate();
                        monthDay.push(md);
                }

                var data = {
                        multiArray: this.data.multiArray,
                        multiIndex: this.data.multiIndex
                };

                if (data.multiIndex[0] === 0) {
                        if (data.multiIndex[1] === 0) {
                                this.loadData(hours, minute);
                        } else {
                                this.loadMinute(hours, minute);
                        }
                } else {
                        this.loadHoursMinute(hours, minute);
                }

                data.multiArray[0] = monthDay;
                data.multiArray[1] = hours;
                data.multiArray[2] = minute;

                this.setData(data);
        },




        bindMultiPickerColumnChange: function (e) {
                date = new Date();

                var that = this;

                var monthDay = ['今天', '明天'];
                var hours = [];
                var minute = [];

                currentHours = date.getHours();
                currentMinute = date.getMinutes();

                var data = {
                        multiArray: this.data.multiArray,
                        multiIndex: this.data.multiIndex
                };
                // 把选择的对应值赋值给 multiIndex
                data.multiIndex[e.detail.column] = e.detail.value;

                // 然后再判断当前改变的是哪一列,如果是第1列改变
                if (e.detail.column === 0) {
                        // 如果第一列滚动到第一行
                        if (e.detail.value === 0) {

                                that.loadData(hours, minute);

                        } else {
                                that.loadHoursMinute(hours, minute);
                        }

                        data.multiIndex[1] = 0;
                        data.multiIndex[2] = 0;

                        // 如果是第2列改变
                } else if (e.detail.column === 1) {

                        // 如果第一列为今天
                        if (data.multiIndex[0] === 0) {
                                if (e.detail.value === 0) {
                                        that.loadData(hours, minute);
                                } else {
                                        that.loadMinute(hours, minute);
                                }
                                // 第一列不为今天
                        } else {
                                that.loadHoursMinute(hours, minute);
                        }
                        data.multiIndex[2] = 0;

                        // 如果是第3列改变
                } else {
                        // 如果第一列为'今天'
                        if (data.multiIndex[0] === 0) {

                                // 如果第一列为 '今天'并且第二列为当前时间
                                if (data.multiIndex[1] === 0) {
                                        that.loadData(hours, minute);
                                } else {
                                        that.loadMinute(hours, minute);
                                }
                        } else {
                                that.loadHoursMinute(hours, minute);
                        }
                }
                data.multiArray[1] = hours;
                data.multiArray[2] = minute;
                this.setData(data);
        },

        loadData: function (hours, minute) {
                var minuteIndex;
                if (currentMinute > 0 && currentMinute <= 10) {
                        minuteIndex = 10;
                } else if (currentMinute > 10 && currentMinute <= 20) {
                        minuteIndex = 20;
                } else if (currentMinute > 20 && currentMinute <= 30) {
                        minuteIndex = 30;
                } else if (currentMinute > 30 && currentMinute <= 40) {
                        minuteIndex = 40;
                } else if (currentMinute > 40 && currentMinute <= 50) {
                        minuteIndex = 50;
                } else {
                        minuteIndex = 60;
                }

                if (minuteIndex == 60) {
                        // 时
                        for (var i = currentHours + 1; i < 24; i++) {
                                if(i.length == 1){
                                        i = "0" + i
                                }
                                hours.push(i);
                        }
                        // 分
                        for (var i = 0; i < 60; i += 10) {
                                minute.push(i);
                        }
                } else {
                        // 时
                        for (var i = currentHours; i < 24; i++) {
                                hours.push(i);
                        }
                        // 分
                        for (var i = minuteIndex; i < 60; i += 10) {
                                minute.push(i);
                        }
                }
        },

        loadHoursMinute: function (hours, minute) {
                // 时
                for (var i = 0; i < 24; i++) {
                        hours.push(i);
                }
                // 分
                for (var i = 0; i < 60; i += 10) {
                        minute.push(i);
                }
        },

        loadMinute: function (hours, minute) {
                var minuteIndex;
                if (currentMinute > 0 && currentMinute <= 10) {
                        minuteIndex = 10;
                } else if (currentMinute > 10 && currentMinute <= 20) {
                        minuteIndex = 20;
                } else if (currentMinute > 20 && currentMinute <= 30) {
                        minuteIndex = 30;
                } else if (currentMinute > 30 && currentMinute <= 40) {
                        minuteIndex = 40;
                } else if (currentMinute > 40 && currentMinute <= 50) {
                        minuteIndex = 50;
                } else {
                        minuteIndex = 60;
                }

                if (minuteIndex == 60) {
                        // 时
                        for (var i = currentHours + 1; i < 24; i++) {
                                hours.push(i);
                        }
                } else {
                        // 时
                        for (var i = currentHours; i < 24; i++) {
                                hours.push(i);
                        }
                }
                // 分
                for (var i = 0; i < 60; i += 10) {
                        minute.push(i);
                }
        },

        bindStartMultiPickerChange: function (e) {
                var that = this;
                var monthDay = that.data.multiArray[0][e.detail.value[0]];
                var hours = that.data.multiArray[1][e.detail.value[1]];
                var minute = that.data.multiArray[2][e.detail.value[2]];

                if (monthDay === "今天") {
                        var month = date.getMonth() + 1;
                        var day = date.getDate();
                        monthDay = month + "月" + day + "日";
                } else if (monthDay === "明天") {
                        var date1 = new Date(date);
                        date1.setDate(date.getDate() + 1);
                        monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";

                } else {
                        var month = monthDay.split("-")[0]; // 返回月
                        var day = monthDay.split("-")[1]; // 返回日
                        monthDay = month + "月" + day + "日";
                }

                var startDate = monthDay + " " + hours + "点" + minute + '分';
                that.setData({
                        startDate: startDate
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
        wx.request({
                url: Constant.TEST_URL + '/originAndDest/getOriginAndDest',
                header: {
                        "Content-Type": "application/json"
                },
                data: {
                        uid: that.data.userInfo.openId
                },
                success: function(res) {
                        if (res == null ||
                                res.data == null) {
                                console.error("god bless you...");
                                wx.showToast({
                                        title: '没有查询到数据',
                                        duration: 3000
                                })
                                return;
                        }

                        //将获得的各种数据写入itemList，用于setData
                        var itemList = [];
                        for (var i = 0; i < res.data.data.length; i++) {
                                var origin = res.data.data[i].origin.split('-')[1] + '/' + res.data.data[i].origin.split('-')[2];
                                var destination = res.data.data[i].destination.split('-')[1] + '/' + res.data.data[i].destination.split('-')[2];
                                itemList.push({
                                        txt: origin + ' —> ' + destination
                                });
                        }

                        //数据存放于data中
                        that.setData({
                                items: itemList
                        });
                        wx.hideToast();
                }
        });
}

function validFrm(that, val){
        let { title, direction, cellPhone, content } = val;
        if (title.indexOf("--") >= 0) {
                wx.showToast({
                        title: '请选择出行类别',
                        icon: 'none',
                        duration: 3000
                })
                return false;
        }
        if (direction.indexOf("--") >= 0) {
                wx.showToast({
                        title: '请选择行驶方向',
                        icon: 'none',
                        duration: 3000
                })
                return false;
        }
        if (cellPhone == '') {
                wx.showToast({
                        title: '请输入手机号',
                        icon: 'none',
                        duration: 3000
                })
                return false;
        } else {
                var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!myreg.test(cellPhone)) {
                        wx.showToast({
                                title: '请正确输入手机号',
                                icon: 'none',
                                duration: 3000
                        })
                        return false;
                }
        }
        var startDate = that.data.startDate;
        if (startDate == ''){
                wx.showToast({
                        title: '请选择出行时间',
                        icon: 'none',
                        duration: 3000
                })
                return false;
        } else {
                if (startDate.indexOf("--") >= 0) {
                        wx.showToast({
                                title: '请选择出行时间',
                                icon: 'none',
                                duration: 3000
                        })
                        return false;
                }    
        }
        var counts = 150;
        if (content == '') {
                wx.showToast({
                        title: '请输入描述内容',
                        icon: 'none',
                        duration: 3000
                })
                return false;
        } else {
                if (content.length > counts) {
                        wx.showToast({
                                title: '输入内容不能超过' + counts + '字',
                                icon: 'none',
                                duration: 3000
                        })
                        return false;
                }
        }
        return true;
}

function save(that, val){
        wx.showToast({
                title: '加载中',
                icon: 'loading'
        });
        let { title, direction, cellPhone, content } = val;
        var goTime = that.data.startDate;
        wx.request({
                url: Constant.TEST_URL + '/publish/save',
                header: {
                        "Content-Type": "application/json"
                },
                data: {
                        title: title,
                        direction: direction,
                        cellPhone: cellPhone,
                        content: content,
                        uId: that.data.userInfo.openId,
                        goTime: goTime
                },
                success: function (res) {
                        if (res == null ||
                                res.data == null) {
                                console.error("god bless you...");
                                wx.showToast({
                                        title: '保存数据失败',
                                        duration: 3000
                                })
                                return;
                        }

                        //解析返回数据
                        if(res.data.retCode == 0){
                                var pages = getCurrentPages();
                                pages[pages.length - 2].onLoad();

                                wx.navigateBack({
                                        delta: 1
                                })
                                
                                wx.showToast({
                                        title: '数据保存成功。',
                                        icon: 'none',
                                        duration: 3000
                                })
                        } else {
                                wx.showToast({
                                        title: '数据保存失败，请稍后重试。',
                                        icon: 'none',
                                        duration: 3000
                                })
                        }
                }
        }); 
}