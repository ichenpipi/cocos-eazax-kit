
const { ccclass, property } = cc._decorator;

@ccclass
export default class ConfirmBox extends cc.Component {

    @property(cc.Node)
    private main: cc.Node = null;

    @property(cc.Node)
    private confirmBtnNode: cc.Node = null;

    private callback: Function = null;

    private static instance: ConfirmBox = null;

    protected onLoad() {
        ConfirmBox.instance = this;

        this.confirmBtnNode.on('touchend', this.onConfirmBtnClick, this);
    }

    public static show(callback?: Function) {
        this.instance.callback = callback;
        this.instance.main.active = true;
    }

    public static hide() {
        this.instance.main.active = false;
    }

    public onConfirmBtnClick() {
        if (this.callback) this.callback();
        ConfirmBox.hide();
    }

    protected onDestroy() {
        this.confirmBtnNode.off('touchend', this.onConfirmBtnClick, this);
    }

}
