import EditorAsset from "../../misc/EditorAsset";

const { ccclass, property, requireComponent, executeInEditMode, disallowMultiple, executionOrder } = cc._decorator;

/** 镂空形状 */
export enum HollowOutShape {
    /** 矩形 */
    Rect = 1,
    /** 圆形 */
    Circle
}

/**
 * [Shader] 挖孔组件，该组件需要对应的 Effect 才能正常使用！
 * @author 陈皮皮 (ifaswind)
 * @version 20210429
 * @see HollowOut.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/effects/HollowOut.ts
 * @see eazax-hollowout.effect https://gitee.com/ifaswind/eazax-ccc/blob/master/resources/effects/eazax-hollowout.effect
 */
@ccclass
@requireComponent(cc.Sprite)
@executeInEditMode
@disallowMultiple
@executionOrder(-10)
export default class HollowOut extends cc.Component {

    @property
    protected _effect: cc.EffectAsset = null;
    @property({ type: cc.EffectAsset, tooltip: CC_DEV && 'Effect 资源', readonly: true })
    public get effect() { return this._effect; }
    public set effect(value: cc.EffectAsset) {
        this._effect = value; this.init();
    }

    @property
    protected _shape: HollowOutShape = HollowOutShape.Rect;
    @property({ type: cc.Enum(HollowOutShape), tooltip: CC_DEV && '镂空形状' })
    public get shape() { return this._shape; }
    public set shape(value: HollowOutShape) {
        this._shape = value;
        this.updateProperties();
    }

    @property
    protected _center: cc.Vec2 = cc.v2();
    @property({ tooltip: CC_DEV && '中心坐标' })
    public get center() { return this._center; }
    public set center(value: cc.Vec2) {
        this._center = value;
        this.updateProperties();
    }

    @property
    protected _width: number = 300;
    @property({ tooltip: CC_DEV && '宽', visible() { return this._shape === HollowOutShape.Rect; } })
    public get width() { return this._width; }
    public set width(value: number) {
        this._width = value;
        this.updateProperties();
    }

    @property
    protected _height: number = 300;
    @property({ tooltip: CC_DEV && '高', visible() { return this._shape === HollowOutShape.Rect; } })
    public get height() { return this._height; }
    public set height(value: number) {
        this._height = value;
        this.updateProperties();
    }

    @property
    protected _round: number = 1;
    @property({ tooltip: CC_DEV && '圆角半径', visible() { return this._shape === HollowOutShape.Rect; } })
    public get round() { return this._round; }
    public set round(value: number) {
        this._round = value;
        this.updateProperties();
    }

    @property
    protected _radius: number = 200;
    @property({ tooltip: CC_DEV && '半径', visible() { return this._shape === HollowOutShape.Circle; } })
    public get radius() { return this._radius; }
    public set radius(value: number) {
        this._radius = value;
        this.updateProperties();
    }

    @property
    protected _feather: number = 0.5;
    @property({ tooltip: CC_DEV && '边缘虚化宽度', visible() { return this._shape === HollowOutShape.Circle || this.round > 0; } })
    public get feather() { return this._feather; }
    public set feather(value: number) {
        this._feather = value;
        this.updateProperties();
    }

    protected sprite: cc.Sprite = null;

    protected material: cc.Material = null;

    protected tweenRes: () => void = null;

    protected onLoad() {
        this.init();
    }

    protected resetInEditor() {
        this.init();
    }

    /**
     * 初始化组件
     */
    protected async init() {
        /**
         * 编辑器环境下自动绑定 Effect 资源
         * 依赖于 EditorAsset 模块，没有该模块请将此代码块以及顶部导入语句去除
         * @see EditorAsset.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/misc/EditorAsset.ts
         */
        if (CC_EDITOR && !this._effect) {
            await new Promise<void>(res => {
                const path = 'eazax-ccc/resources/effects/eazax-hollowout.effect';
                EditorAsset.load(path, 'effect', (err: Error, result: cc.EffectAsset) => {
                    if (err) {
                        cc.warn(`[${this['__proto__']['__classname__']}]`, '请手动指定组件的 Effect 资源！');
                        res();
                        return;
                    }
                    this._effect = result;
                    res();
                });
            });
        }
        if (!this._effect) return;

        // 使用自定义 Effect 需禁用纹理的 packable 属性（因为动态合图之后无法正确获取纹理 UV 坐标）
        // 详情请看：https://docs.cocos.com/creator/manual/zh/asset-workflow/sprite.html#packable
        const sprite = this.sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame && (sprite.spriteFrame.getTexture().packable = false);
        // 生成并应用材质
        this.material = cc.Material.create(this._effect);
        sprite.setMaterial(0, this.material);
        // 更新材质属性
        this.updateProperties();
    }

    /**
     * 更新材质属性
     */
    protected updateProperties() {
        switch (this._shape) {
            case HollowOutShape.Rect:
                this.rect(this._center, this._width, this._height, this._round, this._feather);
                break;
            case HollowOutShape.Circle:
                this.circle(this._center, this._radius, this._feather);
                break;
        }
    }

