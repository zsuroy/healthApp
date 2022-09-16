/**
 * 通用模块集合
 */

var myPlug = {}

/**
 * 存取变量池
 * @param {string} key 
 * @param {any} val 
 * @param {string} bin 
 * @returns 
 */
myPlug.bin = function(key, val, bin)
{
    bin = myPlug.isEmpty(bin)? bin:"Suroy_HealthApp";
    key = myPlug.isEmpty(key)? key:"author";
    let storage = storages.create("Suroy_HealthApp");
    if(!myPlug.isEmpty(val))
    {
        // 读取
        return storage.get(key, 0);
    }
    else{ // 写入
        return storage.put(key, val);
    }
}

/**
 * 设置截图权限
 * 防止二次调用时，Autojsx报错
 */
 myPlug.setScreenCapPer = function () {
     //基础信息配置
     let storage = storages.create("Suroy_HealthApp");
     if(!storage.get("shot_enabled")){
         try {
             auto();
             requestScreenCapture();
             storage.put("shot_enabled",1);//设置截图权限标记
             return true;
         } catch (error) {};
     }
     console.log("[log] Capture enabled");
     return false;
 }
 

 /**
  * 检测英文语言设置
  * @param {string} mode 1读
  * @returns bool
  */
 myPlug.lang = function(mode) {
    if(mode==1)return myPlug.bin("lang_en"); // 读语言设置

    var name = getAppName("com.tencent.mm"); //返回wx应用名
    var reg=/^[\u4E00-\u9FA5]+$/;
    if (!reg.test(name)){
        // alert( "不全是中文" );
        lang_en = true ;
    }else{
        // alert( "全是中文" );
        lang_en =  false ;
    }
    myPlug.bin("lang_en", lang_en);
    console.info("[init] Language",lang_en?"En":"Zh");
    return lang_en;
}


 /**
  * 找图位置
  * @param {string} fname 图片文件名
  * @returns position [loc.x, loc.y]
  */
myPlug.findImg = function (fname)
 {
     myPlug.setScreenCapPer();
     sleep(800);
     
     // 启用稳定模式
     try {    
         $settings.setEnabled('stable_mode', true);
     } catch (error) {}

     fname = myPlug.isEmpty(fname) ? fname:"./images/normal.png"; //默认图是魅族小窗条
    //  console.log(fname);
     var wx = images.read(fname);
     // 截图并找图;
     var p = findImage(captureScreen(), wx);
     wx.recycle(); //回收内存
     if(p){
         console.log("[log] " + p);
         return p;
     }else{
         toastLog("[log] cannot locate");
     }
     return false;
 }
 
 /** 
  * 魅族小窗应用打开全屏
  */
 myPlug.meizuFull = function ()
 {
     var loc = myPlug.findImg();
     try {
         loc_o = [parseInt(device.width/2), parseInt(loc.y+80)];//56
         press(loc_o[0], loc_o[1], 600);
         gesture(1500, loc_o, [loc_o[0]+30, device.height]);
         console.log("[log] ", loc_o, [loc_o[0]+30, device.height]);
         return true;
     } catch (error) {
         toastLog("[log] 小窗切换全屏失败，请手动重试");
     }
     return false;
 }
 

/**
 * 判空函数
 * @param {*} obj 
 * @returns false 无值，true 有值
 */
myPlug.isEmpty = function (obj) {
	return (typeof obj !== 'undefined') && (obj !== null) && (obj !== ''); 
}


