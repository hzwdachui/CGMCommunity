// components/management/management.js
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
    formData: {},
    ingredients_list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTapAddBtn() {
      console.log("[DEBUG] 添加成分栏目");
      this.data.ingredients_list.push({});
      this.setData({
        ingredients_list: this.data.ingredients_list
      });
    },
    formSubmit(e) {
      console.log("[DEBUG]: submit form");
      console.log(e.detail.value);
    }
  }
})
