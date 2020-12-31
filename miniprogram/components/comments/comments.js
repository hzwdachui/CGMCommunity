// components/comments/comments.js

const app = getApp();
// get items from database
const DB = wx.cloud.database();

Component({
  lifetimes: {
    attached: function () {
      console.log("[DEBUG]: load comments component");
      setTimeout(() => {
        this.getComments();
      });
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    item_id: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    comment_id: "",
    item_id: "",
    comments_list: [],  // element: {open_id, new_comment}
    formData: {
      new_comment: ""
    },
    error: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getComments() {
      console.log('[DEbug] 读取comment');
      let that = this;
      let initData = await DB.collection("comments")
        .where({ item_id: that.properties.item_id })
        .get();
      this.setData({
        comment_id: initData.data[0]._id,
        comments_list: initData.data[0].comments_list
      });
    },
    formSubmit(e) {
      // let that = this;
      if (app.globalData.openid) {
        this._comment(e);
      } else {
        this.setData({
          error: "评论功能需要登陆后再使用哦~"
        });
      }
    },
    _comment(e) {
      let that = this;
      if (!e.detail.value || e.detail.value.new_comment === "") {
        // 判断是否为空
        this.setData({
          error: "请填写内容再评论哦～"
        });
        return;
      }
      // 判断是否合法（律）
      wx.cloud.callFunction({
        name: 'msgSecCheck',
        data: {
          msg: e.detail.value.new_comment
        },
        success: res => {
          console.log('[云函数] msgSecCheck ', res);
          if (res.result.errCode !== 0) {
            // 违法内容识别
            this.setData({
              error: "内容可能不符合相关法律规定哦～"
            });
          } else {
            // 合法内容
            console.log('[DEBUG] form发生了submit事件，携带数据为：', e.detail.value);
            this.setData({
              formData: e.detail.value
            });
            console.log('[DEBUG]comment id: ', this.data.comment_id);
            console.log("[DEBUG]user openid is: " + app.globalData.openid);
            this.data.comments_list.push({
              open_id: app.globalData.openid, comment: this.data.formData.new_comment
            });
            DB.collection("comments")
              .doc(that.data.comment_id)
              .update({
                // data 传入需要局部更新的数据
                data: {
                  comments_list: this.data.comments_list
                },
                success: function (res) {
                  console.log(res.data)
                }
              });
            setTimeout(() => {
              // 设置500ms，避免数据库还没更新完，查询到旧数据
              this.getComments();
              console.log("[DEBUG] update comment list")
            }, 500);
            this.setData({
              formData: { new_comment: "" }
            });
          }
        },
        fail: err => {
          console.error('[云函数] [msgSecCheck] 调用失败', err);
          this.setData({
            error: "哎呀，服务器开小差啦～"
          });
        }
      })
    }
  }
})
