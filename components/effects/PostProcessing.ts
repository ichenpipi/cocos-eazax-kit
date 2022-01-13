const { ccclass, property, executionOrder, help, menu } = cc._decorator;

/**
 * 后期处理
 * @author 陈皮皮 (ifaswind)
 * @version 20211224
 * @see PostProcessing.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/PostProcessing.ts
 */
@ccclass
@executionOrder(-1)
@help('https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/PostProcessing.ts')
@menu('eazax/效果组件/PostProcessing')
export default class PostProcessing extends cc.Component {

    @property({ type: cc.Camera, tooltip: CC_DEV && '输入摄像机' })
    protected inputCamera: cc.Camera = null;

    @property({ type: cc.Sprite, tooltip: CC_DEV && '输出精灵' })
    protected outputSprite: cc.Sprite = null;

    /**
     * 输出纹理
     */
    protected renderTexture: cc.RenderTexture = null;

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
        const renderTexture = this.renderTexture = new cc.RenderTexture(),
            screenSize = cc.view.getVisibleSizeInPixel();
        renderTexture.initWithSize(screenSize.width, screenSize.height);

        // 将摄像机的内容渲染到目标纹理上
        this.inputCamera.targetTexture = renderTexture;

        // 使用目标纹理生成精灵帧并设置到精灵上
        this.outputSprite.spriteFrame = new cc.SpriteFrame(renderTexture);

        // 设置 Y 轴翻转
        // renderTexture.setFlipY(true);  // not working
        this.outputSprite.node.scaleY = -Math.abs(this.outputSprite.node.scaleY);
    }

    /**
     * 释放
     */
    protected release() {
        this.renderTexture.destroy();
    }

    /**
     * 画布尺寸变化回调
     */
    protected onCanvasSizeChanged() {
        const screenSize = cc.view.getVisibleSizeInPixel();
        this.renderTexture.updateSize(screenSize.width, screenSize.height);
    }

}
