import LocalizationBase from "./LocalizationBase";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Label)
export default class LocalizationLabelString extends LocalizationBase<string> {

    @property()
    private cn: string = '';

    @property()
    private eng: string = '';

    private label: cc.Label = null;

    protected onLoad() {
        super.onLoad();

        this.label = this.node.getComponent(cc.Label);
    }

    protected onLangChange() {
        if (this.label) this.label.string = this.get();
    }
}
