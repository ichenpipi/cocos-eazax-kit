const { ccclass, property } = cc._decorator;

@ccclass
export default class Marquee extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '容器节点' })
    private view: cc.Node = null;

    @property({ type: cc.RichText, tooltip: CC_DEV && '文本组件' })
    private label: cc.RichText = null;

    @property({ tooltip: '文本队列' })
    private texts: string[] = [];

    @property({ tooltip: CC_DEV && '每帧移动的像素' })
    private speed: number = 1;

    @property({ tooltip: CC_DEV && '循环播放' })
    private loop: boolean = false;

    @property({ tooltip: CC_DEV && '自动播放' })
    private playOnLoad: boolean = false;

    private index: number = 0;

    private isPlaying: boolean = false;

    private endCallback: Function = null;

    protected onLoad() {
        this.init();
        this.playOnLoad && this.play(0, this.loop);
    }

    protected update(dt: number) {
        if (!this.isPlaying || this.texts.length === 0) return;
        this.updatePosition();
    }

    private init() {
        this.label.node.anchorX = 0;
        this.setLabel('');
    }

    private updatePosition() {
        this.label.node.x -= this.speed;
        if (this.label.node.x <= -(this.view.width / 2 + this.label.node.width)) this.next();
    }

    private setLabel(text: string) {
        this.label.string = text;
        this.label.node.x = this.view.width / 2;
    }

    private next() {
        this.index++;
        if (this.index >= this.texts.length) {
            if (this.loop) {
                this.index = 0;
                this.setLabel(this.texts[0]);
            } else {
                if (this.endCallback) {
                    this.endCallback();
                    this.endCallback = null;
                }
                this.clean();
            }
        } else {
            this.setLabel(this.texts[this.index]);
        }
    }

    public push(texts: string[]) {
        if (Array.isArray(texts)) this.texts.push(...texts);
        else this.texts.push(texts);
    }

    public play(index: number = 0, loop: boolean = false, callback: Function = null) {
        if (this.texts.length === 0) return;

        this.index = index < this.texts.length ? index : 0;
        this.setLabel(this.texts[this.index]);

        this.loop = loop;
        this.endCallback = callback;

        this.isPlaying = true;
    }

    public stop() {
        this.isPlaying = false;
        this.index = 0;
    }

    public pause() {
        this.isPlaying = false;
    }

    public resume() {
        this.isPlaying = true;
    }

    public clean() {
        this.stop();
        this.index = 0;
        this.texts = [];
        this.endCallback = null;
    }
}
