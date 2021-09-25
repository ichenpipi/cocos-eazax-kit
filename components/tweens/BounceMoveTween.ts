const { ccclass, property } = cc._decorator;

/**
 * 弹性移动效果
 * @author 陈皮皮 (ifaswind)
 * @version 20201014
 * @see BounceMoveTween.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/tweens/BounceMoveTween.ts
 */
@ccclass
export default class BounceMoveTween extends cc.Component {

    @property({ tooltip: CC_DEV && '频率（弹跳次数）' })
    public frequency: number = 4;

    @property({ tooltip: CC_DEV && '衰退指数' })
    public decay: number = 2;

    private tween: cc.Tween = null;

    start() {
        this.play(cc.v2(0, 0), 0.5)
    }

    /**
     * 播放
     * @param targetPos 目标位置
     * @param time 移动时间
     */
    public play(targetPos: cc.Vec2, time: number) {
        this.stop();
        // 当前位置
        const curPos = this.node.getPosition();
        // 方向
        const direction = targetPos.sub(curPos).normalize();
        // 时长
        const bouncingTime = 0.75;  // 弹跳时长
        // 振幅
        const amplitude = cc.Vec2.distance(curPos, targetPos) / time;
        // 播放
        this.tween = cc.tween(this.node)
        cc.tween(this.node)
            .to(time, { x: targetPos.x, y: targetPos.y }, { easing: 'quadIn' })
            .to(bouncingTime, {
                position: {
                    value: cc.v3(targetPos.x, targetPos.y),
                    progress: (start: cc.Vec3, end: cc.Vec3, current: cc.Vec3, t: number) => {
                        const pos = direction.mul(-this.getDifference(amplitude, t));
                        return cc.v3(pos.x, pos.y);
                    }
                }
            })
            .start();
    }

    /**
     * 停止
     */
    public stop() {
        this.tween && this.tween.stop();
    }

    /**
     * 获取目标时刻弹性幅度
     * @param amplitude 幅度
     * @param time 时间
     */
    private getDifference(amplitude: number, time: number) {
        // 角速度（ω=2nπ）
        const angularVelocity = this.frequency * Math.PI * 2;
        return amplitude * (Math.sin(time * angularVelocity) / Math.exp(this.decay * time) / angularVelocity);
    }

}
