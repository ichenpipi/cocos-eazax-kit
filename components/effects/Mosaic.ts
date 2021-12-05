import EditorAsset from "../../misc/EditorAsset";

const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple } = cc._decorator;

/**
 * 马赛克 Shader 组件，该组件需要对应的 Effect 才能正常使用！
 * @author 陈皮皮 (ifaswind)
 * @version 20211205
 * @see Mosaic.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/Mosaic.ts
 * @see eazax-mosaic.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-mosaic.effect
 */
@ccclass
@requireComponent(cc.Sprite)
@executeInEditMode
@disallowMultiple
export default class Mosaic extends cc.Component {

    @property()
    protected _effect: cc.EffectAsset = null;
    @property({ type: cc.EffectAsset, tooltip: CC_DEV && 'Effect 资源' })
    public get effect() {
        return this._effect;
    }
    public set effect(value: cc.EffectAsset) {
        this._effect = value;
        this.init();
    }

    @property()
    protected _size: cc.Size = new cc.Size(20, 20);
    @property({ tooltip: CC_DEV && '马赛克尺寸' })
    public get size() {
        return this._size;
    }
    public set size(value) {
        this._size = value;
        this.updateProperties();
    }

    /**
     * 输出精灵
     */
    protected sprite: cc.Sprite = null;

    /**
     * 材质
     */
    protected material: cc.Material = null;

    /**
     * 生命周期：组件启用
     */
    protected onEnable() {
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
            const path = 'eazax-ccc/resources/effects/eazax-mosaic.effect';
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
        if (!this.material) {
            this.material = cc.Material.create(this._effect);
        }
        this.sprite.setMaterial(0, this.material);
        // 更新材质属性
        this.updateProperties();
    }

    /**
     * 更新材质属性
     */
    public updateProperties() {
        if (!this.material) return
        this.material.setProperty('resolution', this.resolution);
        this.material.setProperty('tileSize', this.tileSize);
    }

    /**
     * 设置马赛克尺寸
     * @param width 宽
     * @param height 高
     */
    public set(width: number, height?: number) {
        this.size.width = width;
        this.size.height = height ?? width;
        this.updateProperties();
    }

    /**
     * 缓动至目标尺寸
     * @param width 宽
     * @param height 高
     * @param duration 时长
     */
    public to(width: number, height: number, duration?: number) {
        return new Promise<void>(res => {
            if (duration == undefined) {
                duration = height;
                height = width;
            }
            cc.tween<Mosaic>(this)
                .to(duration, { size: cc.size(width, height) })
                .call(res)
                .start();
        });
    }

    /**
     * 分辨率
     */
    public get resolution() {
        return cc.v2(this.node.width, this.node.height);
    }

    /**
     * 马赛克尺寸
     */
    public get tileSize() {
        return cc.v2(this._size.width, this._size.height);
    }

}
