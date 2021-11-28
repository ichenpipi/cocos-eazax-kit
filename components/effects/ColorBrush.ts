const { ccclass, property } = cc._decorator;

/**
 * 彩色画笔（多彩 Graphics，需搭配 eazax-color-brush.effect 使用）
 * @author 陈皮皮 (ifaswind)
 * @version 20210317
 * @see ColorBrush.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/ColorBrush.ts
 * @see eazax-color-brush.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-color-brush.effect
 */
@ccclass
export default class ColorBrush extends cc.Component {

    /**
     * 绘图组件
     */
    protected graphics: cc.Graphics = null;

    /**
     * 材质
     */
    protected material: cc.Material = null;

    /**
     * 生命周期：节点加载
     */
    protected onLoad() {
        this.init();
        this.registerEvent();
    }

    /**
     * 生命周期：节点销毁
     */
    protected onDestroy() {
        this.unregisterEvent();
    }

    /**
     * 初始化
     */
    protected init() {
        const graphics = this.graphics = this.node.getComponent(cc.Graphics) || this.node.addComponent(cc.Graphics);
        // 设置画笔
        graphics.strokeColor = cc.Color.WHITE;
        graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
        graphics.lineCap = cc.Graphics.LineCap.ROUND;
        graphics.lineWidth = 20;
        // 设置材质上的节点尺寸参数
        // 需搭配 eazax-color-brush.effect 使用
        this.material = graphics.getMaterial(0);
        this.material.setProperty('size', this.getNodeSize());
    }

    /**
     * 注册事件
     */
    protected registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    /**
     * 反注册事件
     */
    protected unregisterEvent() {
        this.node.targetOff(this);
    }

    /**
     * 点击开始
     * @param event 
     */
    protected onTouchStart(event: cc.Event.EventTouch) {
        const pos = this.node.parent.convertToNodeSpaceAR(event.getLocation()),
            graphics = this.graphics;
        graphics.moveTo(pos.x - 5, pos.y);
        graphics.circle(pos.x - 5, pos.y, 1);
        graphics.stroke();
        graphics.moveTo(pos.x - 5, pos.y);
    }

    /**
     * 点击移动
     * @param event 
     */
    protected onTouchMove(event: cc.Event.EventTouch) {
        const pos = this.node.parent.convertToNodeSpaceAR(event.getLocation()),
            graphics = this.graphics;
        graphics.lineTo(pos.x - 5, pos.y);
        graphics.stroke();
        graphics.moveTo(pos.x - 5, pos.y);
    }

    /**
     * 获取节点尺寸
     */
    protected getNodeSize() {
        return cc.v2(this.node.width, this.node.height);
    }

}
