/*
 * @Author: Suroy
 * @Date:
 * @Last Modified by: Suroy
 * @Last Modified time:
 * @Description: 操作App的工具类
 */
importClass(android.location.LocationManager);
importClass(android.content.Context);
  var AutojsUtil = require("./AutoJsUtil.js");
  var AppUtil = {};
  AppUtil.stopApp = function(appName, pageName) {
      if(pageName=="undefined")pageName = getPackageName(appName);
      openAppSetting(pageName);
      sleep(1000)
      if (text("强制停止").exists()) {
          AutojsUtil.clickCoordinate(text("强制停止").findOne(2000));
      } else if (text("FORCE STOP").exists()) {
          AutojsUtil.clickCoordinate(text("FORCE STOP").findOne(2000));
      } else if (text("关闭应用").exists()) {
          AutojsUtil.clickCoordinate(text("关闭应用").findOne(2000));
      } else if (text("结束运行").exists()) {
          AutojsUtil.clickCoordinate(text("结束运行").findOne(2000));
      } else {
          var isnofind = ",未找到应用'" + appName + "'";
          toastLog("关闭应用失败" + (pageName == null ? isnofind : ""));
      }
      //点击确定关闭/停止应用   按钮
      if (text("确定").exists()) {
          text("确定").findOne(1000).click();
      } else if (text("OK").exists()) {
          text("OK").findOne(1000).click();
      } else {}
  }
  module.exports = AppUtil;