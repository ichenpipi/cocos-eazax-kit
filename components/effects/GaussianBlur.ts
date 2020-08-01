import EditorAsset from "../../misc/EditorAsset";

const { ccclass, property, executeInEditMode, disallowMultiple, requireComponent, executionOrder } = cc._decorator;

@ccclass
@executeInEditMode
@disallowMultiple
@requireComponent(cc.Sprite)
@executionOrder(-100)
export default class GaussianBlur extends cc.Component {

    @property({
        type: cc.EffectAsset,
        tooltip: CC_DEV && 'Effect 资源',
        readonly: true
    })
    private effect: cc.EffectAsset = null;

    @property({ tooltip: CC_DEV && '半径' })
    private radius: number = 10;

    @property({ tooltip: CC_DEV && '每帧自动更新' })
    public keepUpdating: boolean = false;

    private material: cc.Material = null; // 材质

    private isIniting: boolean = false; // 是否正在初始化

    protected onLoad() {
        // 使用自定义 Effect 需禁用目标贴图的 packable 属性，因为动态合图后无法正确计算纹理 uv
        // 详情请看：https://docs.cocos.com/creator/manual/zh/asset-workflow/sprite.html#packable
        let spriteFrame = this.getComponent(cc.Sprite).spriteFrame;
        if (spriteFrame) spriteFrame.getTexture().packable = false;
        // 或者全局禁用动态合图功能（不推荐！！！）
        // cc.dynamicAtlasManager.enabled = false;

        this.init();
    }

    protected resetInEditor() {
        this.init();
    }

    protected update() {
        if (!this.material || !this.keepUpdating) return;
        this.render(true);
    }

    /**
     * 初始化组件
     */
    private async init() {
        if (this.isIniting) return;
        this.isIniting = true;

        // 编辑器环境下自动绑定 Effect 资源
        // 依赖于 EditorAsset 模块，没有模块请将此代码块以及顶部导入语句注释
        if (CC_EDITOR && !this.effect) {
            await new Promise(res => {
                EditorAsset.load('eazax-ccc/resources/effects/eazax-gaussian-blur-adjustable.effect', 'effect', (err: any, result: cc.EffectAsset) => {
                    if (err) cc.warn('请手动指定组件的 Effect 文件！');
                    else this.effect = result;
                    res();
                });
            });
        }

        if (this.effect) {
            this.material = cc.Material.create(this.effect);
            this.node.getComponent(cc.Sprite).setMaterial(0, this.material);
            this.render(this.keepUpdating);
        }

        this.isIniting = false;
    }

    /**
     * 渲染
     * @param keepUpdating 是否每帧自动更新
     */
    private render(keepUpdating: boolean) {
        this.radius = this.radius > 50 ? 50 : this.radius;

        this.material.setProperty('size', this.getNodeSize());
        this.material.setProperty('radius', this.radius);

        this.keepUpdating = keepUpdating;
    }

    /**
     * 获取节点尺寸
     */
    private getNodeSize() {
        return cc.v2(this.node.width, this.node.height);
    }
}
