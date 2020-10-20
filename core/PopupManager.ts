import PopupBase from "../components/popups/PopupBase";

/**
 * 弹窗管理器
 * @see PopupManager.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/PopupManager.ts
 */
export default class PopupManager {

    /** 预制体表 */
    private static prefabMap: Map<string, cc.Prefab> = new Map<string, cc.Prefab>();

    /** 节点表 */
    private static nodeMap: Map<string, cc.Node> = new Map<string, cc.Node>();

    /** 缓存模式表 */
    private static modeMap: Map<string, PopupCacheMode> = new Map<string, PopupCacheMode>();

    /** 等待队列 */
    public static get queue() { return this._queue; }
    private static _queue: PopupRequest[] = [];

    /** 当前弹窗 */
    public static get curPopup() { return this._curPopup; }
    private static _curPopup: PopupRequest = null;

    /** 锁定状态（是否已有候选弹窗） */
    private static locked: boolean = false;

    /** 连续展示弹窗的时间间隔（秒） */
    public static interval: number = 0.1;

    /** 弹窗动态加载开始回调 */
    public static loadStartCallback: Function = null;

    /** 弹窗动态加载结束回调 */
    public static loadFinishCallback: Function = null;

    /**
     * 展示弹窗，如果当前已有弹窗在展示中则加入等待队列
     * @param path 弹窗预制体相对路径（如：prefabs/MyPopup）
     * @param options 弹窗选项
     * @param mode 缓存模式
     * @param priority 是否优先展示
     */
    public static show<Options>(path: string, options: Options = null, mode: PopupCacheMode = PopupCacheMode.Occasionally, priority: boolean = false): Promise<boolean> {
        return new Promise(async res => {
            // 当前已有弹窗在展示中则加入等待队列
            if (this._curPopup || this.locked) {
                this.push(path, options, mode, priority);
                res(false);
                return;
            }

            // 保存为当前弹窗，阻止新的弹窗请求
            this._curPopup = { path, options, mode };

            // 先在缓存中获取
            let node = this.getNodeFromCache(path);

            // 缓存中没有，动态加载预制体资源
            if (!cc.isValid(node)) {
                // 建议在动态加载时添加加载提示并屏蔽用户点击，避免多次点击，如下：
                // PopupManager.loadStartCallback = () => {
                //     LoadingTip.show();
                // }
                this.loadStartCallback && this.loadStartCallback();
                // 等待加载
                await new Promise(res => {
                    cc.resources.load(path, (error: Error, prefab: cc.Prefab) => {
                        if (!error) {
                            prefab.addRef();                    // 增加引用计数
                            node = cc.instantiate(prefab);      // 实例化节点
                            this.prefabMap.set(path, prefab);   // 保存预制体
                        }
                        res();
                    });
                });
                // 加载完成后隐藏加载提示，如下：
                // PopupManager.loadFinishCallback = () => {
                //     LoadingTip.hide();
                // }
                this.loadFinishCallback && this.loadFinishCallback();
            }

            // 加载失败（一般是路径错误导致的）
            if (!cc.isValid(node)) {
                cc.warn('[PopupManager]', '弹窗加载失败', path);
                this._curPopup = null;
                return res(false);
            }

            // 记录缓存模式
            this.modeMap.set(path, mode);

            // 添加到场景中
            node.setParent(cc.Canvas.instance.node);
            // 显示在最上层
            node.setSiblingIndex(cc.macro.MAX_ZINDEX);

            // 获取继承自 PopupBase 的弹窗组件
            const popup = node.getComponent(PopupBase);
            if (popup) {
                // 设置完成回调
                popup.setFinishCallback(async () => {
                    this.recycle(path, node, mode);
                    this.locked = (this._queue.length > 0);
                    this._curPopup = null;
                    res(true);
                    // 延迟
                    await new Promise(res => {
                        cc.Canvas.instance.scheduleOnce(res, this.interval);
                    });
                    // 下一个弹窗
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
     * 从缓存中获取节点
     * @param path 路径
     */
    private static getNodeFromCache(path: string): cc.Node {
        switch (this.modeMap.get(path)) {
            // 从预制体表中获取
            case PopupCacheMode.Occasionally:
                const prefab = this.prefabMap.get(path);
                if (cc.isValid(prefab)) {
                    return cc.instantiate(prefab);
                }
                this.prefabMap.delete(path);
                return null;
            // 从节点表中获取
            case PopupCacheMode.Frequent:
                const node = this.nodeMap.get(path);
                if (cc.isValid(node)) {
                    return node;
                }
                this.nodeMap.delete(path);
                return null;
        }
        return null;
    }

    /**
     * 展示等待队列中的下一个弹窗
     */
    private static next(): void {
        if (this._curPopup || this._queue.length === 0) {
            return;
        }
        const request = this._queue.shift();
        this.locked = false;
        this.show(request.path, request.options, request.mode);
    }

    /**
     * 添加一个弹窗请求到等待队列中，如果当前没有展示中的弹窗则直接展示该弹窗。
     * @param path 弹窗预制体相对路径（如：prefabs/MyPopup）
     * @param options 弹窗选项
     * @param mode 缓存模式
     * @param priority 是否优先展示
     */
    public static push<Options>(path: string, options: Options = null, mode: PopupCacheMode = PopupCacheMode.Occasionally, priority: boolean = false): void {
        // 直接展示
        if (!this._curPopup && !this.locked) {
            this.show(path, options, mode);
            return;
        }
        // 加入队列
        if (priority) {
            this._queue.unshift({ path, options, mode });
        } else {
            this._queue.push({ path, options, mode });
        }
    }

    /**
     * 回收弹窗
     * @param path 弹窗路径
     * @param node 弹窗节点
     * @param mode 缓存模式
     */
    private static recycle(path: string, node: cc.Node, mode: PopupCacheMode): void {
        switch (mode) {
            case PopupCacheMode.Once:
                node.destroy();
                if (this.nodeMap.has(path)) {
                    this.nodeMap.delete(path);
                }
                this.release(path);
                break;
            case PopupCacheMode.Occasionally:
                node.destroy();
                if (this.nodeMap.has(path)) {
                    this.nodeMap.delete(path);
                }
                break;
            case PopupCacheMode.Frequent:
                node.removeFromParent(false);
                if (!this.nodeMap.has(path)) {
                    this.nodeMap.set(path, node);
                }
                break;
        }
    }

    /**
     * 尝试释放弹窗资源（注意：弹窗内部动态加载的资源请自行释放）
     * @param path 弹窗路径
     */
    public static release(path: string): void {
        let prefab = this.prefabMap.get(path);
        if (prefab) {
            this.prefabMap.delete(path);
            prefab.decRef();
            prefab = null;
        }
    }

}

/** 弹窗请求 */
export interface PopupRequest {
    /** 弹窗预制体相对路径 */
    path: string;
    /** 弹窗选项 */
    options: any;
    /** 缓存模式 */
    mode: PopupCacheMode,
}

/** 弹窗缓存模式 */
export enum PopupCacheMode {
    /** 一次性的（立即销毁节点，预制体资源随即释放） */
    Once = 1,
    /** 偶尔的（立即销毁节点，但是保留预制体资源） */
    Occasionally = 2,
    /** 频繁的（只关闭节点，且保留预制体资源） */
    Frequent = 3
}
