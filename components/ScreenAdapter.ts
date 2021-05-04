import EventManager from "../core/EventManager";

const { ccclass, executionOrder } = cc._decorator;

/**
 * 屏幕适配组件
 * @see ScreenAdapter.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/ScreenAdapter.ts
 * @version 20210504
 */
@ccclass
@executionOrder(-999)
export default class ScreenAdapter extends cc.Component {

    protected onLoad() {
        this.init();
    }

    protected onEnable() {
        this.adapt();
    }

    protected init() {
        // 设置游戏窗口变化的回调（仅 Web 平台有效）
        cc.view.setResizeCallback(() => this.onResize());
    }

    /**
     * 窗口变化回调
     */
    protected onResize() {
        // 由于 setResizeCallback 只能设置一个回调
        // 使用事件系统发送一个特定事件，让其他组件也可以监听到窗口变化
        EventManager.emit('view-resize');
        // 适配
        this.adapt();
    }

    /**
     * 适配
     */
    protected adapt() {
        // 实际屏幕比例
        const winSize = cc.winSize,
            screenRatio = winSize.width / winSize.height;
        // 设计比例
        const designResolution = cc.Canvas.instance.designResolution,
            designRatio = designResolution.width / designResolution.height;
        // 判断实际屏幕宽高比
        if (screenRatio <= 1) {
            // 此时屏幕高度大于宽度
            if (screenRatio <= designRatio) {
                this.setFitWidth();
            } else {
                // 此时实际屏幕比例大于设计比例
                // 为了保证纵向的游戏内容不受影响，应使用 fitHeight 模式
                this.setFitHeight();
            }
        } else {
            // 此时屏幕高度小于宽度
            this.setFitHeight();
        }
    }

    /**
     * 适配高度模式
     */
    protected setFitHeight() {
        const canvas = cc.Canvas.instance;
        canvas.fitHeight = true;
        canvas.fitWidth = false;
    }

    /**
     * 适配宽度模式
     */
    protected setFitWidth() {
        const canvas = cc.Canvas.instance;
        canvas.fitHeight = false;
        canvas.fitWidth = true;
    }

}
