import EditorAsset from "../../misc/EditorAsset";

const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple } = cc._decorator;

/**
 * 径向模糊 Shader 组件（该组件需要对应的 Effect 文件才能正常使用）
 * @author 陈皮皮 (ifaswind)
 * @version 20211205
 * @see RadialBlur.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/RadialBlur.ts
 * @see eazax-radial-blur.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-radial-blur.effect
 */
@ccclass
@requireComponent(cc.Sprite)
@executeInEditMode
@disallowMultiple
export default class RadialBlur extends cc.Component {

    @property
    protected _effect: cc.EffectAsset = null;
    @property({ type: cc.EffectAsset, tooltip: CC_DEV && 'Effect 资源', readonly: true })
    public get effect() {
        return this._effect;
    }
    public set effect(value) {
        this._effect = value;
        this.init();
    }

    @property
    protected _center: cc.Vec2 = new cc.Vec2(0.5, 0.5);
    @property({ tooltip: CC_DEV && '模糊中心点' })
    public get center() {
        return this._center;
    }
    public set center(value) {
        this._center = value;
        this.updateProperties();
    }

    @property
    protected _strength: number = 0.5;
    @property({ tooltip: CC_DEV && '模糊强度' })
    public get strength() {
        return this._strength;
    }
    public set strength(value) {
        this._strength = value;
        this.updateProperties();
    }

    /**
     * 精灵
     */
    protected sprite: cc.Sprite = null;

    /**
     * 材质
     */
    protected material: cc.Material = null;

    /**
     * 声明周期：节点加载
     */
    protected onLoad() {
        this.init();
    }

    /**
     * 编辑器回调：重置
     */
    protected resetInEditor() {
        this.init();
    }

    /**
     * 初始化
     */
    protected async init() {
        /**
         * 编辑器环境下自动绑定 Effect 资源
         * 依赖于 EditorAsset 模块，没有该模块请将此代码块以及顶部导入语句去除
         * @see EditorAsset.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/misc/EditorAsset.ts
         */
        if (CC_EDITOR && !this._effect) {
            const path = 'eazax-ccc/resources/effects/eazax-radial-blur.effect';
            this._effect = await EditorAsset.load(path, 'effect');
        }
        if (!this._effect) {
            cc.warn(`[${this['__proto__']['__classname__']}]`, '请手动指定组件的 Effect 资源！');
            return;
        }
        // 使用自定义 Effect 需禁用纹理的 packable 属性（因为动态合图之后无法正确获取纹理 UV 坐标）
        // 详情请看：https://docs.cocos.com/creator/manual/zh/asset-workflow/sprite.html#packable
        this.sprite = this.node.getComponent(cc.Sprite);
        if (this.sprite.spriteFrame) {
            this.sprite.spriteFrame.getTexture().packable = false;
        }
        // 生成并应用材质
        this.material = cc.Material.create(this._effect);
        this.sprite.setMaterial(0, this.material);
        // 更新材质属性
        this.updateProperties();
    }

    /**
     * 更新材质属性
     */
    protected updateProperties() {
        this.material.setProperty('center', this._center);
        this.material.setProperty('strength', this._strength);
    }

    /**
     * 节点尺寸
     */
    protected get nodeSize() {
        return cc.v2(this.node.width, this.node.height);
    }

}
