const { ccclass, property } = cc._decorator;

@ccclass
export default class Subtitle extends cc.Component {

    @property(cc.Label)
    private label: cc.Label = null;

    private static instance: Subtitle = null;

    private queen: string[] = [];

    private curIndex: number = 0;

    private interval: number = 1.5;

    protected onLoad() {
        Subtitle.instance = this;
    }

    /**
     * 打印字幕
     * @param texts 文本
     * @param interval 间隔
     */
    public static print(texts: string[], interval: number = 1.5) {
        this.instance.print(texts, interval);
    }

    /**
     * 清除字幕
     */
    public static clear() {
        this.instance.clear();
    }


    /**
     * 打印字幕
     * @param texts 文本
     * @param interval 间隔
     */
    public print(texts: string[], interval: number = 1.5) {
        if (texts.length === 0) return;
        this.unscheduleAllCallbacks();
        this.queen = texts;
        this.interval = interval;
        this.curIndex = -1;
        this.next();
        // this.schedule(() => this.next(), this.interval, cc.macro.REPEAT_FOREVER, this.interval);
    }

    /**
     * 下一条字幕
     */
    private next() {
        this.curIndex++;
        if (this.curIndex >= this.queen.length) {
            this.unscheduleAllCallbacks();
            return;
        }
        this.label.string = this.queen[this.curIndex];
        this.scheduleOnce(() => this.next(), this.interval);
    }

    /**
     * 清除字幕
     */
    public clear() {
        this.unscheduleAllCallbacks();
        this.queen = [];
        this.curIndex = 0;
        this.label.string = '';
    }

}
