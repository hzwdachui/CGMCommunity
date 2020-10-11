// components/itemList.js

// get items from database
const DB = wx.cloud.database();
const MAX_LIMIT = 10;

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
      console.log(this.data.itemList); // why it's empty???; 异步的 还没加载出来
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
      // 先暂时做成获取全部数据，以后再做分页

      // 计算需分几次取
      const countResult = await DB.collection('items').count();
      const total = countResult.total;
      const batchTimes = Math.ceil(total / MAX_LIMIT);

      for (let i = 0; i < batchTimes; i++) {
        const { data: initList } = await DB.collection('items').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
        console.log('[DEBUG] init query item list', initList);
        this.setData({
          itemList: this.data.itemList.concat(initList),
          showItemList: this.data.itemList.sort(function(a, b) {
            var nameA = a.item_name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.item_name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            } 
          // names must be equal
            return 0;
          })
        });
      };
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
    clearHandler() {
      // 清空搜索栏
      this.search("");
    },
    /**
* 页面相关事件处理函数--监听用户下拉动作
*/
    onPullDownRefresh: function () {
      console.log("[DEBUG] loading more data");
    },
  }
})
