// components/comments/comments.js

const app = getApp();
// get items from database
const DB = wx.cloud.database();

Component({
  lifetimes: {
    attached: function () {
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
      let that = this;
      console.log(that.properties);
      console.log("[DEBUG] commnets that.properties.item_id: " + that.properties.item_id);
      let initData = await DB.collection("comments")
        .where({ item_id: that.properties.item_id })
        .get();
      console.log('[DEBUG] comments init query ', initData)
      this.setData({
        comment_id: initData.data[0]._id,
        comments_list: initData.data[0].comments_list
      });
      console.log('[DEBUG] comments init data ', this.data);
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
      console.log('form发生了submit事件，携带数据为：', e.detail.value);
      this.setData({
        formData: e.detail.value
      });
      console.log('[DEBUG]绑定数据 new_comment:', this.data.formData.new_comment);
      console.log('[DEBUG]comment id: ', this.data.comment_id);
      console.log("[DEBUG]: user openid is: " + app.globalData.openid);
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
  }
})
