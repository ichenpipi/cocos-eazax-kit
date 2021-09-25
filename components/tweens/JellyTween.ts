const { ccclass, property } = cc._decorator;

/**
 * 果冻缓动效果
 * @author 陈皮皮 (ifaswind)
 * @version 20201014
 * @see JellyTween.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/tweens/JellyTween.ts
 */
@ccclass
export default class JellyTween extends cc.Component {

    @property({ tooltip: CC_DEV && '频率（弹跳次数）' })
    public frequency: number = 4;

    @property({ tooltip: CC_DEV && '衰退指数' })
    public decay: number = 2;

    @property({ tooltip: CC_DEV && '下压缩放' })
    public pressScale: number = 0.2;

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
        if (this.playOnLoad) this.play();
    }

    /**
     * 播放
     * @param repeatTimes 重复次数
     */
    public play(repeatTimes?: number) {
        // 重复次数
        const times = (repeatTimes != undefined && repeatTimes > 0) ? repeatTimes : 10e8;
        // 时长
        const pressTime = this.totalTime * 0.2;         // 收缩时长
        const scaleBackTime = this.totalTime * 0.15;    // 缩放至原始大小时长
        const bouncingTime = this.totalTime * 0.65;     // 弹动时长
        // 振幅
        const amplitude = this.pressScale / scaleBackTime;
        // 播放
        this.tween = cc.tween(this.node)
            .repeat(times,
                cc.tween()
                    .to(pressTime, { scaleX: this.originalScale + this.pressScale, scaleY: this.originalScale - this.pressScale }, { easing: 'sineOut' })
                    .to(scaleBackTime, { scaleX: this.originalScale, scaleY: this.originalScale })
                    .to(bouncingTime, {
                        scaleX: {
                            value: this.originalScale,
                            progress: (start: number, end: number, current: number, t: number) => {
                                return end - this.getDifference(amplitude, t);
                            }
                        },
                        scaleY: {
                            value: this.originalScale,
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
