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
      console.log(this.data.itemList); // why it's empty???;
      this.setData({
        search: this.search.bind(this)
      });
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
    itemList: [],
    showItemList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getItemList() {
      const { data: initList } = await DB.collection("items").get();
      console.log('[DEBUG] init query item list', initList)
      this.setData({
        itemList: initList,
        showItemList: initList
      });
    },
    search(value) {
      // 输入过程不断调用此函数得到新的搜索结果，参数是输入框的值value，返回Promise实例
      return new Promise((resolve, reject) => {
        this.setData({
          showItemList: this.data.itemList.filter((element) => {
            return element.item_name.indexOf(value) !== -1;
          })
        });
      })
    },
    clearHandler(){
      this.search("");
    }
  }
})
