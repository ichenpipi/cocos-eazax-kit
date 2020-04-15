const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Label)
export default class Counter extends cc.Component {

    @property({ tooltip: CC_DEV && '动作时间' })
    public time: number = 1;

    @property({ tooltip: CC_DEV && '保持数值为整数' })
    public keepInteger: boolean = true;

    private label: cc.Label = null;

    private _value: number = 0;
    /**
     * 数值
     */
    public get value() { return this._value; }
    public set value(value) {
        if (this.keepInteger) value = Math.floor(value);
        this._value = value;
        this.label.string = value.toString();
    }

    private tween: cc.Tween<Counter> = null;

    private lastTarget: number = 0;

    protected onLoad() {
        this.init();
    }

    /**
     * 初始化组件
     */
    private init() {
        this.label = this.getComponent(cc.Label);
        this.value = 0;
    }

    /**
     * 设置数值
     * @param value 数值
     */
    public setValue(value: number) {
        this.value = value;
    }

    /**
     * 设置时间
     * @param time 时间
     */
    public setTime(time: number) {
        this.time = time;
    }

    /**
     * 滚动数值
     * @param target 目标值
     * @param time 时间
     * @param callback 完成回调
     */
    public to(target: number, time: number = null, callback?: () => void): Promise<void> {
        return new Promise<void>(res => {
            if (this.tween) {
                this.tween.stop();
                this.tween = null;
            }
            if (time !== null) {
                this.time = time;
            }
            this.lastTarget = target;
            this.tween = cc.tween<Counter>(this)
                .to(this.time, { value: target })
                .call(() => {
                    callback && callback();
                    this.tween = null;
                    res();
                })
                .start();
        });
    }

    /**
     * 相对滚动数值
     * @param diff 差值
     * @param time 时间
     * @param callback 完成回调
     */
    public by(diff: number, time: number = null, callback?: () => void): Promise<void> {
        return new Promise<void>(res => {
            if (this.tween) {
                this.tween.stop();
                this.tween = null;
                this.value = this.lastTarget;
            }
            if (time !== null) {
                this.time = time;
            }
            this.lastTarget = this.value + diff;
            this.tween = cc.tween<Counter>(this)
                .to(this.time, { value: this.lastTarget })
                .call(() => {
                    callback && callback();
                    this.tween = null;
                    res();
                })
                .start();
        });
    }

}
