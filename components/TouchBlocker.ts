const { ccclass, property } = cc._decorator;

/**
 * 点击屏蔽器组件
 * @see TouchBlocker.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/TouchBlocker.ts
 * @version 20210421
 */
@ccclass
export default class TouchBlocker extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '可被点击的节点' })
    public target: cc.Node = null;

    /** 拦截状态 */
    protected isBlockAll: boolean = false;

    /** 放行状态 */
    protected isPassAll: boolean = false;

    protected onLoad() {
        this.registerEvent();
    }

    protected start() {
        this.reset();
    }

    protected onDestroy() {
        this.unregisterEvent();
    }

    /**
     * 订阅事件
     */
    protected registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEvent, this);
    }

    /**
     * 移除订阅事件
     */
    protected unregisterEvent() {
        this.node.targetOff(this);
    }

    /**
     * 重置
     */
    protected reset() {
        // 取消吞噬事件
        this.setSwallowTouches(false);
    }

    /**
     * 事件回调
     * @param event 事件
     */
    protected onTouchEvent(event: cc.Event.EventTouch) {
        // 全部放行状态
        if (this.isPassAll) {
            return;
        }
        // 拦截状态并且无目标
        if (this.isBlockAll || !this.target) {
            event.stopPropagationImmediate();
            return;
        }
        // 点击是否命中目标节点
        const targetRect = this.target.getBoundingBoxToWorld(),
            isContains = targetRect.contains(event.getLocation());
        if (!isContains) {
            event.stopPropagationImmediate();
        }
    }

    /**
     * 屏蔽所有点击
     */
    public blockAll() {
        this.isBlockAll = true;
        this.isPassAll = false;
    }

    /**
     * 放行所有点击
     */
    public passAll() {
        this.isPassAll = true;
        this.isBlockAll = false;
    }

    /**
     * 设置可点击的节点
     * @param node 节点
     */
    public setTarget(node: cc.Node) {
        this.target = node;
        this.isBlockAll = false;
        this.isPassAll = false;
    }

    /**
     * 设置节点是否吞噬点击事件
     * @param swallow 状态
     */
    public setSwallowTouches(swallow: boolean) {
        this.node._touchListener && this.node._touchListener.setSwallowTouches(swallow);
    }

}
