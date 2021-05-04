import EventManager from "../core/EventManager";

const { ccclass, executionOrder } = cc._decorator;

/**
 * 背景适配组件
 * @see BackgroundFitter.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/BackgroundFitter.ts
 * @version 20210504
 */
@ccclass
@executionOrder(-99)
export default class BackgroundFitter extends cc.Component {

    protected onLoad() {
        this.registerEvent();
    }

    protected onEnable() {
        this.adapt();
    }

    protected onDestroy() {
        this.unregisterEvent();
    }

    /**
     * 订阅事件
     */
    protected registerEvent() {
        EventManager.on('view-resize', this.adapt, this);
    }

    /**
     * 取消事件订阅
     */
    protected unregisterEvent() {
        EventManager.off('view-resize', this.adapt, this);
    }

    /**
     * 适配
     */
    protected adapt() {
        // 实际屏幕比例
        const winSize = cc.winSize,
            screenRatio = winSize.height / winSize.width;
        // 设计比例
        const designResolution = cc.Canvas.instance.designResolution,
            designRatio = designResolution.height / designResolution.width;

        let scale = 1;
        if (screenRatio >= designRatio) {
            scale = winSize.height / designResolution.height;
        } else {
            scale = winSize.width / designResolution.width;
        }
        this.node.scale = scale;
    }

}
