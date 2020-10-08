// components/management/management.js
const DB = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    item_name: "",
    img_src: "",
    ingredients_list: [],
    item_id: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTapAddBtn() {
      console.log("[DEBUG] 添加成分栏目");
      this.data.ingredients_list.push({ name: "" });
      this.setData({
        ingredients_list: this.data.ingredients_list
      });
    },
    formSubmit(e) {
      let that = this;
      console.log("[DEBUG]: submit form");
      console.log(e.detail.value);
      let data = e.detail.value;
      // 表单成分数据转化为列表
      this.setData({
        item_name: data.item_name,
        img_src: data.img_src,
        ingredients_list: this.data.ingredients_list
      });
      console.log("[DEBUG] data: ");
      console.log(this.data);
      // 存item数据库
      DB.collection("items")
        .add({
          // data 传入需要局部更新的数据
          data: {
            item_name: that.data.item_name,
            img_src: that.data.img_src,
            ingredients: that.data.ingredients_list
          },
          success: function (res) {
            console.log("[DEBUG] res:");
            console.log(res);
            // 添加该item的comments到数据库
            DB.collection("comments")
              .add({
                data: {
                  comments_list: [],
                  item_id: res._id
                }
              })
          }
        });
      // 跳转回 index
      // 关闭当前页面，跳转到应用内的某个页面。
      wx.redirectTo({
        url: '/pages/index/index'
      })
    },
    handleNameInput: function (e) {
      this.data.ingredients_list[e.currentTarget.dataset.model].name = e.detail.value;
    },
    handleCategoryInput: function (e) {
      this.data.ingredients_list[e.currentTarget.dataset.model].category = e.detail.value;
    }
  }
})
