import EditorAsset from "../../misc/EditorAsset";

const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple, executionOrder } = cc._decorator;

/**
 * 高斯模糊 Shader 组件，该组件需要对应的 Effect 才能正常使用！
 * @see GaussianBlur.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/GaussianBlur.ts
 * @see eazax-gaussian-blur-adjustable.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-gaussian-blur-adjustable.effect
 */
@ccclass
@requireComponent(cc.Sprite)
@executeInEditMode
@disallowMultiple
@executionOrder(-100)
export default class GaussianBlur extends cc.Component {

    @property private _effect: cc.EffectAsset = null;
    @property({ type: cc.EffectAsset, tooltip: CC_DEV && 'Effect 资源', readonly: true })
    public get effect() { return this._effect; }
    public set effect(value: cc.EffectAsset) { this._effect = value; this.init(); }

    @property private _radius: number = 10;
    @property({ tooltip: CC_DEV && '模糊半径' })
    public get radius() { return this._radius; }
    public set radius(value: number) { this._radius = value > 50 ? 50 : value; this.updateProperties(); }

    private material: cc.Material = null;

    protected onLoad() {
        this.init();
    }

    protected resetInEditor() {
        this.init();
    }

    /**
     * 初始化
     */
    public async init() {
        /**
         * 编辑器环境下自动绑定 Effect 资源
         * 依赖于 EditorAsset 模块，没有模块请将此代码块以及顶部导入语句注释
         * @see EditorAsset.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/misc/EditorAsset.ts
         */
        if (CC_EDITOR && !this._effect) {
            await new Promise(res => {
                EditorAsset.load('eazax-ccc/resources/effects/eazax-gaussian-blur-adjustable.effect', 'effect', (err: Error, result: cc.EffectAsset) => {
                    if (err) cc.warn('[GaussianBlur]', '请手动指定组件的 Effect 资源！');
                    else this._effect = result;
                    res();
                });
            });
        }
        // 设置
        if (!this._effect) return;
        // 使用自定义 Effect 需禁用目标贴图的 packable 属性，因为动态合图后无法正确计算纹理 uv
        // 详情请看：https://docs.cocos.com/creator/manual/zh/asset-workflow/sprite.html#packable
        const sprite = this.node.getComponent(cc.Sprite);
        if (sprite) sprite.spriteFrame.getTexture().packable = false;
        // 生成并应用材质
        this.material = cc.Material.create(this._effect);
        sprite.setMaterial(0, this.material);
        // 更新 Shader 属性
        this.updateProperties();
    }

    /**
     * 更新 Shader 属性
     */
    private updateProperties() {
        this.material.setProperty('size', this.getNodeSize());
        this.material.setProperty('radius', this.radius);
    }

    /**
     * 获取节点尺寸
     */
    private getNodeSize() {
        return cc.v2(this.node.width, this.node.height);
    }

}
