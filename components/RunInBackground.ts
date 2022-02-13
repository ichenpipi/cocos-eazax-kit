const { ccclass, property, executionOrder, help, menu } = cc._decorator;

/**
 * 用于在浏览器后台保持运行
 * @author 陈皮皮 (ifaswind)
 * @version 20220207
 * @see RunInBackground.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/RunInBackground.ts
 */
@ccclass
@executionOrder(-1)
@help('https://gitee.com/ifaswind/eazax-ccc/blob/master/components/RunInBackground.ts')
@menu('eazax/其他组件/RunInBackground')
export default class RunInBackground extends cc.Component {

    @property({ displayName: CC_DEV && '脚本地址', tooltip: CC_DEV && 'Worker 脚本地址' })
    private url: string = '/worker.js';

    /** Worker 实例 */
    private worker: Worker = null;

    /**
     * 生命周期：加载
     */
    protected onLoad() {
        this.init();
        this.registerEvent();
    }

    /**
     * 生命周期：销毁
     */
    protected onDestroy() {
        this.unregisterEvent();
    }

    /**
     * 注册事件
     */
    protected registerEvent() {
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
        document.addEventListener('visibilitychange', this.onVisibilityChange);
    }

    /**
     * 反注册事件
     */
    protected unregisterEvent() {
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }

    /**
     * 初始化
     */
    private init() {
        // 网页调试需要在预览模板目录下放一份 worker.js
        // 如果使用编辑器自带的预览模板，还需要修改脚本地址
        // if (CC_DEBUG) {
        //     this.url = '/app/editor/static/preview-templates/worker.js';
        // }
    }

    /**
     * 页面切换回调
     */
    private onVisibilityChange() {
        // 切换到后台
        if (document.visibilityState === 'hidden') {
            // 确保引擎处于运行状态
            if (cc.game.isPaused()) {
                cc.game.resume();
            }
            // 创建工作线程
            this.worker = new Worker(this.url);
            this.worker.onmessage = () => {
                // 调用 Cocos 引擎主循环
                cc.director['mainLoop']();
            }
        }
        // 切换到前台
        else if (document.visibilityState === 'visible') {
            if (this.worker) {
                this.worker.terminate();
                this.worker = null;
            }
        }
    }

}

/*

以下为 worker.js 脚本内容：

function call(){
    postMessage(1);
    setTimeout('call()', 1000 / 60);
}
call();

*/
