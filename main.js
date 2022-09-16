"ui";

/*
 * @aurhor Suroy
 * email: Suroy@qq.com
 * 机型: 魅族17Pro(1080, 2340) 华为v10(1080*2160)
 * 版本: Pro 9.2.3  Pro 8.8.22-0 AutoJsx 6.2
 */
importClass(android.graphics.Color);
importClass(android.content.res.ColorStateList);
activity.setTheme(com.google.android.material.R$style.Theme_MaterialComponents_DayNight_DarkActionBar);

const vxPlug = require("./utils/wechat.js");//导入微信处理模块
const httpPlug = require("./utils/httpcan.js");//导入httpCanary处理模块
const myPlugs = require("./utils/plugins.js"); //导入公共模块库
const limit = require("./utils/limit.js");

setScreenMetrics(1080, 2340); //适配分辨率
device.keepScreenDim();
auto.setFlags(["findOnUiThread"]); // 主线程搜索控件 | useUsageStats

//基础信息配置
myPlugs.bin("id", 2); //默认用户ID
myPlugs.bin("shot_enabled", 0); //默认截屏权限
myPlugs.bin("autoFiller", false); // 微信自动填表开关
myPlugs.bin("cloudAid", false); // 云辅助
myPlugs.lang(); //默认语言
limit(); // 去除限制


ui.statusBarColor("#000000")
ui.layout(
    <frame>
        <vertical>
            <horizontal bg="#6699CC" h="auto" gravity="center" >
                <text margin="5" text="健康打卡小助手"   textColor="#FFFFFFFF" textSize="16sp"  textStyle="bold" layout_weight="1"/>
                <img  margin="5" id="Aboutapp" w="28" h="28" src="@drawable/ic_help_outline_black_48dp" tint="#FFFFFFFF" foreground="?android:attr/selectableItemBackgroundBorderless" />
                <img  margin="5" id="MenuButton" w="28" h="28" src="@drawable/ic_menu_black_48dp" tint="#FFFFFFFF" foreground="?android:attr/selectableItemBackgroundBorderless" />
            </horizontal>
            
            <vertical gravity="center" h="*" w="*" >
                <text gravity="center" text="生活原本沉闷，跟你一起奔跑就会有风。" />
            </vertical>
            
        </vertical>
        <androidx.coordinatorlayout.widget.CoordinatorLayout id="CoordinatorLayout" layout_width="match_parent" orientation="vertical"  >
            <com.google.android.material.floatingactionbutton.FloatingActionButton  layout_width="wrap_content"   backgroundTint="#000000" tint="#FFFFFFFF" id="btn_report" layout_height="wrap_content" src="@drawable/ic_play_arrow_black_48dp"  />
            <com.google.android.material.bottomappbar.BottomAppBar id="bottomAppBar"  backgroundTint="#FF8C9099" layout_width="match_parent" layout_height="40dp" layout_gravity="bottom" paddingStart="0dp" paddingEnd="0dp"  />
        </androidx.coordinatorlayout.widget.CoordinatorLayout>
    </frame>
)


