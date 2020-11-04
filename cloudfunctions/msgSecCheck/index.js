// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  if (!event.msg) {
    // more robust
    event.msg = "";
  }
  try {
    const result = await cloud.openapi.security.msgSecCheck({
      content: event.msg
    });
    return result;
  } catch (err) {
    return err;
  }

}