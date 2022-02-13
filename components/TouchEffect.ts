const { ccclass, property } = cc._decorator;

/**
 * 点击效果
 * @author 陈皮皮 (ifaswind)
 * @version 20220213
 * @see TouchEffect.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/TouchEffect.ts
 */
@ccclass
export default class TouchEffect extends cc.Component {

    @property({ type: cc.Prefab, displayName: CC_DEV && '效果节点预制体' })
    protected effectPrefab: cc.Prefab = null;

    @property({ type: cc.Node, displayName: CC_DEV && '效果节点容器' })
    protected effectContainer: cc.Node = null;

    @property({ displayName: CC_DEV && '持续时间' })
    protected duration: number = 0.5;

    @property({ displayName: CC_DEV && '触发间隔' })
    protected interval: number = 0.5;

    @property({ displayName: CC_DEV && '同时存在最大数量' })
    protected maxQuantity: number = 20;

    @property({ displayName: CC_DEV && '允许滑动触发', tooltip: CC_DEV && '希望你知道你在做什么，试着调整触发时间和同时存在最大数量' })
    protected triggerByMoving: boolean = false;

    @property({ displayName: CC_DEV && '使用节点池缓存', tooltip: CC_DEV && '提高播放大量效果时的性能' })
    protected useNodePool: boolean = false;

    @property({ visible() { return this.useNodePool; }, displayName: CC_DEV && '使用节点池缓存', tooltip: CC_DEV && '提高播放大量效果时的性能' })
    protected nodePoolLimit: number = 20;

    /**
     * 当前存在效果数量
     */
    protected curCount: number = 0;

    /**
     * 上一个效果触发时间
     */
    protected lastTriggerTime: number = 0;

    /**
     * 节点池
     */
    protected nodePool: cc.NodePool = new cc.NodePool();

    /**
     * 生命周期：加载
     */
    protected onLoad() {
        this.registerEvent();
    }

    /**
     * 生命周期：销毁
     */
    protected onDestroy() {
        this.unregisterEvent();
    }

    /**
     * 注册事件
     */
    protected registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // 取消事件吞噬
        this.setSwallowTouches(false);
    }

    /**
     * 反注册事件
     */
    protected unregisterEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    /**
     * 点击开始回调
     * @param event 
     */
    protected onTouchStart(event: cc.Event.EventTouch) {
        this.playEffect(event.getLocation());
    }

    /**
     * 点击移动回调
     * @param event 
     */
    protected onTouchMove(event: cc.Event.EventTouch) {
        if (!this.triggerByMoving) {
            return;
        }
        this.playEffect(event.getLocation());
    }

    /**
     * 播放效果
     * @param pos 
     */
    protected playEffect(pos: cc.Vec2) {
        const now = Date.now();
        if (this.curCount >= this.maxQuantity ||
            this.lastTriggerTime > (now - this.interval * 1000)) {
            return;
        }
        this.lastTriggerTime = now;
        this.curCount++;
        // 创建节点
        let node: cc.Node = null;
        if (this.nodePool.size() > 0) {
            node = this.nodePool.get();
        } else {
            node = cc.instantiate(this.effectPrefab);
        }
        // 设置节点
        const container = this.effectContainer || this.node;
        node.setParent(container);
        node.setPosition(container.convertToNodeSpaceAR(pos));
        // 播放动画
        node.opacity = 255;
        cc.tween(node)
            .to(this.duration, { opacity: 0 })
            .call(() => this.recycleEffect(node))
            .start();
    }

    /**
     * 回收效果
     * @param node 
     */
    protected recycleEffect(node: cc.Node) {
        this.curCount--;
        // 回收或者销毁
        if (this.useNodePool && this.nodePool.size() < this.nodePoolLimit) {
            this.nodePool.put(node);
        } else {
            node.destroy();
        }
    }

    /**
     * 设置节点是否吞噬点击事件
     * @param swallow 状态
     */
    protected setSwallowTouches(swallow: boolean) {
        this.node._touchListener && this.node._touchListener.setSwallowTouches(swallow);
    }

}
