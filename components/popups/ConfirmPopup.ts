import PopupBase from "./PopupBase";

const { ccclass, property } = cc._decorator;

/**
 * 确认弹窗（PopupBase 使用示例）
 */
@ccclass
export default class ConfirmPopup extends PopupBase<Options> {

    @property(cc.Node)
    private confirmBtn: cc.Node = null;

    protected onLoad() {
        this.registerEvents();
    }

    protected onDestroy() {
        this.unregisterEvents();
    }

    private registerEvents() {
        this.confirmBtn.on(cc.Node.EventType.TOUCH_END, this.onConfirmBtnClick, this);
    }

    private unregisterEvents() {
        this.confirmBtn.off(cc.Node.EventType.TOUCH_END, this.onConfirmBtnClick, this);
    }

    protected updateDisplay(options: Options): void {

    }

    public onConfirmBtnClick() {
        this.options.confirmCallback && this.options.confirmCallback();
        this.hide();
    }

}

interface Options {
    confirmCallback: Function;
}
