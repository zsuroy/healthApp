/**
 * httpCanary 操作模块 ｜ 签到打卡
 * 适配：魅族17Pro Autojsx
 * 在微信中找元素无法使用Pro，只能使用click；故采用Autojsx编译发布
 * @author @Suroy
 * @date 2022.09.14
 */

// const myPlugs = require("./plugins.js"); //导入公共模块库
// const appUtils = require("./AppUtil.js"); //导入模块库

var httpModule = {};

/**
 * 启动HttpCanary
 * @param {any} mode false则回桌面
 */
 httpModule.setup = function(mode){
    //打开
    // let act="com.guoshi.httpcanary";
    let act="com.guoshi.httpcanary.premium";
    app.launch(act);
    sleep(1500);
    if(mode==1){
        httpModule.full();
        if(this.isOpened(true))id("arg").className("android.widget.ImageButton").findOne(2000).click(); //start
    }
    else if(mode==2) console.log("<HttpCanary> reopen");
    else home(); //回桌面打开
    sleep(300);
}

/**
 * 适配魅族小窗应用滑动到全屏(wx)
 */
 httpModule.full = function(appName){
    appName = myPlugs.isEmpty(appName) ? appName:"HttpCanary";
    if(device.brand=="meizu")
    {
        myPlugs.meizuFull();
        console.info("[init] 请于3秒内调整<" + appName + ">至全屏");
        sleep(3000);
    }
}


/**
 * 检测是否打开应用
 * @param {bool} mode  | ture, 返回状态; false, 允许重新打开一次
 * @returns 
 */
httpModule.isOpened = function (mode){
    // 监测APP是否已经打开
    let appName = "HttpCanary";
    let packageName = "com.guoshi.httpcanary.premium";
    let r = myPlugs.isAppOpen(appName, packageName);
    if(mode == true) {
        return r; // 直接返回打开状态
    }

    // 重试一次
    if(!r){
        console.log("<"+appName+"> retry");
        httpModule.setup(1);
        sleep(1000);
        r = myPlugs.isAppOpen(appName,packageName);
        console.log("[debug]", r);
        if(!r) {//try
            console.log("<"+appName+"> open failure");
            return false;
        }
    }
    return true;
}

/**
 * 直接运行主程序
 * @param {int} mode 
 * @note 此处采用模块导出的方式以便于外部调用
 * @return bool
 */
httpModule.run = function(mode){
    myPlugs.events("HTTP","tips"); // 更新提示事件

    if(!this.isOpened(false))myPlugs.showMsg("云辅助更新执行失败，建议重试。","任务失败");
    try {
        
        //点击更多选项
        r = myPlugs.lang(1) ? "More options" : "更多选项";
        r = className("android.widget.ImageView").desc(r).findOne(2000);
        if(r)r.click(); // 更多选项
        sleep(500);

        // s_obj = className("android.widget.TextView").text("过滤").findOne(2000);
        // s_obj.parent().click();
        if(!myPlugs.clickMe("过滤","Filter",3,2))click(725,172);
        sleep(300);
        
        s_obj = className("android.widget.TextView").text("xg.cdnu.edu.cn").findOne(2000);
        if(!s_obj){
            // s_obj = className("android.widget.TextView").text("服务器Host").findOne(2000);
            // s_obj.parent().click();
            if(!myPlugs.clickMe("服务器Host","Server Host",3,2))click(377,1068);
            sleep(300);
            s_obj = className("android.widget.TextView").text("xg.cdnu.edu.cn").findOne(2000);
            s_obj.parent().click();
            back();
            sleep(200);
        }
        back();
        sleep(300)

        myPlugs.window(2); // 最小化控制台


        //选包 xg.cdnu.edu.cn/SPCP/Web/Report/Index
        // s_obj = className("android.widget.TextView").textContains("/SPCP/Web/Report/Index").findOne(2000);
        // s_obj.parent().parent().click();
        myPlugs.clickm("/SPCP/Web/Report/Index", 4);
        sleep(500);
        console.log("<Cookie>")

        //复制cookie
        let status = false;
        s_obj = className("android.widget.TextView").text("Cookie").findOne(2000);
        if(!s_obj){
            myPlugs.clickm("/SPCP/Web/", 4); //模糊匹配，任意该路径下均有cookie信息 ｜ 打开该条内容
            sleep(500);
            console.log("<Cookie> retry")
        }

        //复制cookie
        s_obj = className("android.widget.TextView").text("Cookie").findOne(2000);
        if(s_obj){
            s_obj.parent().longClick(); //长按复制
            status = true;
        }
        // press(s_obj.bounds().centerX(), s_obj.bounds().centerY(), 1000);
        sleep(500);
        return status;
    } catch (error) {
        console.error("[error] CloudAid failure");
    }
}

httpModule.closeApp = function(mode){
    if(mode == false)
    {
        back();
        id("arg").className("android.widget.ImageButton").findOne(2000).click(); //stop
        sleep(500);
        console.log("[log] exitApp")
        back();
        sleep(200);
        back();
    } else appUtils.stopApp("HttpCanary", "com.guoshi.httpcanary.premium");
    return true;

}

//调试开发
httpModule.debug = function() {
    // myPlugs.window();
    httpModule.setup(0);
    httpModule.full();
    httpModule.run(1);
}

//抓包设置
httpModule.setting = function(mode){
    let addAutoSet=false; //自动添加微信抓包设置    
    //添加微信到抓包应用
    if(addAutoSet){
        console.log("添加微信抓包应用");
        className("android.widget.ImageButton").desc("Open navigation drawer").findOne().click()
        id("arg").className("android.view.View").findOne().click();
        className("android.widget.TextView").desc("Add").findOne().click();
    }
}

//导出模块以便于外部调用
module.exports = httpModule;