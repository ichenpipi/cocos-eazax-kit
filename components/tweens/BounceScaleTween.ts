const { ccclass, property } = cc._decorator;

/**
 * 弹性缩放效果
 * @author 陈皮皮 (ifaswind)
 * @version 20201014
 * @see BounceScaleTween.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/tweens/BounceScaleTween.ts
 */
@ccclass
export default class BounceScaleTween extends cc.Component {

    @property({ tooltip: CC_DEV && '频率（弹跳次数）' })
    public frequency: number = 4;

    @property({ tooltip: CC_DEV && '衰退指数' })
    public decay: number = 2;

    @property({ tooltip: CC_DEV && '目标值' })
    public targetScale: number = 1;

    @property({ tooltip: CC_DEV && '效果总时长' })
    public totalTime: number = 1;

    @property({ tooltip: CC_DEV && '播放间隔' })
    public interval: number = 1;

    @property({ tooltip: CC_DEV && '自动播放' })
    public playOnLoad: boolean = false;

    /** 原始缩放值 */
    private originalScale: number = 1;

    private tween: cc.Tween = null;

    protected start() {
        // 记录缩放值
        this.originalScale = this.node.scale;
        // 播放
        if (this.playOnLoad) this.play(this.targetScale);
    }

    /**
     * 播放
     * @param targetScale 目标缩放
     * @param repeatTimes 重复次数
     */
    public play(targetScale: number, repeatTimes?: number) {
        // 重复次数
        const times = (repeatTimes != undefined && repeatTimes > 0) ? repeatTimes : 1;
        // 时长
        const scalingTime = this.totalTime * 0.25;   // 缩放时长
        const bouncingTime = this.totalTime * 0.75;  // 弹跳时长
        // 振幅
        const amplitude = (targetScale - this.originalScale) / scalingTime;
        // 播放
        this.tween = cc.tween(this.node)
            .repeat(times,
                cc.tween()
                    .set({ scale: this.originalScale })
                    .to(scalingTime, { scale: targetScale })
                    .to(bouncingTime, {
                        scale: {
                            value: targetScale,
                            progress: (start: number, end: number, current: number, t: number) => {
                                return end + this.getDifference(amplitude, t);
                            }
                        }
                    })
                    .delay(this.interval)
            )
            .start();
    }

    /**
     * 停止
     */
    public stop() {
        this.tween && this.tween.stop();
        this.node.setScale(this.originalScale);
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
