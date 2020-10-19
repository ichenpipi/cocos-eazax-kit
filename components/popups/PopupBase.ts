const { ccclass, property } = cc._decorator;

/**
 * 弹窗基类
 * @see PopupBase.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/popups/PopupBase.ts
 */
@ccclass
export default class PopupBase<Options> extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '背景遮罩' })
    public background: cc.Node = null;

    @property({ type: cc.Node, tooltip: CC_DEV && '弹窗主体' })
    public main: cc.Node = null;

    /** 用于拦截点击的节点 */
    private blocker: cc.Node = null;

    /** 动画时长 */
    public animTime: number = 0.3;

    /** 弹窗选项 */
    protected options: Options = null;

    /** 弹窗流程结束回调（注意：该回调为 PopupManager 专用，重写 hide 函数时记得调用该回调） */
    protected finishCallback: Function = null;

    /**
     * 弹窗已完全展示（子类请重写此函数以实现自定义逻辑）
     */
    protected onShow(): void { }

    /**
     * 弹窗已完全隐藏（子类请重写此函数以实现自定义逻辑）
     */
    protected onHide(): void { }

    /**
     * 展示弹窗
     * @param options 弹窗选项
     */
    public show(options?: Options): void {
        // 储存选项
        this.options = options;
        // 重置节点
        this.background.opacity = 0;
        this.background.active = true;
        this.main.scale = 0;
        this.main.active = true;
        this.node.active = true;
        // 初始化
        this.init(this.options);
        // 更新样式
        this.updateDisplay(this.options);
        // 播放背景动画
        cc.tween(this.background)
            .to(this.animTime * 0.8, { opacity: 200 })
            .start();
        // 播放主体动画
        cc.tween(this.main)
            .to(this.animTime, { scale: 1 }, { easing: 'backOut' })
            .call(() => {
                // 弹窗已完全展示（动画完毕）
                this.onShow();
            })
            .start();
    }

    /**
     * 隐藏弹窗
     */
    public hide(): void {
        // 拦截点击事件
        if (!this.blocker) {
            this.blocker = new cc.Node('blocker');
            this.blocker.addComponent(cc.BlockInputEvents);
            this.blocker.setParent(this.node);
            this.blocker.setContentSize(this.node.getContentSize());
        }
        this.blocker.active = true;
        // 播放背景动画
        cc.tween(this.background)
            .delay(this.animTime * 0.2)
            .to(this.animTime * 0.8, { opacity: 0 })
            .call(() => {
                this.background.active = false;
            })
            .start();
        // 播放主体动画
        cc.tween(this.main)
            .to(this.animTime, { scale: 0 }, { easing: 'backIn' })
            .call(() => {
                // 取消拦截
                this.blocker.active = false;
                // 关闭节点
                this.main.active = false;
                this.node.active = false;
                // 弹窗已完全隐藏（动画完毕）
                this.onHide();
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
     * 初始化（子类请重写此函数以实现自定义逻辑）
     */
    protected init(options: Options): void { }

    /**
     * 更新样式（子类请重写此函数以实现自定义样式）
     * @param options 弹窗选项
     */
    protected updateDisplay(options: Options): void { }

    /**
     * 设置弹窗完成回调（该回调为 PopupManager 专用）
     * @param callback 回调
     */
    public setFinishCallback(callback: Function): void {
        if (this.finishCallback) {
            return cc.warn('[PopupBase]', '无法重复指定完成回调！');
        }
        this.finishCallback = callback;
    }

}
