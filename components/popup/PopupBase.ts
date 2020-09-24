const { ccclass, property } = cc._decorator;

/**
 * 弹窗基类
 * @see PopupBase.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/popup/PopupBase.ts
 */
@ccclass
export default class PopupBase<Options> extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '背景遮罩' })
    public background: cc.Node = null;

    @property({ type: cc.Node, tooltip: CC_DEV && '弹窗主体' })
    public main: cc.Node = null;

    /** 弹窗动画时间 */
    public animTime: number = 0.3;

    /** 弹窗选项 */
    protected options: Options = null;

    /** 弹窗流程结束回调（注意：该回调为 PopupManager 专用，重写 hide 函数时记得调用该回调） */
    protected finishCallback: Function = null;

    /** 弹窗已打开（子类请重写此函数以实现自定义逻辑） */
    protected onShow(): void { }

    /** 弹窗已关闭（子类请重写此函数以实现自定义逻辑） */
    protected onHide(): void { }

    /**
     * 展示弹窗
     * @param options 弹窗选项
     */
    public show(options?: Options): void {
        // 储存选项参数
        this.options = options;
        // 更新弹窗样式
        this.updateDisplay(options);
        // 初始化节点
        this.background.opacity = 0;
        this.main.scale = 0;
        this.node.active = true;
        // 背景
        this.background.active = true;
        cc.tween(this.background)
            .to(this.animTime * 0.8, { opacity: 200 })
            .start();
        // 主体
        this.main.active = true;
        cc.tween(this.main)
            .to(this.animTime, { scale: 1 }, { easing: 'backOut' })
            .call(() => {
                // 弹窗已打开（动画完毕）
                this.onShow && this.onShow();
            })
            .start();
    }

    /**
     * 隐藏弹窗
     */
    public hide(): void {
        // 背景
        cc.tween(this.background)
            .to(this.animTime, { opacity: 0 })
            .call(() => {
                this.background.active = false;
            })
            .start();
        // 主体
        cc.tween(this.main)
            .to(this.animTime, { scale: 0 }, { easing: 'backIn' })
            .call(() => {
                // 关闭节点
                this.main.active = false;
                this.node.active = false;
                // 弹窗已关闭（动画完毕）
                this.onHide && this.onHide();
                // 弹窗完成回调（该回调为 PopupManager 专用）
                // 注意：重写 hide 函数时记得调用该回调
                if (this.finishCallback) {
                    this.finishCallback();
                    this.finishCallback = null;
                }
            })
            .start();
    }

    /**
     * 更新弹窗样式（子类请重写此函数以实现自定义样式）
     * @param options 弹窗选项
     */
    protected updateDisplay(options: Options): void { }

    /**
     * 设置弹窗完成回调（该回调为 PopupManager 专用）
     * @param callback 回调
     */
    public setFinishCallback(callback: Function): void {
        if (this.finishCallback) return cc.warn('[PopupBase]', '无法重复指定完成回调！');
        this.finishCallback = callback;
    }

}