ui.MenuButton.on("click", function() {
    try {
        let mBtnPop = ui.MenuButton
        Popup = new android.widget.PopupWindow(view, 500, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
        Popup.setOutsideTouchable(true);
        Popup.setFocusable(true);
        Popup.showAsDropDown(mBtnPop, 300, 30)
    } catch (error) {}
});

var view = ui.inflate(
    <vertical >
        <card margin="3 1" cardElevation="0" cardCornerRadius="10" cardBackgroundColor="#FF8C9099" alpha="1" >
            <card margin="1 1" w="*" cardElevation="0" cardCornerRadius="10" cardBackgroundColor="#FF8C9099">
                <vertical  margin="5 10 5 10">
                    <horizontal padding="10 4">
                        <vertical  layout_weight="1" >
                            <text text="无障碍" textColor="#ffffff"  textStyle="bold" textSize="10"/>
                            <text text="提供自动操作(点击,长按,滑动等)" textColor="#ffffff" textSize="6" marginTop="2" />
                        </vertical>
                        <Switch id="switch_acc" scaleY="0.8" scaleX="0.8"  checked="false"  marginRight="-8" />
                    </horizontal>
                    
                    <horizontal padding="10 4">
                        <vertical  layout_weight="1" >
                            <text text="悬浮球" textColor="#ffffff" textSize="10" textStyle="bold" />
                            <text text="增加脚本后台运行时的存活率" textColor="#ffffff" textSize="6" marginTop="2" />
                        </vertical>
                        <Switch id="switch_ball" scaleY="0.8" scaleX="0.8"  checked="false" marginRight="-8"  />
                    </horizontal>
                    
                    <horizontal padding="10 4">
                        <vertical  layout_weight="1" >
                            <text text="控制台" textColor="#ffffff" textSize="9" textStyle="bold" />
                            <text text="调试输出，悬浮窗显示日志" textColor="#ffffff" textSize="6" marginTop="2" />
                        </vertical>
                        <Switch id="screenCapturePermission" scaleY="0.8" scaleX="0.8" checked="false" marginRight="-8" />
                    </horizontal>
                    
                    <horizontal padding="10 4">
                        <vertical  layout_weight="1" >
                            <text text="截屏权限" textColor="#ffffff" textSize="9" textStyle="bold" />
                            <text text="保证图像识别服务正常使用(切换全屏)" textColor="#ffffff" textSize="6" marginTop="2" />
                        </vertical>
                        <Switch id="switch_screen" scaleY="0.8" scaleX="0.8" checked="false"  marginRight="-8"/>
                    </horizontal>

                    <horizontal padding="10 4">
                        <vertical  layout_weight="1" >
                            <text text="前台服务" textColor="#ffffff" textSize="9" textStyle="bold" />
                            <text text="保证脚本不被杀掉(前台服务)" textColor="#ffffff" textSize="6" marginTop="2" />
                        </vertical>
                        <Switch id="foregroundService" scaleY="0.8" scaleX="0.8" checked="true"  marginRight="-8"/>
                    </horizontal>

                    <horizontal padding="10 4">
                        <vertical layout_weight="1" >
                            <text text="自动提交" textColor="#ffffff" textSize="9" textStyle="bold" />
                            <text text="启用后自动填表并提交签到" textColor="#ffffff" textSize="6" marginTop="2" />
                        </vertical>
                        <Switch id="switch_autoFill" scaleY="0.8" scaleX="0.8" checked="true"  marginRight="-8"/>
                    </horizontal>

                    <horizontal padding="10 4">
                        <vertical layout_weight="1" >
                            <text text="托管辅助" textColor="#ffffff" textSize="9" textStyle="bold" />
                            <text text="更新云平台Cookie信息" textColor="#ffffff" textSize="6" marginTop="2" />
                        </vertical>
                        <Switch id="switch_cloudAid" scaleY="0.8" scaleX="0.8" checked="false"  marginRight="-8"/>
                    </horizontal>

                    <horizontal padding="10 4">
                        <vertical id="idSetting" layout_weight="1" >
                            <text text="设置账户" textColor="#ffffff" textSize="9" textStyle="bold" />
                            <text text="仅需要设置ID号(托管辅助开启生效)" textColor="#ffffff" textSize="6" marginTop="2" />
                        </vertical>
                        <img  w="18" h="18" layout_gravity="right|center" src="@drawable/ic_account_circle_black_48dp" tint="#ffffff" marginLeft="-4" />
                    </horizontal>

                    <horizontal padding="10 4">
                        <vertical id="myhome"  layout_weight="1" >
                            <text text="官方主页" textColor="#ffffff" textSize="9" textStyle="bold" />
                            <text text="关注更多动态,请浏览博客" textColor="#ffffff" textSize="6" marginTop="2" />
                        </vertical>
                        <img  w="18" h="18" layout_gravity="right|center" src="@drawable/ic_home_black_48dp" tint="#ffffff" marginLeft="-4" />
                    </horizontal>

                    <horizontal padding="10 4">
                        <vertical id="Jointhisgroup"  layout_weight="1" >
                            <text text="添加好友" textColor="#ffffff" textSize="9" textStyle="bold" />
                            <text text="关注更多动态,请浏览频道" textColor="#ffffff" textSize="6" marginTop="2" />
                        </vertical>
                        <img  w="18" h="18" layout_gravity="right|center" src="@drawable/ic_keyboard_arrow_right_black_48dp" tint="#ffffff" marginLeft="-4" />
                    </horizontal>
                </vertical>
            </card>
        </card>
    </vertical>
)

var Things = [
    view.foregroundService, view.screenCapturePermission, view.switch_acc, view.switch_ball, view.switch_screen
]

for (var i = 0; i < Things.length; i++) {
    Things[i].getTrackDrawable().setTint(Color.parseColor("#ffffff"));
    Things[i].getThumbDrawable().setTint(Color.parseColor("#ffffff"));
}

view.foregroundService.on("check", function(checked) {
    $settings.setEnabled("foreground_service", checked);
});

view.screenCapturePermission.on("check", function(checked) {
    threads.start(function() {
        if (checked) {
            console.show()
        } else {
            console.hide()
        }
    });
});
view.switch_acc.setChecked(auto.service !== null)
view.switch_ball.setChecked((new android.provider.Settings).canDrawOverlays(context))
view.switch_acc.on("check", (isChecked) => {
    if (isChecked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
        toast("请开启《" + app.getAppName(context.packageName) + "》的无障碍服务")
    }
    if (!isChecked && auto.service != null) {
        toast("关闭无障碍服务");
        auto.service.disableSelf();
    }
})

view.switch_ball.on("check", (isChecked) => {
    if (isChecked && !(new android.provider.Settings).canDrawOverlays(context)) {
        importClass(android.content.Intent);
        importClass(android.net.Uri);
        importClass(android.provider.Settings);
        var intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + context.getPackageName()));
        app.startActivity(intent);
    }
    if (isChecked && (new android.provider.Settings).canDrawOverlays(context)) {}
})

