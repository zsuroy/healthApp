<!--suppress HtmlDeprecatedAttribute -->

<div align="center">
  <p>
    <img alt="AF_Banner" src="https://suroy.cn/addon/healthApp/image/app_logo.png"/>
  </p>

  <h1>基于 Auto.js 的健康打卡小助手</h1>
  <p>Auto.js-based health-app script</p>

  <p>
    <a href="https://suroy.cn"><img alt="SUROY(BLOG)" src="https://img.shields.io/website?down_message=FLOWER&label=SUROY&up_color=ff69b4&up_message=DREAM&logo=micro:bit&url=https%3A%2F%2Fsuroy.cn"></a>
    <a href="https://github.com/zsuroy"><img alt="Suroy" src="https://img.shields.io/github/languages/top/zsuroy/healthApp?style=flat-square"/></a>
    <a href="https://github.com/zsuroy"><img alt="Suroy" src="https://img.shields.io/github/languages/count/zsuroy/healthApp?style=flat"/></a>
    <a href="https://github.com/zsuroy"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/zsuroy/healthApp"></a>
    <img alt="GitHub" src="https://img.shields.io/github/license/zsuroy/healthApp">
    <a href="https://github.com/zsuroy"><img alt="GitHub AutoJs6 repository" src="https://img.shields.io/badge/auto.js->= 6.0.1-67a91b"/></a>
  </p>
</div>



## 🗒️简介说明

******

> 
> 微信疫情防控平台自动打卡辅助工具
>
> 2022.7.14

1. 支持微信自动填表打卡提交
2. 自动更新云托管平台`cookie`（Cookie 理论有效期7天，记得定时运行）
3. 不需要ROOT

- 设备系统要求

  - 具有 ROOT 权限的安卓 5.0 及以上版本
  - 没有 ROOT 权限的安卓 7.0 及以上版本
  - 因为图色识别的原因不支持护眼模式、暗色模式等。
- 觉得本项目好用的话请给个star吧~



## 🔬需要的权限

******

    无障碍 悬浮窗 截图权限 后台弹出 读写剪贴板
    开机自启 电池优化 读写存储



## 🎲使用说明

******

