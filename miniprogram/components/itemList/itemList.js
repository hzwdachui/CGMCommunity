// components/itemList.js

// get items from database
const DB = wx.cloud.database();
const MAX_LIMIT = 10;

Component({
  // 组件生命周期
  lifetimes: {
    attached: function () {
      setTimeout(() => {
        this.getItemListV2(this.data.page);
      });
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
    showItemList: [],  // 为了排序作准备
    page: 0,
    end: false,  // 是否取到全部数据
    query: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getItemListV2(page, query="") {
      console.log("[DEBUG] page: " + page);
      // 分页
      const { data: initList } = await DB.collection('items')
      .skip(page * MAX_LIMIT)
      .where({
        'item_name': DB.RegExp({
          regexp: '.*' + query,
          options: 'i',
        })
      })
      .limit(MAX_LIMIT)
      .get();
      this.setData({
        itemList: this.data.itemList.concat(initList),
        showItemList: this.data.itemList.concat(initList),
        page: this.data.page + 1
      });
      if (initList.length === 0) {
        this.data.end = true;
      }
    },
    search(value) {
      return new Promise((resolve, reject) => {
        this.setData({
          itemList: [],
          showItemList: [],
          query: value,
          end: false,
          page: 0
        });
        this.nextPage();
      })
    },
    nextPage(){
      if (!this.data.end) {
        // this.setData({
        //   page: this.data.page + 1
        // });
        console.log(this.data.query);
        this.getItemListV2(this.data.page, this.data.query);
      }
    },
    async getItemList() {
      // 先暂时做成获取全部数据，以后再做分页

      // 计算需分几次取
      const countResult = await DB.collection('items').count();
      const total = countResult.total;
      const batchTimes = Math.ceil(total / MAX_LIMIT);
      for (let i = 0; i < batchTimes; i++) {
        const { data: initList } = await DB.collection('items').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
        this.setData({
          itemList: this.data.itemList.concat(initList),
          showItemList: this.data.itemList.concat(initList)
        });
      };
    },
    // search(value) {
    //   // 输入过程不断调用此函数得到新的搜索结果，参数是输入框的值value，返回Promise实例
    //   return new Promise((resolve, reject) => {
    //     this.setData({
    //       showItemList: this.data.itemList.filter((element) => {
    //         return element.item_name.indexOf(value) !== -1;
    //       })
    //     });
    //   })
    // },
    clearHandler() {
      // 清空搜索栏
      this.search("");
    }
  }
})