view.switch_screen.on("check", (isChecked) => {
    if (isChecked){
        try {
            auto();
            requestScreenCaptureAsync();
        } catch (error) {
            toastLog("[log] Screen enabled.");    
        }
    }
})

view.switch_autoFill.on("check", (isChecked) => {
    myPlugs.bin("autoFiller", isChecked);
    toastLog("[init] worker", isChecked);
})

view.switch_cloudAid.on("check", (isChecked) => {
    myPlugs.bin("cloudAid", isChecked);
    toastLog("[init] cloudAid", isChecked);
})


view.idSetting.on("click", () => {
    try {
        $dialogs.setDefaultDialogType("foreground-or-overlay");
    } catch (error) {}
    try {
        dialogs.input("请输入您的ID号","1")
        .then(text => {
            myPlugs.bin("id", parseInt(text));
            toastLog("[ID] " + myPlugs.bin("id"));
        });
    } catch (error) {
        toastLog("dialog error");
    }
})

view.Jointhisgroup.on("click", () => {
    app.startActivity({
        action: "android.intent.action.VIEW",
        data: "mqqapi://card/show_pslcard?card_type=group&uin=955978561",
        packageName: "com.tencent.mobileqq",
    })
})

view.myhome.on("click", () => {
    app.openUrl("https://suroy.cn");
})

ui.Aboutapp.on("click", () => {
    try {
        $dialogs.setDefaultDialogType("foreground-or-overlay");
    } catch (error) {}
    dialogs.build({
        title: "关于",
        content: "健康打卡疫情填报小助手\n版本号:"+app.versionName+"\n作者：@Suroy(https://suroy.cn)",
        positive: "确定",
        titleColor: "#000000",
        positiveColor: "#000000",
    }).on("negative", function() {}).show();
})