- 下载安装本APP
- 给与软件必要权限 `后台弹出界面`、`显示悬浮窗`、`自启动`、`截图权限`、`电量无限制`等
- 打开运行  | 功能:  [🎰功能说明](#🎰功能说明)
- 运行有问题请查看 [🏄🏻注意事项](#🏄🏻注意事项)
- 二次开发请查看 [🍧开发说明](#🍧开发说明)



### 🎰功能说明

******

- `无障碍`、`悬浮球`、`截屏权限` 必须启用
- `前台服务` 应用保活，建议打开
- `控制台` 运行日志
- `自动提交` 打卡时自动填报并提交；关闭则仅进入打卡填表页面
- `托管辅助` 同步更新云端托管任务Cookie，更新一次可以自动打卡7天
- `设置账号` 设置云端辅助平台ID号(托管辅助开启则生效)
- `底部中心按钮` 程序启动/关闭
- `左上角悬浮LOGO` 运行日志开启/关闭




## 🏄🏻注意事项

******

1. 给APP开启 "后台弹出界面" 权限，否则无法启动第二个app！！！（开启方法：长按APP，打开应用信息 - 权限设置，确认“后台弹出界面”权限开启），部分手机系统没有这种权限的话，请打开”读取应用列表“权限，否则也无法启动第二个app。
2. 程序运行期间不要触碰屏幕，以防异常崩溃；若未成功，可以关闭程序再次启动。
3. 可以自动打开无障碍，需要配合adb赋权，不同的软件请自行替换包名: Pro版为 `org.autojs.autojspro` 可以通过 `context.getPackageName()` 获取
4. 另外如果不断的运行异常，强制关闭AutoJS软件后重新执行脚本。同时建议定期强制关闭AutoJS软件，避免内存不断增长导致卡顿
  ```shell
    adb shell pm grant org.autojs.autojs android.permission.WRITE_SECURE_SETTINGS
  ```
5. 授予投影媒体权限，● 重启后权限依然有效 ● 授予这个权限以后 requestCaptureScreen就不会弹窗询问了
  ```shell
    adb shell appops set org.autojs.autojspro PROJECT_MEDIA allow
  ```
6. [华为手机无障碍保护(不建议对该程序使用保活)](https://www.yuque.com/chengshulun/iybzfr/ou7gov)




## 🙈目前存在的问题

******

- 可能存在点击异常错误，原因是图像识别不准确或控件未识别到
- 异常卡死，请按音量键强制结束任务，无效则重启。（程序运行时不要点击屏幕，结束后才点击）
- 无法正常运行(无效点击等，建议重装。)
- 新发现问题请提交ISSUE，我会尽快跟进解决





## 🍧开发说明

******

> 普通用户请直接忽略
> 
> 仅仅记录个人开发过程的BUG苦逼历程

+ `[开发设备]`

  - `机型`: 魅族17Pro(1080x2340) 无ROOT
  - `版本`: AutojsPro 8.8.22-0 / AutoJsx 6.2
  - Pro 9.2.3  

+ `[打包说明]`
  
  - 附带打包 `OpenCv` 组件
  - 给予各项权限，可以手动配置 `后台弹出界面`、`悬浮窗`、`后台运行` 等权限
  - 额外给权限 `允许后台关闭其他应用`

+ `[已知BUG]😤`

  - BUG: 获取最近的包名函数错误currentPackage()无返回值 

    不可以同时开启免费版和pro版本无障碍,
    如果两个同时开启则会发生冲突 某些函数无法正常运行
    打包后无法正常运行可能因为这个原因

  - BUG: 微信无法操作，建议停止微信之后启动本程序

    参考同类问题解决方式：

    **总结**

    APP自动检测辅助工具，解决：断网/强制关闭APP/更换包名/重新签名。

    > 1. 如果你是鸿蒙系统那你可能跟我一样的问题，这可能是系统的某种机制引起的，你可以这样测试一下，删掉APP重启，然后断网的状态下安装，这个时候系统应该还没有标记不安全APP什么的，马上测试一下是否可以分析小程序，如果是那你的APP需要签名，不被标记为不安全就没问题了
    > 2. 据使用经验和推测,掏bao会查看无障碍开启的app(或正在运行的app),并查看该app的apk安装包代码,有相关关键代码,即判定.可能混淆代码会有作用.但估计淘bao也会反混淆吧.可能也会检测已安装的代码.而且不是只在掏bao进入的时候检测,而是在赚积分时的那些模块内检测
    > 3. 另外,只要auto类运行时间短,比如几分钟,并不会立即判定.但需要手动强制关闭auto类的app,因为开启了无障碍后,这类app可以自动启动,所以实际上还是在后台运行,被淘bao抓到
    > 4. 会检测无障碍服务的包名，任何包含autojs、脚本精灵等包名的服务都会被判定作弊。 **如果不想删除其他辅助，可以试试双开淘宝，用新开的淘宝登录帐号运行脚本。**或者可以在应用列表中“强制停止”其他辅助（杀掉后台），不推荐。


### ⛄️相关项目

******

* [Auto.js](https://github.com/hyb1996/Auto.js)
    - `安卓平台 JavaScript 自动化工具`
* [Autox.js](https://github.com/kkevsekk1/AutoX)
    - `Autox.js 基于autoV4 开发`




## 👑更新记录

******

- 历史版本更新记录可前往[RELEASES 页面](https://github.com/zsuroy/healthApp/realease) 查看

### V1.0.1
- 修复强行停止APP函数声明错误(用于异常时暴力启动)


## 🌈打赏 (Tip)

******

<details><summary>查看详情 (Click to show details)</summary><br>
<div align="center">
To tip online, scan the QR code below <br>
扫描对应二维码可打赏 <br><br>
I believe I could make it better with your support :) <br>
感谢每一份支持和鼓励 <br><br>

<a href="https://suroy.cn/usr/themes/Sunshine/images/donate/alipay.png"><img alt="Alipay sponsor" src="https://suroy.cn/usr/themes/Sunshine/images/donate/alipay.png" height="224"/></a>
<a href="https://suroy.cn/usr/themes/Sunshine/images/donate/wechat.png"><img alt="WeChat sponsor" src="https://suroy.cn/usr/themes/Sunshine/images/donate/wechat.png" height="224"/></a>
</div>
</details>


## 👨🏻‍💻关于作者

******

[@Suroy](https://suroy.cn)




