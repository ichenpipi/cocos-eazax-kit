const { ccclass, property, executionOrder } = cc._decorator;

/**
 * 后期处理
 * @author 陈皮皮 (ifaswind)
 * @version 20211128
 * @see PostProcessing.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/PostProcessing.ts
 */
@ccclass
@executionOrder(-1)
export default class PostProcessing extends cc.Component {

    @property({ type: cc.Camera, tooltip: CC_DEV && '输入摄像机' })
    protected camera: cc.Camera = null;

    @property({ type: cc.Sprite, tooltip: CC_DEV && '输出目标精灵' })
    protected targetSprite: cc.Sprite = null;

    /**
     * 输出纹理
     */
    protected texture: cc.RenderTexture = null;

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
        this.release();
    }

    /**
     * 注册事件
     */
    protected registerEvent() {
        cc.Canvas.instance.node.on(cc.Node.EventType.SIZE_CHANGED, this.onCanvasSizeChanged, this);
    }

    /**
     * 反注册事件
     */
    protected unregisterEvent() {
        cc.Canvas.instance.node.off(cc.Node.EventType.SIZE_CHANGED, this.onCanvasSizeChanged, this);
    }

    /**
     * 初始化
     */
    protected init() {
        // 创建并初始化 RenderTexture
        const texture = this.texture = new cc.RenderTexture(),
            screenSize = cc.view.getVisibleSizeInPixel();
        texture.initWithSize(screenSize.width, screenSize.height);

        // 将摄像机的内容渲染到目标纹理上
        this.camera.targetTexture = texture;

        // 使用目标纹理生成精灵帧并设置到精灵上
        const sprite = this.targetSprite;
        sprite.spriteFrame = new cc.SpriteFrame(texture);

        // 设置 Y 轴翻转
        // texture.setFlipY(true);  // not working
        sprite.node.scaleY = -Math.abs(sprite.node.scaleY);
    }

    /**
     * 释放
     */
    protected release() {
        this.camera.destroy();
        this.texture.destroy();
    }

    /**
     * 画布尺寸变化回调
     */
    protected onCanvasSizeChanged() {
        const screenSize = cc.view.getVisibleSizeInPixel();
        this.texture.updateSize(screenSize.width, screenSize.height);
    }

}
