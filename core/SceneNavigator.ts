/**
 * 场景导航类
 */
export default class SceneNavigator {

    /** 历史记录 */
    public static get history() { return this._history; }
    private static _history: string[] = [];

    /** 上一个场景留下的参数（ onLaunched 之后可用） */
    public static get param() { return this._param; }
    private static _param: any = null;

    /** 当前场景名 */
    public static get curScene() { return this._curScene; }
    private static _curScene: string = null;

    /**
     * 设置首页
     * @param name 场景名
     */
    public static setHome(name: string) {
        this._history = [name];
    }

    /**
     * 返回首页
     * @param param 数据
     */
    public static goHome(param: any) {
        this._param = null;
        let name = this._history[0];
        cc.director.loadScene(name, () => {
            this._history = [name];
            this._curScene = name;
            this._param = param;
        });
    }

    /**
     * 前往场景
     * @param name 场景名
     * @param param 数据
     */
    public static go(name: string, param: any) {
        this._param = null;
        cc.director.loadScene(name, () => {
            this._history.push(name);
            this._curScene = name;
            this._param = param;
        });
    }

    /**
     * 返回上一个场景
     * @param param 数据
     */
    public static back(param: any) {
        if (this._history.length > 1) {
            this._param = null;
            let name = this._history[this._history.length - 2];
            cc.director.loadScene(name, () => {
                this._history.pop();
                this._curScene = name;
                this._param = param;
            });
        }
    }

}