ui.btn_report.getLayoutParams().setAnchorId(ui.bottomAppBar.getId());
ui.bottomAppBar.setFabCradleMargin(15);
ui.bottomAppBar.setFabCradleRoundedCornerRadius(50);
ui.bottomAppBar.setHideOnScroll(false)
ui.btn_report.on("click", (c) => {
    device.vibrate(20);
    let getIcon = ui.btn_report.attr("src");
    let itemColor = [
        ["#000000", "#FFFFFFFF"],
        ["#FF6666", "#FFFFFFFF"]
    ]
    let itemIcon = ["@drawable/ic_play_arrow_black_48dp", "@drawable/ic_stop_black_48dp"];
    let setIcon = itemIcon[getIcon == itemIcon[0] ? 1 : 0];
    ui.btn_report.attr("src", setIcon);
    ui.btn_report.attr("backgroundTint", itemColor[getIcon == itemIcon[0] ? 1 : 0][0]);
    ui.btn_report.attr("tint", itemColor[getIcon == itemIcon[0] ? 1 : 0][1]);
    if (getIcon == itemIcon[0] ? 1 : 0) {
        isRun = threads.start(function() {
            //主线程()
            console.log("[home]", currentPackage());
            worker();
        })
    } else {
        if (isRun) {
            toastLog("停止运行")
            isRun.interrupt()
            console.hide()
            floaty.closeAll()
            threads.shutDownAll();
            try {//Pro 8.5+
                $ui.imageCache.clearDiskCache();
                $ui.imageCache.clearMemory();
            } catch (error) { };
        }
    }
})



/**
 * 消息提示框
 * @param {string} str 
 * @param {string} mtitle 
 * @param {mode} 0时直接alert 
 */
function showMsg(str, mtitle, mode)
{
    if(!mode){
        mtitle=myPlugs.isEmpty(mtitle) ? "提示":mtitle;
        alert(str);
        return true;
    }

    try {
        $dialogs.setDefaultDialogType("foreground-or-overlay");
    } catch (error) {}
    dialogs.build({
        title: mtitle,
        content: str,
        positive: "确定",
        titleColor: "#000000",
        positiveColor: "#000000",
    }).on("positive", function() {}).show();
}

function getclip() {
    //安卓10利用焦点获取剪切板
    let w = floaty.window(
        <vertical visibility="invisible">
            <button id="readClipboard" text="Cliper" w="auto" />
        </vertical>
    );
    ui.run(function () {
        w.requestFocus();
        setTimeout(() => {
            let content = getClip();
            // toastLog(content);
            if(content){
                console.log("[cookie]",content);
                myPlugs.bin("cookie", content); // 写入
                w.readClipboard.attr("text", "OK");
                w.close();
                return content;
            }
            w.disableFocus();
        }, 500);
    });
}



/** 
* 主任务
*
*/
function worker(){

    myPlugs.banner(1); //唤醒悬浮窗

    if(!myPlugs.bin("cloudAid")){
        // 微信打卡填表提交 | 不需要辅助云端更新cookie
        vxWorker();
    }
    else{
        cloudAidWorker();
    }
    
    //返回APP
    app.startActivity("settings");
    back();
    sleep(100);
    if(!textContains("小助手").findOne(1000))back();
    console.info("<Suroy> thanks for your trying.");
    return true;
}


/**
* 微信任务
*/
function vxWorker() {
    console.info("<WeChat>");
    myPlugs.window();
    sleep(100);
    myPlugs.window(2); //hide
    vxPlug.setup(1);
    vxPlug.full();
    let mStatus = vxPlug.run(1, myPlugs.bin("autoFiller"));
    msg = mStatus ? "任务结束，请核实是否填报成功。":"任务失败，可以再次尝试签到填报。";
    showMsg(msg);
}

/**
 * 云辅助一体化工具
 */
function cloudAidWorker() {
    console.info("<PackTools>");
    httpPlug.setup(1);
    //切换到微信签到
    vxWorker();
    home();

    //重新打开抓包工具
    httpPlug.setup(2);  
    sleep(500);
    statusCookie = httpPlug.run(); //分析获取cookie
    if(statusCookie){
        var cooks = getclip();
        sleep(1000);
        console.info("[Get]", cooks);
        while(!myPlugs.bin("cookie")); //等待获取剪贴板

        //提交更新
        let m = threads.start(function(){
            var s = myPlugs.submits(myPlugs.bin("cookie"), myPlugs.bin("id"));
            console.log("[Thread]", s);
            m.interrupt();
        });

    } else console.error("[cookie] Get failure");
    httpPlug.closeApp(); // 关闭
    // myPlugs.window(1); //show ｜ 此处直接显示会卡机
    console.info("[end]...");
}

