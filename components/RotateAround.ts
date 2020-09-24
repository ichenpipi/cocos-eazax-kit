/** 轴 */
export enum Axis {
    /** 正 X 轴 */
    PositiveX,
    /** 正 Y 轴 */
    PositiveY,
    /** 负 X 轴 */
    NegativeX,
    /** 负 Y 轴 */
    NegativeY
}

const { ccclass, property } = cc._decorator;

/**
 * 围绕旋转组件
 * @see RotateAround.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/RotateAround.ts
 */
@ccclass
export default class RotateAround extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '围绕旋转的目标' })
    public target: cc.Node = null;

    @property({ tooltip: CC_DEV && '顺时针旋转' })
    public clockwise: boolean = true;

    @property({ tooltip: CC_DEV && '旋转一圈花费的时间' })
    public timePerRound: number = 10;

    @property({ tooltip: CC_DEV && '是否始终面向目标节点' })
    public faceToTarget: boolean = false;

    @property({
        type: cc.Enum(Axis),
        tooltip: CC_DEV && '面向目标节点的轴：\n- PositiveX：正 X 轴\n- PositiveY：正 Y 轴\n- NegativeX：负 X 轴\n- NegativeY：负 Y 轴',
        visible() { return this.faceToTarget }
    })
    public faceAxis: Axis = Axis.NegativeY;

    @property({ tooltip: CC_DEV && '自动开始旋转' })
    public autoStart: boolean = false;

    public angle: number = 0; // 角度

    public radius: number = 0; // 半径

    private isRotating: boolean = false; // 标志位，是否正在旋转

    protected start() {
        if (this.autoStart) this.run();
    }

    protected update(dt: number) {
        if (!this.isRotating || !this.target) return;
        // 将角度转换为弧度
        let radian = (Math.PI / 180) * this.angle;
        // 更新节点的位置
        this.node.x = this.target.x + this.radius * Math.cos(radian);
        this.node.y = this.target.y + this.radius * Math.sin(radian);
        // 更新节点的角度
        if (this.faceToTarget) {
            switch (this.faceAxis) {
                case Axis.PositiveX:
                    this.node.angle = this.angle + 180;
                    break;
                case Axis.PositiveY:
                    this.node.angle = this.angle + 90;
                    break;
                case Axis.NegativeX:
                    this.node.angle = this.angle;
                    break;
                case Axis.NegativeY:
                    this.node.angle = this.angle - 90;
                    break;
            }
        }
        // 计算下一帧的角度
        let anglePerFrame = dt * (360 / this.timePerRound);
        if (this.clockwise) this.angle -= anglePerFrame;
        else this.angle += anglePerFrame;
        // 重置角度，避免数值过大
        if (this.angle >= 360) this.angle %= 360;
        else if (this.angle <= -360) this.angle %= -360;
    }

    /**
     * 开始围绕目标节点旋转
     * @param target 目标节点
     * @param clockwise 是否顺时针旋转
     * @param timePerRound 旋转一圈的时间
     * @param faceToTarget 是否始终面向目标节点
     * @param faceAxis 面向目标节点的轴
     */
    public run(target?: cc.Node, clockwise?: boolean, timePerRound?: number, faceToTarget?: boolean, faceAxis?: Axis) {
        if (target) this.target = target;
        if (clockwise) this.clockwise = clockwise;
        if (timePerRound) this.timePerRound = timePerRound;
        if (faceToTarget) this.faceToTarget = faceToTarget;
        if (faceAxis) this.faceAxis = faceAxis;
        if (!this.target) return cc.log('No target!');
        // 计算初始角度和半径
        this.angle = this.getAngle(this.target.getPosition(), this.node.getPosition());
        this.radius = this.getDistance(this.target.getPosition(), this.node.getPosition());
        // 开始
        this.isRotating = true;
    }

    /**
     * 停止旋转
     */
    public stop() {
        this.isRotating = false;
    }

    /**
     * 获取两点间的角度
     * @param p1 点1
     * @param p2 点2
     * @see MathUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/MathUtil.ts
     */
    public getAngle(p1: cc.Vec2, p2: cc.Vec2): number {
        return Math.atan((p2.y - p1.y) / (p2.x - p1.x));
    }

    /**
     * 获取两点间的距离
     * @param p1 点1
     * @param p2 点2
     * @see MathUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/MathUtil.ts
     */
    public getDistance(p1: cc.Vec2, p2: cc.Vec2): number {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

}
