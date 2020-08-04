import EditorAsset from "../../misc/EditorAsset";

const { ccclass, property, executeInEditMode, disallowMultiple, requireComponent, executionOrder } = cc._decorator;

export enum Shape {
    Rect = 1,
    Circle
}

@ccclass
@executeInEditMode
@disallowMultiple
@requireComponent(cc.Sprite)
@executionOrder(-100)
export default class HollowOut extends cc.Component {

    @property({
        type: cc.EffectAsset,
        tooltip: CC_DEV && 'Effect 资源',
        readonly: true
    })
    private effect: cc.EffectAsset = null;

    @property({ type: cc.Enum(Shape), tooltip: CC_DEV && '镂空形状' })
    public shape: Shape = Shape.Rect;

    @property({ tooltip: CC_DEV && '中心坐标' })
    public center: cc.Vec2 = cc.v2();

    @property({ tooltip: CC_DEV && '宽', visible() { return this.shape === Shape.Rect; } })
    public width: number = 300;

    @property({ tooltip: CC_DEV && '高', visible() { return this.shape === Shape.Rect; } })
    public height: number = 300;

    @property({ tooltip: CC_DEV && '圆角半径', visible() { return this.shape === Shape.Rect; } })
    public round: number = 1;

    @property({ tooltip: CC_DEV && '半径', visible() { return this.shape === Shape.Circle; } })
    public radius: number = 200;

    @property({ tooltip: CC_DEV && '边缘虚化宽度', visible() { return this.shape === Shape.Circle || this.round > 0; } })
    public feather: number = 0.5;

    @property({ tooltip: CC_DEV && '每帧自动更新' })
    public keepUpdating: boolean = true;

    private material: cc.Material = null; // 材质

    private tweenRes: Function = null; // tween 的 Promise 回调

    private isIniting: boolean = false; // 是否正在初始化

    protected onLoad() {
        // 使用自定义 Effect 需禁用目标贴图的 packable 属性，因为动态合图后无法正确计算纹理 uv
        // 详情请看：https://docs.cocos.com/creator/manual/zh/asset-workflow/sprite.html#packable
        let spriteFrame = this.getComponent(cc.Sprite).spriteFrame;
        if (spriteFrame) spriteFrame.getTexture().packable = false;
        // 或者全局禁用动态合图功能（不推荐！！！）
        // cc.dynamicAtlasManager.enabled = false;

        this.init();
    }

    protected resetInEditor() {
        this.init();
    }

    protected update() {
        if (!this.material || !this.keepUpdating) return;
        this.render(true);
    }

    /**
     * 初始化组件
     */
    private async init() {
        if (this.isIniting) return;
        this.isIniting = true;

        // 编辑器环境下自动绑定 Effect 资源
        // 依赖于 EditorAsset 模块，没有模块请将此代码块以及顶部导入语句注释
        if (CC_EDITOR && !this.effect) {
            await new Promise(res => {
                EditorAsset.load('eazax-ccc/resources/effects/eazax-hollowout.effect', 'effect', (err: Error, result: cc.EffectAsset) => {
                    if (err) cc.warn('请手动指定 HollowOut 组件的 Effect 文件！');
                    else this.effect = result;
                    res();
                });
            });
        }

        if (this.effect) {
            this.material = cc.Material.create(this.effect);
            this.node.getComponent(cc.Sprite).setMaterial(0, this.material);
            this.render(this.keepUpdating);
        }

        this.isIniting = false;
    }

