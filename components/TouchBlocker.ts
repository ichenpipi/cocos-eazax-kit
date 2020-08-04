const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchBlocker extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '可点击的节点' })
    public target: cc.Node = null;

    private isBlockAll: boolean = false;

    private isPassAll: boolean = false;

    protected onLoad() {
        this.node.on('touchstart', this.onTouchStart, this);
    }

    protected start() {
        this.setSwallowTouches(false);
    }

    protected onDestroy() {
        this.node.off('touchstart', this.onTouchStart, this);
    }

    /**
     * touchstart 回调
     * @param event 事件
     */
    private onTouchStart(event: cc.Event.EventTouch) {
        if (this.isPassAll) return;
        if (this.isBlockAll || !this.target) {
            event.stopPropagationImmediate();
            return;
        }
        let targetRect = this.target.getBoundingBoxToWorld();
        let isContains = targetRect.contains(event.getLocation());
        if (!isContains) event.stopPropagationImmediate();
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
