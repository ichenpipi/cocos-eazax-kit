import BaseAssembler from "../../core/renderer/BaseAssembler";

const { ccclass, property, executeInEditMode, disallowMultiple, help, menu } = cc._decorator;

/**
 * 纹理渲染器（包含缩放和偏移属性）
 * @author 陈皮皮 (ifaswind)
 * @version 20220228
 * @see TextureWithTilingOffset.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/renderers/TextureWithTilingOffset.ts
 * @see BaseAssembler.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/renderer/BaseAssembler.ts
 * @see eazax-sprite-tiling-offset.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-sprite-tiling-offset.effect
 */
@ccclass
@executeInEditMode
@disallowMultiple
@help('https://gitee.com/ifaswind/eazax-ccc/blob/master/components/renderers/TextureWithTilingOffset.ts')
@menu('eazax/渲染组件/BaseTextureRenderer')
export default class TextureWithTilingOffset extends cc.RenderComponent {

    // 隐藏 RenderComponent 的 materials 属性
    @property({ override: true, visible: false })
    protected get materials() {
        return this._materials;
    }
    protected set materials(value) {
        this._materials = value;
        this._activateMaterial();
    }

    @property()
    protected _material: cc.Material = null;
    @property({ type: cc.Material, tooltip: CC_DEV && '材质' })
    public get material() {
        return this._material;
    }
    public set material(value) {
        this._material = value;
        this._activateMaterial();
    }

    @property()
    protected _texture: cc.Texture2D = null;
    @property({ type: cc.Texture2D, tooltip: CC_DEV && '纹理' })
    public get texture() {
        return this._texture;
    }
    public set texture(value) {
        this._texture = value;
        this._activateMaterial();
    }

    @property()
    protected _tilingOffset: cc.Vec4 = new cc.Vec4(1, 1, 0, 0);

    @property({ type: cc.Vec2, tooltip: CC_DEV && '纹理缩放' })
    public get tiling() {
        return new cc.Vec2(this._tilingOffset.x, this._tilingOffset.y);
    }
    public set tiling(value) {
        this._tilingOffset.x = value.x;
        this._tilingOffset.y = value.y;
        this._updateMaterial();
    }

    @property({ type: cc.Vec2, tooltip: CC_DEV && '纹理偏移' })
    public get offset() {
        return new cc.Vec2(this._tilingOffset.z, this._tilingOffset.w);
    }
    public set offset(value) {
        this._tilingOffset.z = value.x;
        this._tilingOffset.w = value.y;
        this._updateMaterial();
    }

    /**
     * 顶点装配器
     */
    public _assembler: BaseAssembler = null;

    /**
     * 生命周期：启用
     */
    protected onEnable() {
        super.onEnable();
        // 节点
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.setVertsDirty, this);
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);
    }

    /**
     * 生命周期：禁用
     */
    protected onDisable() {
        super.onDisable();
        // 节点
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this.setVertsDirty, this);
        this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);
    }

    /**
     * 重置顶点装配器
     */
    public _resetAssembler() {
        // 装配器
        this._assembler = new BaseAssembler();
        this._assembler.init(this);
        // 标记更新顶点数据
        this.setVertsDirty();
    }

    /**
     * 激活材质
     */
    public _activateMaterial() {
        if (this._material) {
            this._materials[0] = cc.MaterialVariant.create(this._material, this);
        }
        this._updateMaterial();
    }

    /**
     * 更新材质属性
     */
    public _updateMaterial() {
        if (this._texture && this._materials[0]) {
            const material = this._materials[0];
            // 启用 USE_TEXTURE 宏
            if (material.getDefine('USE_TEXTURE') !== undefined) {
                material.define('USE_TEXTURE', true);
            }
            // 填充属性
            material.setProperty('texture', this._texture);
            material.setProperty('tilingOffset', this._tilingOffset);
            // 标记为可渲染状态
            this.markForRender(true);
        } else {
            // 禁用渲染
            this.disableRender();
        }
    }

    /**
     * 验证渲染状态
     */
    public _validateRender() {
        if (!this._texture || !this._materials[0]) {
            this.disableRender();
        }
    }

}