    /**
     * 渲染
     * @param keepUpdating 是否每帧自动更新
     */
    private render(keepUpdating: boolean) {
        switch (this.shape) {
            case Shape.Rect:
                this.rect(this.center, this.width, this.height, this.round, this.feather, keepUpdating);
                break;
            case Shape.Circle:
                this.circle(this.center, this.radius, this.feather, keepUpdating);
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
     * @param keepUpdating 是否每帧自动更新
     */
    public rect(center?: cc.Vec2, width?: number, height?: number, round?: number, feather?: number, keepUpdating: boolean = false) {
        this.shape = Shape.Rect;
        if (center !== null) this.center = center;
        if (width !== null) this.width = width;
        if (height !== null) this.height = height;
        if (round !== null) {
            this.round = round >= 0 ? round : 0;
            let min = Math.min(this.width / 2, this.height / 2);
            this.round = this.round <= min ? this.round : min;
        }
        if (feather !== null) {
            this.feather = feather >= 0 ? feather : 0;
            this.feather = this.feather <= this.round ? this.feather : this.round;
        }

        this.material.setProperty('size', this.getNodeSize());
        this.material.setProperty('center', this.getCenter(this.center));
        this.material.setProperty('width', this.getWidth(this.width));
        this.material.setProperty('height', this.getHeight(this.height));
        this.material.setProperty('round', this.getRound(this.round));
        this.material.setProperty('feather', this.getFeather(this.feather));

        this.keepUpdating = keepUpdating;
    }

    /**
     * 圆形镂空
     * @param center 中心坐标
     * @param radius 半径
     * @param feather 边缘虚化宽度
     * @param keepUpdating 是否每帧自动更新
     */
    public circle(center?: cc.Vec2, radius?: number, feather?: number, keepUpdating: boolean = false) {
        this.shape = Shape.Circle;
        if (center !== null) this.center = center;
        if (radius !== null) this.radius = radius;
        if (feather !== null) this.feather = feather >= 0 ? feather : 0;

        this.material.setProperty('size', this.getNodeSize());
        this.material.setProperty('center', this.getCenter(this.center));
        this.material.setProperty('width', this.getWidth(this.radius * 2));
        this.material.setProperty('height', this.getHeight(this.radius * 2));
        this.material.setProperty('round', this.getRound(this.radius));
        this.material.setProperty('feather', this.getFeather(this.feather));

        this.keepUpdating = keepUpdating;
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
            cc.Tween.stopAllByTarget(this);

            this.tweenRes && this.tweenRes();
            this.tweenRes = res;

            if (round > width / 2) round = width / 2;
            if (round > height / 2) round = height / 2;
            if (feather > round) feather = round;
            this.shape = Shape.Rect;

            cc.tween<HollowOut>(this)
                .call(() => this.keepUpdating = true)
                .to(time, {
                    center: center,
                    width: width,
                    height: height,
                    round: round,
                    feather: feather
                })
                .call(() => {
                    this.scheduleOnce(() => {
                        this.keepUpdating = false;
                        this.tweenRes();
                        this.tweenRes = null;
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
            cc.Tween.stopAllByTarget(this);

            this.tweenRes && this.tweenRes();
            this.tweenRes = res;

            this.shape = Shape.Circle;

            cc.tween<HollowOut>(this)
                .call(() => this.keepUpdating = true)
                .to(time, {
                    center: center,
                    radius: radius,
                    feather: feather
                })
                .call(() => {
                    this.scheduleOnce(() => {
                        this.keepUpdating = false;
                        this.tweenRes();
                        this.tweenRes = null;
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
    public nodeSize() {
        this.rect(this.node.getPosition(), this.node.width, this.node.height, 0, 0);
        this.radius = Math.sqrt(this.node.width * this.node.width + this.node.height * this.node.height) / 2;
    }

    /**
     * 获取中心点
     * @param center 
     */
    private getCenter(center: cc.Vec2) {
        let x = (center.x + (this.node.width / 2)) / this.node.width;
        let y = (-center.y + (this.node.height / 2)) / this.node.height;
        return cc.v2(x, y);
    }

    /**
     * 获取节点尺寸
     */
    private getNodeSize() {
        return cc.v2(this.node.width, this.node.height);
    }

    /**
     * 获取挖孔宽度
     * @param width 
     */
    private getWidth(width: number) {
        return width / this.node.width;
    }

    /**
     * 获取挖孔高度
     * @param height 
     */
    private getHeight(height: number) {
        return height / this.node.width;
    }

    /**
     * 获取圆角半径
     * @param round 
     */
    private getRound(round: number) {
        return round / this.node.width;
    }

    /**
     * 获取边缘虚化宽度
     * @param feather 
     */
    private getFeather(feather: number) {
        return feather / this.node.width;
    }

}
