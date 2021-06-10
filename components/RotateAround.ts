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
 * @version 20210611
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

    /** 相对于目标的角度 */
    public angle: number = 0;

    /** 半径 */
    public radius: number = 0;

    /** 标志位，是否正在旋转 */
    protected isRotating: boolean = false;

    protected start() {
        this.autoStart && this.run();
    }

    protected update(dt: number) {
        if (!this.isRotating || !this.target) {
            return;
        }
        // 将角度转换为弧度
        let angle = this.angle;
        const radian = (Math.PI / 180) * angle;
        // 更新节点的位置
        const node = this.node,
            target = this.target,
            radius = this.radius;
        node.x = target.x + radius * Math.cos(radian);
        node.y = target.y + radius * Math.sin(radian);
        // 更新节点的角度
        if (this.faceToTarget) {
            switch (this.faceAxis) {
                case Axis.PositiveX:
                    node.angle = angle + 180;
                    break;
                case Axis.PositiveY:
                    node.angle = angle + 90;
                    break;
                case Axis.NegativeX:
                    node.angle = angle;
                    break;
                case Axis.NegativeY:
                    node.angle = angle - 90;
                    break;
            }
        }
        // 计算下一帧的角度
        const anglePerFrame = dt * (360 / this.timePerRound);
        angle = this.angle += (this.clockwise ? -anglePerFrame : anglePerFrame);
        // 重置角度，避免数值过大
        if (angle >= 720) {
            this.angle %= 360;
        } else if (angle <= -720) {
            this.angle %= -360;
        }
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
        if (target != undefined) this.target = target;
        if (clockwise != undefined) this.clockwise = clockwise;
        if (timePerRound != undefined) this.timePerRound = timePerRound;
        if (faceToTarget != undefined) this.faceToTarget = faceToTarget;
        if (faceAxis != undefined) this.faceAxis = faceAxis;
        if (!this.target) {
            cc.warn('[RotateAround]', 'No target!');
            return;
        }
        // 计算初始角度和半径
        const p1 = this.target.getPosition(),
            p2 = this.node.getPosition();
        this.angle = this.getAngle(p1, p2);
        this.radius = this.getDistance(p1, p2);
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
