const { ccclass, property } = cc._decorator;

/**
 * 弹窗基类
 * @see PopupBase.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/popups/PopupBase.ts
 * @see PopupManager.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/PopupManager.ts
 */
@ccclass
export default class PopupBase<Options = any> extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '背景遮罩' })
    public background: cc.Node = null;

    @property({ type: cc.Node, tooltip: CC_DEV && '弹窗主体' })
    public main: cc.Node = null;

    /** 用于拦截点击的节点 */
    private blocker: cc.Node = null;

    /** 展示和隐藏动画的时长 */
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
     * @param force 是否被强制隐藏
     */
    protected onHide(force: boolean = false): void { }

    /**
     * 展示弹窗
     * @param options 弹窗选项
     * @param time 动画时长
     */
    public show(options?: Options, time: number = this.animTime): Promise<void> {
        return new Promise<void>(res => {
            // 储存选项
            this.options = options || Object.create(null);
            // 开启节点
            const background = this.background, main = this.main;
            this.node.active = true;
            background.active = true;
            main.active = true;
            // 重置节点
            background.opacity = 0;
            main.scale = 0.5;
            main.opacity = 0;
            // 初始化
            this.init(this.options);
            // 更新样式
            this.updateDisplay(this.options);
            // 动画时长为 0 时直接展示
            if (time === 0) {
                background.opacity = 200;
                main.scale = 1;
                main.opacity = 255;
                // 弹窗已完全展示
                res();
                this.onShow && this.onShow();
                return;
            }
            // 播放背景遮罩动画
            cc.tween(background)
                .to(time * 0.8, { opacity: 200 })
                .start();
            // 播放弹窗主体动画
            cc.tween(main)
                .to(time, {
                    scale: 1,
                    opacity: 255
                }, {
                    easing: 'backOut'
                })
                .call(() => {
                    // 弹窗已完全展示
                    res();
                    this.onShow && this.onShow();
                })
                .start();
        });
    }

    /**
     * 隐藏弹窗
     * @param time 动画时长
     * @param force 强制隐藏
     */
    public hide(time: number = this.animTime, force: boolean = false): Promise<void> {
        return new Promise<void>(res => {
            // 动画时长为 0 时直接关闭
            if (time === 0) {
                this.node.active = false;
                // 弹窗已完全隐藏
                this.onHide && this.onHide(force);
                res();
                this.finishCallback && this.finishCallback(force);
                return;
            }
            // 拦截点击事件（避免误操作）
            let blocker = this.blocker;
            if (!blocker) {
                blocker = this.blocker = new cc.Node('blocker');
                blocker.addComponent(cc.BlockInputEvents);
                blocker.setParent(this.node);
                blocker.setContentSize(this.node.getContentSize());
            }
            blocker.active = true;
            // 播放背景遮罩动画
            cc.tween(this.background)
                .delay(time * 0.2)
                .to(time * 0.8, { opacity: 0 })
                .start();
            // 播放弹窗主体动画
            cc.tween(this.main)
                .to(time, {
                    scale: 0.5,
                    opacity: 0
                }, {
                    easing: 'backIn'
                })
                .call(() => {
                    // 取消拦截
                    blocker.active = false;
                    // 关闭节点
                    this.node.active = false;
                    // 弹窗已完全隐藏（动画完毕）
                    this.onHide && this.onHide(force);
                    res();
                    // 弹窗完成回调（该回调为 PopupManager 专用）
                    // 注意：重写 hide 函数时记得调用该回调
                    this.finishCallback && this.finishCallback(force);
                })
                .start();
        });
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
        this.finishCallback = callback;
    }

}
