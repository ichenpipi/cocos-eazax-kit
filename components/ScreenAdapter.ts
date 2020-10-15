import EventManager from "../core/EventManager";
import { VIEW_RESIZE } from "../constants/Events";

const { ccclass } = cc._decorator;

/**
 * 屏幕适配组件
 * @see ScreenAdapter.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/ScreenAdapter.ts
 */
@ccclass
export default class ScreenAdapter extends cc.Component {

    protected onLoad() {
        // 设置游戏窗口变化的回调
        cc.view.setResizeCallback(() => this.onResize());
    }

    protected start() {
        // 主动调用一次
        this.adapt();
    }

    /**
     * 游戏窗口变化
     */
    private onResize() {
        // 由于 setResizeCallback 只能设置一个回调
        // 使用事件系统发送一个特定事件，让其他组件也可以监听到窗口变化
        EventManager.emit(VIEW_RESIZE);
        // 适配
        this.adapt();
    }

    /**
     * 适配
     */
    private adapt() {
        // 实际屏幕比例
        let screenRatio = cc.winSize.width / cc.winSize.height;
        // 设计比例
        let designRatio = cc.Canvas.instance.designResolution.width / cc.Canvas.instance.designResolution.height;
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
    private setFitHeight() {
        cc.Canvas.instance.fitHeight = true;
        cc.Canvas.instance.fitWidth = false;
    }

    /**
     * 适配宽度模式
     */
    private setFitWidth() {
        cc.Canvas.instance.fitHeight = false;
        cc.Canvas.instance.fitWidth = true;
    }

}
