const { ccclass, property } = cc._decorator;

/**
 * 点击屏蔽器组件
 * @see TouchBlocker.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/TouchBlocker.ts
 */
@ccclass
export default class TouchBlocker extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '可被点击的节点' })
    public target: cc.Node = null;

    private isBlockAll: boolean = false;

    private isPassAll: boolean = false;

    protected onLoad() {
        this.registerEvent();
    }

    protected onDestroy() {
        this.unregisterEvent();
    }

    /**
     * 订阅事件
     */
    protected registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEvent, this);
        // 取消吞噬事件
        this.setSwallowTouches(false);
    }

    /**
     * 移除订阅事件
     */
    protected unregisterEvent() {
        this.node.targetOff(this);
    }

    /**
     * 事件回调
     * @param event 事件
     */
    private onEvent(event: cc.Event.EventTouch) {
        if (this.isPassAll) return;
        if (this.isBlockAll || !this.target) {
            event.stopPropagationImmediate();
            return;
        }
        const targetRect = this.target.getBoundingBoxToWorld();
        const isContains = targetRect.contains(event.getLocation());
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
     * @param node 
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
        this.node._touchListener.setSwallowTouches(swallow);
    }

}
