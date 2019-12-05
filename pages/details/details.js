Page({
        data: {
                publishInfo: {},

                hidden: false,
                toastHidden: true,
                modalHidden: true,
                toastText: "数据异常",
                loadingText: "加载中..."
        },

        onLoad: function(options) {
                that = this;
                if (options == null || options.param == null) {
                        this.setData({
                                hidden: true,
                                toastHidden: false
                        });
                        return;
                }

                var obj = JSON.parse(options.param);
                this.setData({
                        hidden: true,
                        toastHidden: true,
                        publishInfo: obj
                })
        },
        //Toast信息改变
        onToastChanged: function(event) {
                this.setData({
                        toastHidden: true
                });
        },
        // 长按
        onlongclick: function() {
                this.setData({
                        modalHidden: false
                });
        },
        // 保存
        onSaveClick: function(event) {
                var mUrl = "";
                if (event.currentTarget.dataset.url != null)
                        mUrl = event.currentTarget.dataset.url;
                console.log("download：" + mUrl);
                saveImage(mUrl);
        },
        // 取消
        onCancelClick: function(event) {
                this.setData({
                        modalHidden: true
                });
        },
        makePhoneCall: function (e) {
                // console.log(e)
                // console.log(e.currentTarget.dataset.text)
                wx.makePhoneCall({
                        phoneNumber: e.currentTarget.dataset.text,
                        success() {
                                console.log('拨打成功')
                        }
                })
        }
});

var that;