// components/itemList.js

// get items from database
const DB = wx.cloud.database();

Component({
  // 组件生命周期
  lifetimes: {
    // created: function () {
    //   // 在组件实例进入页面节点树时执行
    //   console.log("[DEBUG] created");
    // },
    attached: function () {
      this.getItemList();
      console.log("[DEBUG]")
      console.log(this);
      console.log(this.data.itemList); // why it's empty???
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    itemList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getItemList() {
      const { data: initList } = await DB.collection("items").get();
      console.log('[DEBUG] init query item list', initList)
      this.setData({
        itemList: initList
      });
    }
  }

})
