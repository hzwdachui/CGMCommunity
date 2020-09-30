// components/item/item.js
const DB = wx.cloud.database()

Component({
  lifetimes: {
    attached: function () {
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
    // ingredients: [{name: "test_name1", category: "test_cat1"}]
    ingredients: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getItem() {
      let that = this;
      // console.log("[DEBUG] that.properties.item_id: ");
      console.log(that.properties);
      console.log("[DEBUG] that.properties.item_id: " + that.properties.item_id)
      const { data: initData } = await DB.collection("items").doc(this.properties.item_id).get();
      console.log('[DEBUG] init query ', initData)
      this.setData({
        item_id: initData.item_id,
        img_src: initData.img_src,
        item_name: initData.item_name,
        ingredients: initData.ingredients
      });
      console.log('[DEBUG] init data ', this.data);
    }
  }
})
