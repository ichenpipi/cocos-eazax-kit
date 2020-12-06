import PopupBase from "./PopupBase";

const { ccclass, property } = cc._decorator;

/**
 * 确认弹窗（PopupBase 使用示例）
 */
@ccclass
export default class ConfirmPopup extends PopupBase<ConfirmPopupOptions> {

    @property(cc.Label)
    private titleLabel: cc.Label = null;

    @property(cc.Label)
    private contentLabel: cc.Label = null;

    @property(cc.Node)
    private confirmBtn: cc.Node = null;

    protected onLoad() {
        this.registerEvent();
    }

    protected onDestroy() {
        this.unregisterEvent();
    }

    private registerEvent() {
        this.confirmBtn.on(cc.Node.EventType.TOUCH_END, this.onConfirmBtnClick, this);
    }

    private unregisterEvent() {
        this.confirmBtn.targetOff(this);
    }

    protected init() {

    }

    protected updateDisplay(options: ConfirmPopupOptions): void {
        this.titleLabel.string = options.title;
        this.contentLabel.string = options.content;
    }

    protected onConfirmBtnClick() {
        this.options.confirmCallback && this.options.confirmCallback();
        this.hide();
    }

}

/** 确认弹窗选项 */
export interface ConfirmPopupOptions {
    title: string;
    content: string;
    confirmCallback: Function;
}
