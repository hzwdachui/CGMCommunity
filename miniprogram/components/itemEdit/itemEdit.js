// components/itemEdit/itemEdit.js
const DB = wx.cloud.database()

Component({
  lifetimes: {
    attached: function () {
      console.log("[DEBUG] load itemEdit");

      // this.getItem();
      setTimeout(() => {
        this.getItem();
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
    item_id: "",
    img_src: "",
    item_name: "",
    ingredientsList: []
  },
  // dd8d23355fa7ac4a0056c67b0bd9054c
  /**
   * 组件的方法列表
   */
  methods: {
    async getItem() {
      const { data: initData } = await DB.collection("items").doc(this.properties.item_id).get();
      this.setData({
        item_id: initData._id,
        img_src: initData.img_src,
        item_name: initData.item_name,
        ingredientsList: initData.ingredients
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
        img_src: data.img_src
      });
      console.log("[DEBUG] data: ");
      console.log(this.data);
      // 更新item数据库
      DB.collection("items")
        .doc(this.properties.item_id)
        .update({
          // data 传入需要局部更新的数据
          data: {
            item_name: that.data.item_name,
            img_src: that.data.img_src,
            ingredients: that.data.ingredientsList
          },
          success: function (res) {
            console.log("[DEBUG] 修改:");
            console.log(res);
          }
        });
      // 跳转回 index
      // 关闭当前页面，跳转到应用内的某个页面。
      wx.redirectTo({
        url: '/pages/managementHome/managementHome'
      })
    },
    handleTapAddBtn() {
      console.log("[DEBUG] 添加成分栏目");
      this.data.ingredientsList.push({ name: "" });
      this.setData({
        ingredientsList: this.data.ingredientsList
      });
    },
    handleNameInput: function (e) {
      this.data.ingredientsList[e.currentTarget.dataset.model].name = e.detail.value;
    },
    handleCategoryInput: function (e) {
      this.data.ingredientsList[e.currentTarget.dataset.model].category = e.detail.value;
    },
    handleDelete() {
      DB.collection("items")
        .doc(this.properties.item_id)
        .remove({
          success: function (res) {
            console.log("[DEBUG] 删除:");
            console.log(res);
          }
        });
        wx.redirectTo({
          url: '/pages/managementHome/managementHome'
        });
    }
  }
})
