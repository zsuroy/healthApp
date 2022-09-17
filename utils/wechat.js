/**
 * 微信操作模块 ｜ 签到打卡
 * 适配：魅族17Pro Autojsx
 * 在微信中找元素无法使用Pro，只能使用click；故采用Autojsx编译发布
 * @author @Suroy
 * @date 2022.09.14
 */


var vxModule = {};


// const myPlugs = require("plugins.js"); //导入公共模块库
// const appUtils = require("./AppUtil.js"); //导入模块库

/**
 * 启动微信
 * @param {any} mode  1,仅打开App; 其余打开并回桌面
 */
vxModule.setup = function(mode){
    lang= myPlugs.lang(1) ? app.launch("com.tencent.mm"):app.launchApp("微信");
    //打开微信
    if(!mode)home(); //回桌面打开
    sleep(1500);
}

/**
 * 监测APP是否已经打开
 * @param {bool} backToMain true回退到首页
 * @returns 
 */
vxModule.isOpened = function (backToMain){
    let appName = myPlugs.lang(1) ? "WeChat" : "微信";
    let packageName = "com.tencent.mm";
    let r = myPlugs.isAppOpen(appName, packageName);
    if(!r){
        appUtils.stopApp(appName, packageName); // 终止微信以确保能够正常获取
        console.log("<WeChat> retry");
        this.setup(true);
        sleep(1000);
        
        gesture(500, [device.width/2+30, device.height/2], [device.width/2, device.height/3]); // 滑动一下
        r = myPlugs.isAppOpen(appName,packageName);
        if(!r) {//try
            console.log("<WeChat> open failure");
            return false;
        }
    }

    //循环回退到主页
    if(backToMain == true)
    {
        while(!(text("通讯录").findOne(2000)||text("Contacts").findOne(2000)) && this.isOpened(false)) {
            console.log("[app] back");
            back();
            sleep(400);
        }
    }

    return true;
}

/**
 * 切换全屏
 */
vxModule.full = function(appName){
    appName = myPlugs.isEmpty(appName) ? appName:"微信";
    screenToFull(1); //魅族全屏
    console.info("[init] 请于5秒内调整<" + appName + ">至全屏");
    sleep(4000);
}

/**
 * 直接运行主程序
 * @param {int} mode 等待模式(1阻塞:超时模式，0强阻塞:一直等待元素出现)
 * @param {int} fill 填表选项(1启用)
 * @note 此处采用模块导出的方式以便于外部调用
 * @return bool
 */
vxModule.run = function(mode, fill){
    fill = myPlugs.isEmpty(fill) ? fill : myPlugs.bin("autoFiller"); // 默认填表选项

    // 监测APP是否已经打开
    if(!this.isOpened(true)){
        toastLog("<WeChat> open error.");
        return false;
    }

    console.info("[run]...");
    toast("Running");
    myPlugs.events("WeChat","tips"); // 更新提示事件
    myPlugs.clickMe("通讯录","Contacts",3);
    sleep(1000);
    myPlugs.clickMe("搜索","Search",2);
    sleep(1000);
    setText("wycs-1955");
    sleep(500);
    myPlugs.clickByText_Coord("成都师范学院");
    sleep(200);
    myPlugs.clickByText_Coord("校园助手");
    sleep(100);
    //容错处理
    if(!textContains("疫情防控平台").findOne(2000) && textContains("考生号").findOne(2000)){
        back();
        console.log("[log] clickAutoFix");
        sleep(100);
        myPlugs.clickByText_Coord("校园助手");
        sleep(100);
    }

    myPlugs.clickm("疫情防控平台",3);
    sleep(300);
    myPlugs.clickByText_Coord("学生健康情况填报",10,2);
    if(text("当前采集日期已登记！").findOne(3000)){
        console.error("[log] 今日已签到");
    }
    else{ //阻塞加载判断
        if(className("android.view.View").text("学历：").findOne(5000) || className("android.view.View").text("学校").findOne(5000)){
            vxModule.fillForm(fill); // 仅等待最多5+5 = 10秒
        }
        else if(!mode && (className("android.view.View").text("学历：").waitFor() || className("android.view.View").text("学校").waitFor())){
            vxModule.fillForm(fill);// 直接提交按钮 | 一直等待直到内容加载完毕
        }
        else {
            console.error("[log] 提交失败!");
            return false;
        }
    }
    console.info("[end] 填报结束!");
    return true;
    //console.error(clickByText_Coord("返校申请",10,2));
    //className("android.view.View").text("批次已经结束，不能申请返校！").findOne()
};

//填表
vxModule.fillForm = function(mode){
    if(mode){ //填表直接提交
        className("android.widget.RadioButton").text("正常").findOne(2000).click();
        className("android.widget.RadioButton").text("完成第1、2、3针接种").findOne(2000).click();
        className("android.widget.RadioButton").text("未前往").findOne(2000).click();
        className("android.widget.RadioButton").text("未接触").findOne(2000).click();
        className("android.widget.RadioButton").text("四川省内").findOne(2000).click();
    }
    let vCheckBox = className("android.widget.CheckBox").textContains("我已阅读承诺书")
    vCheckBox.click();
    click(533,2284);//提交按钮
}

//调试开发
vxModule.debug = function()
{
    myPlugs.window();
    myPlugs.window(1);
    vxModule.setup(0);
    vxModule.full();
    vxModule.run(1);
}


// 适配魅族小窗应用滑动到全屏(wx)
function screenToFull(mode)
{
    console.log("[log] device:", device.brand);
    if(device.brand=="meizu"){
        // alert(666);
        console.log("[device]", currentPackage());
        if(mode==1)return myPlugs.meizuFull();
        // press(536,2065,500); //滑动全屏应用
        // gesture(800,[536,2065],[593,2293]);
        return true;
    }
    console.log("[log] no need");
    return false;
}


//导出模块以便于外部调用
module.exports = vxModule;