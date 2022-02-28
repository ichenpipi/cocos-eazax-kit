import BaseAssembler from "../../core/renderer/BaseAssembler";

const { ccclass, property, executeInEditMode, disallowMultiple, help, menu } = cc._decorator;

/**
 * 基础纹理渲染器
 * @author 陈皮皮 (ifaswind)
 * @version 20210228
 * @see BaseTextureRenderer.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/renderers/BaseTextureRenderer.ts
 * @see BaseAssembler.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/renderer/BaseAssembler.ts
 */
@ccclass
@executeInEditMode
@disallowMultiple
@help('https://gitee.com/ifaswind/eazax-ccc/blob/master/components/renderers/BaseTextureRenderer.ts')
@menu('eazax/渲染组件/BaseTextureRenderer')
export default class BaseTextureRenderer extends cc.RenderComponent {

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
        const materials = this._materials;
        if (!materials[0]) {
            materials[0] = this._getDefaultMaterial();
        }
        for (let i = 0; i < materials.length; i++) {
            materials[i] = cc.MaterialVariant.create(materials[i], this);
        }
        this._updateMaterial();
    }

    /**
     * 更新材质属性
     */
    public _updateMaterial() {
        const texture = this._texture;
        if (texture) {
            const material = this.getMaterial(0);
            if (material) {
                if (material.getDefine('USE_TEXTURE') !== undefined) {
                    material.define('USE_TEXTURE', true);
                }
                material.setProperty('texture', texture);
                // 标记为可渲染状态
                this.markForRender(true);
                return;
            }
        }
        // 禁用渲染
        this.disableRender();
    }

    /**
     * 验证渲染状态
     */
    public _validateRender() {
        if (!this._texture) {
            this.disableRender();
        }
    }

}
