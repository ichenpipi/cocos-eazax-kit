const { ccclass, executionOrder, menu } = cc._decorator;

@ccclass
@executionOrder(-1)
@menu('eazax/其他组件/PersistNode')
export default class PersistNode extends cc.Component {

    /**
     * 生命周期：加载
     */
    protected onLoad() {
        this.node.setParent(cc.director.getScene());
        cc.game.addPersistRootNode(this.node);
    }

}
