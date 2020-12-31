// components/item/item.js
const DB = wx.cloud.database()

Component({
  lifetimes: {
    attached: function () {
      // 此时还没读取properties
      console.log("[DEBUG] load item");
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
    ingredients: []
  },

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
        ingredients: initData.ingredients,
        admin_comment: initData.admin_comment
      });
    }
  }
})