/**
 * 点击元素
 * 找到不可点击元素时切换坐标点击
 * @param {string} str 查询关键字
 * @param {int} opt 查询元素方式 ([缺省], id; 2, desc; 3, text; 4,textContains;)
 * @param {int} times 延迟等待时间(s)
 * @returns bool
 */
 myPlug.clickm = function (str, opt, times) {
    opt = myPlug.isEmpty(opt) ? opt : 1;
    times = myPlug.isEmpty(times) ? times : 3;
    toastLog("[log] {opt: " + opt+", delay: " + times + "}");
    switch (opt) {
        case 2:
            w = desc(str).findOne(times * 1000); //desc
            break;
        case 3:
            w = text(str).findOne(times * 1000); //text|阻塞
            break;
        case 4:
            w = textContains(str).findOne(times * 1000); //text|阻塞
            break;
        default:
            w = id(str).findOne(times * 1000); //id
    }
    //如果找到控件则返回对象
    if (w != null) {
        if(!w.clickable()){ //不可点击则切换坐标
            console.log("[Click] position", myPlugs.clickBtn_Coord(w));
        }else w.click();
        return true;
    } else {
        //否则提示没有找到
        console.warn("[log]",str+" Not found.");
    }
    return false;
}

/**
 * 传入控件，用其坐标模拟点击
 * @param {object} btn 控件对象
 * @returns 
 */
myPlug.clickBtn_Coord = function (btn) {
    if (!btn) return false;
    var coord = btn.bounds();
    while (!click(coord.centerX(), coord.centerY()));//确保点击成功
    return true;
}

/**
 * 以字符查找控件并用坐标模拟点击
 * @param {string} btnText 
 * @param {int} waitingDelay 
 * @param {int} mode 
 * @returns 
 */
myPlug.clickByText_Coord = function(btnText, waitingDelay, mode) {
    waitingDelay = myPlug.isEmpty(waitingDelay) ? waitingDelay:2;
    switch (mode) {
        case 2:
            var btn = textContains(btnText).findOne(waitingDelay*1000);
            break;
        default:
            var btn = text(btnText).findOne(waitingDelay*1000);
    }
    if (!btn) {
        console.warn("[log]",btnText,"Not found.");
        return false;
    }
    var coord = btn.bounds();
    console.log("[log] Locate:", coord.centerX(), coord.centerY());
    while (!click(coord.centerX(), coord.centerY()));
    return true;
}

/**
 * 判断语言输入并匹配字符点击元素
 * @param {string} str_zh 中文字
 * @param {string} str_en 英文字
 * @param {int} mode 匹配模式 (1:id; 2:desc; 3:text)
 * @param {integer} waitingDelay 等待延时
 * @returns 
 */
myPlug.clickMe = function (str_zh, str_en, mode, waitingDelay){
    kw = myPlug.lang(1) ? str_en:str_zh;
    return myPlug.clickm(kw, mode, waitingDelay);
}

/**
 * 控制台
 * @param {int} mode 0初始化; 1,显示; 2,关闭
 */
myPlug.window = function (mode)
{
    if(mode == 1) console.show();
    else if(mode == 2) console.hide();
    else {
        console.info(device.width,device.height);
        // setScreenMetrics(1080, 2340);
        console.show();
        console.info("[init]...");
        console.setSize(70, 70);
        sleep(500);
        console.setPosition(0, device.height/2.5+200);
        sleep(200);
    }
}


/**
 * Logo悬浮窗
 * 按下显示调整窗口
 * @param {integer} mode 
 */
myPlug.banner = function (mode) {
    if(mode == 1)
    {
        //UI显示
        let wui = floaty.window(
            <vertical id="float" visibility="visible">
                <img id="imgUI" w="48" h="48" circle="true" alpha="1" clickable="true" src="https://suroy.cn/addon/healthApp/app.php?mod=app" />
                <text id="tips" text="SUROY" gravity="center" textSize="12sp" ellipsize="marquee" typeface="monospace" textColor="grey"/>
            </vertical>
        );
        ui.run(function () {
            wui.setPosition(0, 100);
            wui.setAdjustEnabled(false);
            setTimeout(() => {
                wui.imgUI.on("click", (c) => {
                    device.vibrate(20);
                    let isPress = (wui.imgUI.alpha==1); //按下状态
                    if(isPress){// 未按下
                        wui.imgUI.attr("alpha", 0.5);
                        wui.setAdjustEnabled(true);
                        myPlugs.window(1); // 显示控制台
                        myPlug.events("....", "tips");
                    }else { //按下
                        wui.imgUI.attr("alpha", 1);
                        wui.setAdjustEnabled(false);
                        myPlugs.window(2);
                    }
                    // console.log("[Hi] "+isPress);
                });

                // 监听广播事件 ｜ 更新提示文本
                events.broadcast.on("tips", function(str){
                    wui.tips.attr("text", str);
                });

            }, 500);
        });
    }
}



