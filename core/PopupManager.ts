import PopupBase from "../components/popups/PopupBase";

/**
 * 弹窗管理器
 * @see PopupManager.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/PopupManager.ts
 */
export default class PopupManager {

    /** 预制表 */
    private static prefabMap: Map<string, cc.Prefab> = new Map<string, cc.Prefab>();

    /** 节点表 */
    private static nodeMap: Map<string, cc.Node> = new Map<string, cc.Node>();

    /** 等待队列 */
    public static get queue() { return this._queue; }
    private static _queue: PopupRequest[] = [];

    /** 当前弹窗 */
    public static get curPopup() { return this._curPopup; }
    private static _curPopup: PopupRequest = null;

    /** 弹窗动态加载开始回调 */
    public static loadStartCallback: Function = null;

    /** 弹窗动态加载结束回调 */
    public static loadFinishCallback: Function = null;

    /**
     * 展示弹窗
     * @param path 弹窗预制体相对路径（如：prefabs/popup）
     * @param options 弹窗选项
     * @param mode 回收模式
     * @param priority 是否优先展示
     */
    public static async show(path: string, options: any = null, mode: PopupRecycleMode = PopupRecycleMode.Temporary, priority: boolean = false): Promise<boolean> {
        if (this._curPopup) {
            this.push(path, options, mode, priority);
            cc.log('[PopupManager]', '弹窗已加入等待队列', this._queue);
            return false;
        }

        return new Promise(async res => {
            this._curPopup = { path, options, mode };

            let node: cc.Node = null;
            // let curMode: PopupRecycleMode = null;

            // 先在缓存中查找
            if (this.prefabMap.has(path)) {
                // 从预制表中获取
                const prefab = this.prefabMap.get(path);
                if (cc.isValid(prefab)) node = cc.instantiate(prefab);
                else this.prefabMap.delete(path);
                // curMode = PopupRecycleMode.Temporary;
            } else if (this.nodeMap.has(path)) {
                // 从节点表中获取
                node = this.nodeMap.get(path);
                if (!cc.isValid(node)) this.nodeMap.delete(path);
                // curMode = PopupRecycleMode.Frequent;
            }

            // 动态加载资源
            if (!cc.isValid(node)) {
                // 建议在动态加载时添加加载提示并屏蔽用户点击，避免多次点击
                // 如：PopupManager.loadStartCallback = () => LoadingTip.show();
                this.loadStartCallback && this.loadStartCallback();
                await new Promise(res => {
                    cc.resources.load(path, (error: Error, prefab: cc.Prefab) => {
                        if (!error) {
                            node = cc.instantiate(prefab);
                            this.prefabMap.set(path, prefab);
                        }
                        res();
                    });
                });
                // 加载完成后隐藏加载提示
                // 如：PopupManager.loadFinishCallback = () => LoadingTip.hide();
                this.loadFinishCallback && this.loadFinishCallback();
            }

            // 加载失败（一般是路径错误导致的）
            if (!cc.isValid(node)) {
                this._curPopup = null;
                cc.warn('[PopupManager]', '弹窗加载失败', path);
                return res(false);
            }

            // 添加到场景中
            node.setParent(cc.Canvas.instance.node);
            node.setSiblingIndex(cc.macro.MAX_ZINDEX);

            // 获取继承于 PopupBase 的弹窗组件
            const popup = node.getComponent(PopupBase);
            if (popup) {
                // 设置完成回调
                popup.setFinishCallback(() => {
                    this._curPopup = null;
                    res(true);
                    this.recycle(path, node, mode);
                    this.next();
                });
                popup.show(options);
            } else {
                // 没有 PopupBase 组件则直接打开节点
                node.active = true;
                res(true);
            }
        });
    }

    /**
     * 展示等待队列中的下一个弹窗
     */
    public static next() {
        if (this._curPopup || this._queue.length === 0) return;
        const request = this._queue.shift();
        this.show(request.path, request.options, request.mode);
    }

    /**
     * 回收弹窗
     * @param path 弹窗路径
     * @param node 弹窗节点
     * @param mode 回收模式
     */
    private static recycle(path: string, node: cc.Node, mode: PopupRecycleMode) {
        switch (mode) {
            case PopupRecycleMode.OneTime:
                node.destroy();
                break;
            case PopupRecycleMode.Temporary:
                node.destroy();
                break;
            case PopupRecycleMode.Frequent:
                this.nodeMap.set(path, node);
                node.removeFromParent(false);
                break;
        }
    }

    /**
     * 添加一个弹窗请求到等待队列中，如果当前没有展示中的弹窗则直接展示该弹窗。
     * @param path 弹窗预制体相对路径（如：prefabs/popup）
     * @param options 弹窗选项
     * @param mode 回收模式
     * @param priority 是否优先展示
     */
    public static push(path: string, options: any = null, mode: PopupRecycleMode = PopupRecycleMode.Temporary, priority: boolean = false) {
        if (!this._curPopup) {
            this.show(path, options, mode);
            return;
        }

        if (priority) {
            this._queue.unshift({ path, options, mode });
        } else {
            this._queue.push({ path, options, mode });
        }
    }

    // /**
    //  * 释放弹窗以及资源
    //  * @param path 弹窗路径
    //  */
    // private release(path: string) {
    //     // TODO
    // }

}

/** 弹窗请求 */
export interface PopupRequest {
    /** 弹窗预制体相对路径 */
    path: string;
    /** 弹窗选项 */
    options: any;
    /** 优化模式 */
    mode: PopupRecycleMode,
}

/** 弹窗回收模式 */
export enum PopupRecycleMode {
    /** 一次性（立即销毁，不保留预制体） */
    OneTime = 1,
    /** 偶尔（立即销毁，保留预制体） */
    Temporary = 2,
    /** 频繁（关闭节点，保留预制体） */
    Frequent = 3
}
