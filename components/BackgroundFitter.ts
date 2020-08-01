import { GameEvent } from "../core/GameEvent";
import { VIEW_RESIZE } from "../constants/Events";

const { ccclass } = cc._decorator;

@ccclass
export default class BackgroundFitter extends cc.Component {

    protected onLoad() {
        GameEvent.on(VIEW_RESIZE, this.adapt, this);
    }

    protected start() {
        this.adapt();
    }

    protected onDestroy() {
        GameEvent.off(VIEW_RESIZE, this.adapt, this);
    }

    /**
     * 适配
     */
    private adapt() {
        let screenRatio = cc.winSize.height / cc.winSize.width;
        let designRatio = cc.Canvas.instance.designResolution.height / cc.Canvas.instance.designResolution.width;

        if (screenRatio >= designRatio) {
            let scale = cc.winSize.height / cc.Canvas.instance.designResolution.height;
            this.node.scale = scale;
        } else {
            let scale = cc.winSize.width / cc.Canvas.instance.designResolution.width;
            this.node.scale = scale;
        }

        // cc.log('winSize', cc.winSize)
        // cc.log('visibleSize ', cc.view.getVisibleSize())
        // cc.log('getVisibleSizeInPixel ', cc.view.getVisibleSizeInPixel())
        // cc.log('getFrameSize', cc.view.getFrameSize())
        // cc.log('designResolution', cc.Canvas.instance.designResolution)
    }

}
