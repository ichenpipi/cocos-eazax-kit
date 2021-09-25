/**
 * 设备工具
 * @author 陈皮皮 (ifaswind)
 * @version 20210120
 * @see DeviceUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/DeviceUtil.ts
 */
export default class DeviceUtil {

    /**
     * 返回手机屏幕安全区域，如果不是异形屏将默认返回设计分辨率尺寸。目前只支持安卓、iOS 原生平台和微信小游戏平台。 
     */
    public static getSafeAreaRect() {
        return cc.sys.getSafeAreaRect();
    }

    /** 当前平台 */
    public static get platform() { return cc.sys.platform; }

    /** 当前操作系统 */
    public static get os() { return cc.sys.os; }

    /** 是否为安卓手机 */
    public static get isAndroid() { return cc.sys.platform === cc.sys.ANDROID; }

    /** 是否为原生环境 */
    public static get isNative() { return cc.sys.isNative; }

    /** 是否为浏览器环境 */
    public static get isBrowser() { return cc.sys.isBrowser; }

    /** 是否为手机 */
    public static get isMobile() { return cc.sys.isMobile; }

    /** 是否为苹果手机 */
    public static get isIPhone() { return cc.sys.platform === cc.sys.IPHONE; }

    /** 是否为苹果平板 */
    public static get isIPad() { return cc.sys.platform === cc.sys.IPAD; }

    /** 是否为手机浏览器 */
    public static get isMobileBrowser() { return cc.sys.platform === cc.sys.MOBILE_BROWSER; }

    /** 是否为桌面浏览器 */
    public static get isDesktopBrowser() { return cc.sys.platform === cc.sys.DESKTOP_BROWSER; }

    /** 是否为微信小游戏 */
    public static get isWeChat() { return cc.sys.platform === cc.sys.WECHAT_GAME; }

    /** 是否为 QQ 小游戏 */
    public static get isQQPlay() { return cc.sys.platform === cc.sys.QQ_PLAY; }

    /** 是否为字节小游戏 */
    public static get isByteDance() { return cc.sys.platform === cc.sys.BYTEDANCE_GAME; }

    /** 是否为百度小游戏 */
    public static get isBaidu() { return cc.sys.platform === cc.sys.BAIDU_GAME; }

    /** 是否为 vivo 小游戏 */
    public static get isVivo() { return cc.sys.platform === cc.sys.VIVO_GAME; }

    /** 是否为 OPPO 小游戏 */
    public static get isOPPO() { return cc.sys.platform === cc.sys.OPPO_GAME; }

    /** 是否为小米小游戏 */
    public static get isXiaomi() { return cc.sys.platform === cc.sys.XIAOMI_GAME; }

    /** 是否为华为小游戏 */
    public static get isHuawei() { return cc.sys.platform === cc.sys.HUAWEI_GAME; }

    /** 是否为支付宝小游戏 */
    public static get isAlipay() { return cc.sys.platform === cc.sys.ALIPAY_GAME; }

}