    /**
     * 矩形镂空
     * @param center 中心坐标
     * @param width 宽
     * @param height 高
     * @param round 圆角半径
     * @param feather 边缘虚化宽度
     */
    public rect(center?: cc.Vec2, width?: number, height?: number, round?: number, feather?: number) {
        // 保存类型
        this._shape = HollowOutShape.Rect;
        // 确认参数
        if (center != null) {
            this._center = center;
        }
        if (width != null) {
            this._width = width;
        }
        if (height != null) {
            this._height = height;
        }
        if (round != null) {
            this._round = (round >= 0) ? round : 0;
            const min = Math.min(this._width / 2, this._height / 2);
            this._round = (this._round <= min) ? this._round : min;
        }
        if (feather != null) {
            this._feather = (feather >= 0) ? feather : 0;
            this._feather = (this._feather <= this._round) ? this._feather : this._round;
        }
        // 更新材质
        const material = this.material;
        material.setProperty('size', this.getNodeSize());
        material.setProperty('center', this.getCenter(this._center));
        material.setProperty('width', this.getWidth(this._width));
        material.setProperty('height', this.getHeight(this._height));
        material.setProperty('round', this.getRound(this._round));
        material.setProperty('feather', this.getFeather(this._feather));
    }

    /**
     * 圆形镂空
     * @param center 中心坐标
     * @param radius 半径
     * @param feather 边缘虚化宽度
     */
    public circle(center?: cc.Vec2, radius?: number, feather?: number) {
        // 保存类型
        this._shape = HollowOutShape.Circle;
        // 确认参数
        if (center != null) {
            this._center = center;
        }
        if (radius != null) {
            this._radius = radius;
        }
        if (feather != null) {
            this._feather = (feather >= 0) ? feather : 0;
        }
        // 更新材质
        const material = this.material;
        material.setProperty('size', this.getNodeSize());
        material.setProperty('center', this.getCenter(this._center));
        material.setProperty('width', this.getWidth(this._radius * 2));
        material.setProperty('height', this.getHeight(this._radius * 2));
        material.setProperty('round', this.getRound(this._radius));
        material.setProperty('feather', this.getFeather(this._feather));
    }

    /**
     * 缓动镂空（矩形）
     * @param time 时间
     * @param center 中心坐标
     * @param width 宽
     * @param height 高
     * @param round 圆角半径
     * @param feather 边缘虚化宽度
     */
    public rectTo(time: number, center: cc.Vec2, width: number, height: number, round: number = 0, feather: number = 0): Promise<void> {
        return new Promise(res => {
            // 保存类型
            this._shape = HollowOutShape.Rect;
            // 停止进行中的缓动
            cc.Tween.stopAllByTarget(this);
            this.unscheduleAllCallbacks();
            // 完成上一个期约
            this.tweenRes && this.tweenRes();
            this.tweenRes = res;
            // 确认参数
            round = Math.min(round, width / 2, height / 2);
            feather = Math.min(feather, round);
            // 缓动
            cc.tween<HollowOut>(this)
                .to(time, {
                    center: center,
                    width: width,
                    height: height,
                    round: round,
                    feather: feather
                })
                .call(() => {
                    this.scheduleOnce(() => {
                        if (this.tweenRes) {
                            this.tweenRes();
                            this.tweenRes = null;
                        }
                    });
                })
                .start();
        });
    }

    /**
     * 缓动镂空（圆形）
     * @param time 时间
     * @param center 中心坐标
     * @param radius 半径
     * @param feather 边缘虚化宽度
     */
    public circleTo(time: number, center: cc.Vec2, radius: number, feather: number = 0): Promise<void> {
        return new Promise(res => {
            // 保存类型
            this._shape = HollowOutShape.Circle;
            // 停止进行中的缓动
            cc.Tween.stopAllByTarget(this);
            this.unscheduleAllCallbacks();
            // 完成上一个期约
            this.tweenRes && this.tweenRes();
            this.tweenRes = res;
            // 缓动
            cc.tween<HollowOut>(this)
                .to(time, {
                    center: center,
                    radius: radius,
                    feather: feather
                })
                .call(() => {
                    this.scheduleOnce(() => {
                        if (this.tweenRes) {
                            this.tweenRes();
                            this.tweenRes = null;
                        }
                    });
                })
                .start();
        });
    }

    /**
     * 取消所有挖孔
     */
    public reset() {
        this.rect(cc.v2(), 0, 0, 0, 0);
    }

    /**
     * 挖孔设为节点大小（就整个都挖没了）
     */
    public setNodeSize() {
        const node = this.node,
            width = node.width,
            height = node.height;
        this._radius = Math.sqrt(width ** 2 + height ** 2) / 2;
        this.rect(node.getPosition(), width, height, 0, 0);
    }

    /**
     * 获取中心点
     * @param center 
     */
    protected getCenter(center: cc.Vec2) {
        const node = this.node,
            width = node.width,
            height = node.height;
        const x = (center.x + (width / 2)) / width,
            y = (-center.y + (height / 2)) / height;
        return cc.v2(x, y);
    }

    /**
     * 获取节点尺寸
     */
    protected getNodeSize() {
        return cc.v2(this.node.width, this.node.height);
    }

    /**
     * 获取挖孔宽度
     * @param width 
     */
    protected getWidth(width: number) {
        return width / this.node.width;
    }

    /**
     * 获取挖孔高度
     * @param height 
     */
    protected getHeight(height: number) {
        return height / this.node.width;
    }

    /**
     * 获取圆角半径
     * @param round 
     */
    protected getRound(round: number) {
        return round / this.node.width;
    }

    /**
     * 获取边缘虚化宽度
     * @param feather 
     */
    protected getFeather(feather: number) {
        return feather / this.node.width;
    }

}
