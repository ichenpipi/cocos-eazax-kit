const { ccclass, property, executeInEditMode, disallowMultiple, requireComponent } = cc._decorator;

/** 波浪方向 */
export enum WaveDirection {

    /** 左 */
    Left = 1,

    /** 右 */
    Right
}

/**
 * 波浪 Shader 组件，该组件需要对应的 Effect 才能正常使用！
 * @see https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-wave.effect
 */
@ccclass
@requireComponent(cc.Sprite)
@executeInEditMode
@disallowMultiple
export default class Wave extends cc.Component {

    @property private _amplitude: number = 0.05;
    @property({ tooltip: CC_DEV && '振幅（比例）' })
    public get amplitude() { return this._amplitude; }
    public set amplitude(value: number) { this._amplitude = value; this.updateProperties(); }

    @property private _frequency: number = 10;
    @property({ tooltip: CC_DEV && '频率' })
    public get frequency() { return this._frequency; }
    public set frequency(value: number) { this._frequency = value; this.updateProperties(); }

    @property private _angularVelocity: number = 10;
    @property({ tooltip: CC_DEV && '角速度' })
    public get angularVelocity() { return this._angularVelocity; }
    public set angularVelocity(value: number) { this._angularVelocity = value; this.updateProperties(); }

    @property private _height: number = 0.5;
    @property({ tooltip: CC_DEV && '顶端高度（比例）' })
    public get height() { return this._height; }
    public set height(value: number) { this._height = value; this.updateProperties(); }

    @property private _direction: WaveDirection = WaveDirection.Left;
    @property({ type: cc.Enum(WaveDirection), tooltip: CC_DEV && '波浪方向' })
    public get direction() { return this._direction; }
    public set direction(value: WaveDirection) { this._direction = value; this.updateProperties(); }

    /** 材质 */
    private material: cc.Material = null;

    protected onLoad() {
        // 使用自定义 Effect 需禁用目标贴图的 packable 属性，因为动态合图后无法正确计算纹理 uv
        // 详情请看：https://docs.cocos.com/creator/manual/zh/asset-workflow/sprite.html#packable
        const spriteFrame = this.getComponent(cc.Sprite).spriteFrame;
        if (spriteFrame) spriteFrame.getTexture().packable = false;

        // 初始化
        this.init();
    }

    protected start() {
        this.updateProperties();
    }

    /**
     * 初始化
     */
    public init() {
        this.material = this.getComponent(cc.Sprite).getMaterial(0);
    }

    /**
     * 更新属性
     */
    public updateProperties() {
        // 检测数值有效性
        if (this._amplitude < 0) this._amplitude = 0; else if (this._amplitude > 0.5) this._amplitude = 0.5;
        if (this._height < 0) this._height = 0; else if (this._height > 1) this._height = 1;
        // 赋值
        this.material.setProperty('amplitude', this._amplitude);
        this.material.setProperty('frequency', this._frequency);
        this.material.setProperty('angularVelocity', this._angularVelocity);
        this.material.setProperty('height', this._height);
        this.material.setProperty('toRight', this._direction === WaveDirection.Right);
    }

}
