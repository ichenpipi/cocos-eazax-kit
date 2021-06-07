import EditorAsset from "../../misc/EditorAsset";

const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple } = cc._decorator;

/**
 * 马赛克 Shader 组件，该组件需要对应的 Effect 才能正常使用！
 * @see Mosaic.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/Mosaic.ts
 * @see eazax-mosaic.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-mosaic.effect
 * @version 20210607
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
    protected _width: number = 5;
    @property({ tooltip: CC_DEV && '马赛克宽度' })
    public get width() {
        return this._width;
    }
    public set width(value: number) {
        this._width = value;
        this.updateProperties();
    }

    @property
    protected _height: number = 5;
    @property({ tooltip: CC_DEV && '马赛克高度' })
    public get height() {
        return this._height;
    }
    public set height(value: number) {
        this._height = value;
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
        this.material.setProperty('nodeSize', this.nodeSize);
        this.material.setProperty('tileSize', this.tileSize);
    }

    /**
     * 设置马赛克尺寸
     * @param width 宽
     * @param height 高
     */
    public set(width: number, height?: number) {
        this._width = width;
        this._height = height || width;
        this.updateProperties();
    }

    /**
     * 缓动至目标尺寸
     * @param width 宽
     * @param height 高
     * @param duration 时长
     */
    public to(width: number, height: number, duration: number) {
        return new Promise<void>(res => {
            cc.tween<Mosaic>(this)
                .to(duration, { width: width, height: height })
                .call(res)
                .start();
        });
    }

    /**
     * 节点尺寸
     */
    public get nodeSize() {
        return cc.v2(this.node.width, this.node.height);
    }

    /**
     * 马赛克尺寸
     */
    public get tileSize() {
        return cc.v2(this._width, this._height);
    }

}
