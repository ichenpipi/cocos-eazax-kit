import EditorAsset from "../../misc/EditorAsset";

const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple, executionOrder } = cc._decorator;

/** 波浪方向 */
export enum SineWaveDirection {
    /** 左 */
    Left = 1,
    /** 右 */
    Right
}

/**
 * 正弦波浪 Shader 组件，该组件需要对应的 Effect 才能正常使用！
 * @see SineWave.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/SineWave.ts
 * @see eazax-sine-wave.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-sine-wave.effect
 */
@ccclass
@requireComponent(cc.Sprite)
@executeInEditMode
@disallowMultiple
@executionOrder(-100)
export default class SineWave extends cc.Component {

    @property private _effect: cc.EffectAsset = null;
    @property({ type: cc.EffectAsset, tooltip: CC_DEV && 'Effect 资源', readonly: true })
    public get effect() { return this._effect; }
    public set effect(value: cc.EffectAsset) { this._effect = value; this.init(); }

    @property private _amplitude: number = 0.05;
    @property({ tooltip: CC_DEV && '振幅（节点高度比例）' })
    public get amplitude() { return this._amplitude; }
    public set amplitude(value: number) { this._amplitude = value; this.updateProperties(); }

    @property private _angularVelocity: number = 10;
    @property({ tooltip: CC_DEV && '角速度' })
    public get angularVelocity() { return this._angularVelocity; }
    public set angularVelocity(value: number) { this._angularVelocity = value; this.updateProperties(); }

    @property private _frequency: number = 10;
    @property({ tooltip: CC_DEV && '频率' })
    public get frequency() { return this._frequency; }
    public set frequency(value: number) { this._frequency = value; this.updateProperties(); }

    @property private _height: number = 0.5;
    @property({ tooltip: CC_DEV && '顶端高度（节点高度比例）' })
    public get height() { return this._height; }
    public set height(value: number) { this._height = value; this.updateProperties(); }

    @property private _direction: SineWaveDirection = SineWaveDirection.Left;
    @property({ type: cc.Enum(SineWaveDirection), tooltip: CC_DEV && '波浪方向' })
    public get direction() { return this._direction; }
    public set direction(value: SineWaveDirection) { this._direction = value; this.updateProperties(); }

    private sprite: cc.Sprite = null;

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
         * 依赖于 EditorAsset 模块，没有该模块请将此代码块以及顶部导入语句去除
         * @see EditorAsset.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/misc/EditorAsset.ts
         */
        if (CC_EDITOR && !this._effect) {
            await new Promise(res => {
                EditorAsset.load('eazax-ccc/resources/effects/eazax-sine-wave.effect', 'effect', (err: Error, result: cc.EffectAsset) => {
                    if (err) cc.warn('[SineWave]', '请手动指定组件的 Effect 资源！');
                    else this._effect = result;
                    res();
                });
            });
        }
        if (!this._effect) return;

        // 使用自定义 Effect 需禁用纹理的 packable 属性（因为动态合图之后无法正确获取纹理 UV 坐标）
        // 详情请看：https://docs.cocos.com/creator/manual/zh/asset-workflow/sprite.html#packable
        this.sprite = this.node.getComponent(cc.Sprite);
        if (this.sprite.spriteFrame) this.sprite.spriteFrame.getTexture().packable = false;
        // 生成并应用材质
        this.material = cc.Material.create(this._effect);
        this.sprite.setMaterial(0, this.material);
        // 更新材质属性
        this.updateProperties();
    }

    /**
     * 设置图像
     * @param spriteFrame 精灵
     */
    public setSpriteFrame(spriteFrame: cc.SpriteFrame) {
        this.sprite.spriteFrame = spriteFrame;
        this.sprite.spriteFrame.getTexture().packable = false;
        // 更新材质属性
        this.updateProperties();
    }

    /**
     * 更新材质属性
     */
    public updateProperties() {
        if (!this.effect) return cc.warn('[SineWave]', '请指定 Effect 资源！');
        this.material.setProperty('amplitude', this._amplitude);
        this.material.setProperty('angularVelocity', this._angularVelocity);
        this.material.setProperty('frequency', this._frequency);
        this.material.setProperty('offset', ((1.0 - this._height) + this._amplitude));
        this.material.setProperty('toLeft', (this._direction === SineWaveDirection.Left));
    }

}
