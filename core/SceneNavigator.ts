/**
 * 场景导航类
 * @author 陈皮皮 (ifaswind)
 * @version 20210318
 * @see SceneNavigator.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/SceneNavigator.ts
 */
export default class SceneNavigator {

    /** 首页场景名称 */
    public static get home() { return this._home; }
    private static _home: string = null;

    /** 历史记录（栈） */
    public static get history() { return this._history; }
    private static _history: string[] = [];

    /** 当前场景名称 */
    public static get curScene() { return this._curScene; }
    private static _curScene: string = null;

    /** 上一个场景留下的参数（ onLaunched 之后可用） */
    public static get param() { return this._param; }
    private static _param: any = null;

    /**
     * 设置首页
     * @param name 场景名
     */
    public static setHome(name: string) {
        this._home = name;
        this._history = [name];
        this._curScene = name;
    }

    /**
     * 返回首页
     * @param param 数据
     * @param coverHistory 覆盖历史记录
     * @param onLaunched 场景加载完成回调
     */
    public static goHome(param?: any, coverHistory?: boolean, onLaunched?: Function) {
        this._param = null;
        const name = this._home;
        if (this._curScene === name) {
            return;
        }
        cc.director.loadScene(name, () => {
            if (coverHistory) {
                this._history.length = 0;
            }
            this._history.push(name);
            this._curScene = name;
            this._param = param || null;
            onLaunched && onLaunched();
        });
    }

    /**
     * 前往场景
     * @param name 场景名
     * @param param 数据
     * @param onLaunched 场景加载完成回调
     */
    public static go(name: string, param?: any, onLaunched?: Function) {
        this._param = null;
        cc.director.loadScene(name, () => {
            this._history.push(name);
            this._curScene = name;
            this._param = param || null;
            onLaunched && onLaunched();
        });
    }

    /**
     * 返回上一个场景
     * @param param 数据
     * @param onLaunched 场景加载完成回调
     */
    public static back(param?: any, onLaunched?: Function) {
        if (this._history.length < 1) {
            return;
        }
        this._param = null;
        const history = this._history,
            name = history[history.length - 2];
        cc.director.loadScene(name, () => {
            history.pop();
            this._curScene = name;
            this._param = param || null;
            onLaunched && onLaunched();
        });
    }

}
