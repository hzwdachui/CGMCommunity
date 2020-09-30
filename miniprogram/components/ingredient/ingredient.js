// components/ingredient/ingredient.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getIngredientList() {
      let that = this;
      // console.log("[DEBUG] that.properties.item_id: ");
      console.log(that.properties);
      console.log("[DEBUG] that.properties.item_id: " + that.properties.item_id)
      const { data: initData } = await DB.collection("items").doc(this.properties.item_id).get();
      console.log('[DEBUG] init query ', initData)
      this.setData({
        item_id: initData.item_id,
        img_src: initData.img_src,
        item_name: initData.item_name
      });
    }
  }
})
