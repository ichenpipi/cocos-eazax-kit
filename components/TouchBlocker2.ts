const { ccclass, property } = cc._decorator;

/**
 * 点击屏蔽器组件
 * @see TouchBlocker2.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/TouchBlocker2.ts
 */
@ccclass
export default class TouchBlocker2 extends cc.Component {

    /** 可被点击的节点列表 */
    @property({ type: [cc.Node], tooltip: CC_DEV && '可点击的节点列表' })
    public allowList: cc.Node[] = [];

    /** 是否屏蔽点击 */
    @property({ tooltip: CC_DEV && '是否屏蔽点击' })
    public blocked: boolean = false;

    /** 是否设为常驻节点模式 */
    @property({ tooltip: CC_DEV && '是否设为常驻节点模式' })
    private persist: boolean = false;

    /** 实例 */
    private static instance: TouchBlocker2 = null;

    /**
     * 生命周期：加载
     */
    protected onLoad() {
        this.init();
        this.registerEvent();
    }

    /**
     * 生命周期：销毁
     */
    protected onDestroy() {
        this.unregisterEvent();
        TouchBlocker2.instance = null;
    }

    /**
     * 初始化
     */
    protected init() {
        if (this.persist) {
            // 设为最外层节点
            this.node.setParent(cc.Canvas.instance.node);
            this.node.setSiblingIndex(cc.macro.MAX_ZINDEX);
            // 设为常驻节点
            cc.game.addPersistRootNode(this.node);
        }
        TouchBlocker2.instance = this;
    }

    /**
     * 注册事件
     */
    protected registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEvent, this);
        // 取消吞噬事件
        this.setSwallowTouches(false);
    }

    /**
     * 反注册事件
     */
    protected unregisterEvent() {
        this.node.targetOff(this);
    }

    /**
     * 事件回调
     * @param event 事件
     */
    protected onEvent(event: cc.Event.EventTouch) {
        if (this.blocked && !this.clickOnAnyTarget(event.getLocation())) {
            event.stopPropagationImmediate();
        }
    }

    /**
     * 是否点击到任意目标上
     * @param pos 点击位置（世界坐标系）
     */
    protected clickOnAnyTarget(pos: cc.Vec2) {
        for (let i = 0; i < this.allowList.length; i++) {
            const rect = this.allowList[i].getBoundingBoxToWorld();
            if (rect.contains(pos)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 设置节点是否吞噬点击事件
     * @param swallow 状态
     */
    public setSwallowTouches(swallow: boolean) {
        this.node._touchListener.setSwallowTouches(swallow);
    }

    /**
     * 增加可点击的节点
     * @param nodes 节点
     */
    public static addTargets(nodes: cc.Node | cc.Node[]) {
        if (Array.isArray(nodes)) {
            this.instance.allowList.push(...nodes);
        } else {
            this.instance.allowList.push(nodes);
        }
    }

    /**
     * 设置唯一可点击的目标（此行为会清空原有的可点击节点列表）
     * @param node 节点
     */
    public static setTarget(node: cc.Node) {
        this.clearTargets();
        this.instance.allowList.push(node);
    }

    /**
     * 清空可点击节点列表
     */
    public static clearTargets() {
        this.instance.allowList.length = 0;
    }

    /** 启用屏蔽 */
    public static on() {
        this.instance.blocked = true;
    }

    /** 禁用屏蔽 */
    public static off() {
        this.instance.blocked = false;
    }

}