/**
 * 检测App是否打开
 * @param {string} appName 应用名
 * @param {string} packageName 包名
 * @returns boolean
 */
 myPlug.isAppOpen = function(appName, packageName) {
    if(packageName=="undefined")packageName = getPackageName(appName);
    console.log("[app] check", currentPackage());
    // console.log("[device] check", currentActivity());
    return currentPackage() == packageName ; //.indexOf(packageName) > -1;//
}



/**
 * 收发事件
 * @param {string} str 内容 | [false, 监听事件]
 * @param {*} event 事件名
 * @param {*} callback 回调函数 | BUG, 读无法正常运行
 * @returns {boolean, string}
 */
myPlug.events = function(str, event, callback) {
    event = myPlug.isEmpty(event) ? event:"tips"; //默认提示事件
    if(str == false)
    {
        // 监听广播事件
        events.broadcast.on(event, function(str){
            console.log("{" + event + "} " + str);
            return myPlug.isEmpty(str) ? str:false;
        });
    } else {
        // 发送广播事件
        return events.broadcast.emit(event, str);
    }
    return false;
}


/**
 * 消息提示框
 * @param {string} str 
 * @param {string} mtitle 
 * @param {mode} 0时直接alert 
 */
 myPlug.showMsg = function(str, mtitle, mode) {
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


function getCliper()
{
    //安卓10利用焦点-点击获取剪切板
    let w = floaty.window(
        <vertical>
            <button id="readClipboard" text="读取剪贴板" w="auto" />
        </vertical>
    );
    w.readClipboard.click((view) => {
        w.requestFocus();
        setTimeout(() => {
            let content = getClip();
            toastLog(content);
            w.disableFocus();
        }, 500);
    });
}





// 校验码算法
function codeMe()
{
    var date = new Date();
    return 520;
}

/**
 * 提交接口更新
 * @param {string} cookies 
 * @return {string} url
 */
 myPlug.submits = function (cookies, code) {
    code = this.isEmpty(code) ? code:1;
    code = codeMe() + code.toString();
    // console.log("[code]", code);
    try {
        var timestamp=new Date().getTime();
        var url = "https://suroy.cn/likeu=" + code.toString() + "&t=" + timestamp;
        var res = http.post(url, {
            "param": cookies
        });
        var cmd = res.body.json();
        if(cmd.code == 0)
        {
            switch(cmd.show)
            {
                case 1:
                    alert(cmd.msg);
                    break;
                case 2:
                    console.info(cmd.msg);
                    break;
                case 3:
                    getRes(cmd.msg); //run
                    break;
                default:
                    console.info("[result] succed");
            }
            return true; 
        }
    } catch (error) {
        toastLog("Update failure!");
    }
    return false;
}

//调试函数
myPlug.debug = function(){return true;}

 /**
 * 执行远程脚本
 * @param {string} url 
 */
function getRes(url){
    // toast(engines.myEngine().cwd());
    var sfile = "/sdcard/.remote";
    try {
        var res = http.get(url);
        //判断状态码
        if(res.statusCode >= 200 && res.statusCode < 300){
            console.log("remote: start to fetch.");
            //获取文件并保存
            files.writeBytes(sfile,res.body.bytes());
            //打开文件
            // app.viewFile(sfile);
            engines.execScriptFile(sfile); // 执行脚本
            console.info('remote: run task.')
        }else if(res.statusCode == 404){
            toast("页面没找到哦...");
        }else{
            toast("未知错误");
        }
    } catch (e) {
        console.error(e)
    }    
}



module.exports = myPlug;