import EditorAsset from "../../misc/EditorAsset";

const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple } = cc._decorator;

/**
 * 马赛克 Shader 组件，该组件需要对应的 Effect 才能正常使用！
 * @see Mosaic.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/Mosaic.ts
 * @see eazax-mosaic.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-mosaic.effect
 * @version 20210603
 */
@ccclass
@requireComponent(cc.Sprite)
@executeInEditMode
@disallowMultiple
export default class Mosaic extends cc.Component {

    @property
    protected _effect: cc.EffectAsset = null;
    @property({ type: cc.EffectAsset, tooltip: CC_DEV && 'Effect 资源' })
    public get effect() {
        return this._effect;
    }
    public set effect(value: cc.EffectAsset) {
        this._effect = value;
        this.init();
    }

    @property
    protected _tileSize: cc.Vec2 = new cc.Vec2(5, 5);
    @property({ tooltip: CC_DEV && '马赛克尺寸' })
    public get tileSize() {
        return this._tileSize;
    }
    public set tileSize(value: cc.Vec2) {
        this._tileSize = value;
        this.updateProperties();
    }

    protected sprite: cc.Sprite = null;

    protected material: cc.Material = null;

    protected onEnable() {
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
         * 依赖于 EditorAsset 模块，没有该模块请将此代码块以及顶部导入语句去除
         * @see EditorAsset.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/misc/EditorAsset.ts
         */
        if (CC_EDITOR && !this._effect) {
            await new Promise<void>(res => {
                const path = 'eazax-ccc/resources/effects/eazax-mosaic.effect';
                EditorAsset.load(path, 'effect', (err: Error, result: cc.EffectAsset) => {
                    if (err) {
                        cc.warn(`[${this['__proto__']['__classname__']}]`, '请手动指定组件的 Effect 资源！');
                    } else {
                        this._effect = result;
                    }
                    res();
                });
            });
        }
        if (!this._effect) return;

        // 使用自定义 Effect 需禁用纹理的 packable 属性（因为动态合图之后无法正确获取纹理 UV 坐标）
        // 详情请看：https://docs.cocos.com/creator/manual/zh/asset-workflow/sprite.html#packable
        const sprite = this.sprite = this.node.getComponent(cc.Sprite);
        if (sprite.spriteFrame) {
            sprite.spriteFrame.getTexture().packable = false;
        }
        // 生成并应用材质
        if (!this.material) {
            this.material = cc.Material.create(this._effect);
        }
        sprite.setMaterial(0, this.material);
        // 更新材质属性
        this.updateProperties();
    }

    /**
     * 更新材质属性
     */
    public updateProperties() {
        if (!this.material) return
        this.material.setProperty('nodeSize', this.getNodeSize());
        this.material.setProperty('tileSize', this._tileSize);
    }

    /**
     * 获取节点尺寸
     */
    public getNodeSize() {
        return cc.v2(this.node.width, this.node.height)
    }

}
