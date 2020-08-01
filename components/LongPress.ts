/**
 * 节点长按事件（由 LongPress 组件触发）
 */
export const LONG_PRESS: string = 'longpress';

/**
 * 长按触发方式
 */
export enum TriggerWay {

    /**
     * 到达设定时间后立即触发
     */
    Immediately = 1,

    /**
     * 触摸结束后触发
     */
    AfterLoosing

}

const { ccclass, property } = cc._decorator;

@ccclass
export default class LongPress extends cc.Component {

    @property({ tooltip: CC_DEV && '长按触发时间（单位：秒）' })
    public trggerTime: number = 2;

    @property({ type: cc.Enum(TriggerWay), tooltip: CC_DEV && '长按触发方式' })
    public trggerWay: TriggerWay = TriggerWay.Immediately;

    @property({ type: cc.Component.EventHandler, tooltip: CC_DEV && '长按事件列表' })
    public longPressEvents: cc.Component.EventHandler[] = [];

    /**
     * 长按是否达成
     */
    private hasAccomplished: boolean = false;

    protected onEnable() {
        this.registerNodeEvent();
    }

    protected onDisable() {
        this.unregisterNodeEvent();
    }

    private registerNodeEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private unregisterNodeEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private onTouchStart() {
        this.hasAccomplished = false;
        this.scheduleOnce(this.onPressAccomplished.bind(this), this.trggerTime);
    }

    private onTouchEnd() {
        if (this.hasAccomplished) {
            this.hasAccomplished = false;
            this.trigger();
        }
        this.unscheduleAllCallbacks();
    }

    private onTouchCancel() {
        if (this.hasAccomplished) {
            this.hasAccomplished = false;
            this.trigger();
        }
        this.unscheduleAllCallbacks();
    }

    /**
     * 长按达成回调
     */
    private onPressAccomplished() {
        if (this.trggerWay === TriggerWay.Immediately) this.trigger();
        else if (this.trggerWay === TriggerWay.AfterLoosing) this.hasAccomplished = true;
    }

    /**
     * 触发已注册长按事件
     */
    private trigger() {
        cc.Component.EventHandler.emitEvents(this.longPressEvents, this);
        this.node.emit(LONG_PRESS, this);
    }

}