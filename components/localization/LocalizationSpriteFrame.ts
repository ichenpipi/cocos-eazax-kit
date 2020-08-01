import LocalizationBase from "./LocalizationBase";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
export default class LocalizationSpriteFrame extends LocalizationBase<cc.SpriteFrame> {

    @property(cc.SpriteFrame)
    private cn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private eng: cc.SpriteFrame = null;

    private sprite: cc.Sprite = null;

    protected onLoad() {
        super.onLoad();

        this.sprite = this.node.getComponent(cc.Sprite);
    }

    protected onLangChange() {
        if (this.sprite) this.sprite.spriteFrame = this.get();
    }
}
