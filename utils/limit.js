/**
 * 
 * 去除Pro限制app及布局代码
 * 可以去9.1.20或者以下
 * @demo
 * const limit = require('./limit.js'); //ui最后导入
 * limit();
 */
module.exports = function () {
    try {
        importClass(com.stardust.autojs.core.accessibility.AccessibilityBridge.WindowFilter);
        let bridge = runtime.accessibilityBridge;
        let bridgeField = runtime.getClass().getDeclaredField("accessibilityBridge");
        let configField = bridgeField.getType().getDeclaredField("mConfig");
        configField.setAccessible(true);
        configField.set(bridge, configField.getType().newInstance());
        bridge.setWindowFilter(new JavaAdapter(AccessibilityBridge$WindowFilter, {
            filter: function(info) {
                return true;
            }
        }));
        toastLog("[init] limit.");
    } catch (error) {
        toastLog("[init] limit->", error);
    }
}