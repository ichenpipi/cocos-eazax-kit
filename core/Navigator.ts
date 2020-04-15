/**
 * 场景导航类
 */
export default class Navigator {

    private static _history: string[] = [];

    /**
     * 场景历史记录
     */
    public static get history() { return this._history; }

    private static _param: any = null;

    /**
     * 上一个场景留下的参数（ onLaunched 之后可用）
     */
    public static get param() { return this._param; }

    /**
     * 设置首页
     * @param name 
     */
    public static setHome(name: string) {
        this._history = [name];
    }

    /**
     * 返回首页
     */
    public static goHome(param: any) {
        this._param = null;
        let name = this._history[0];
        cc.director.loadScene(name, () => {
            this._history = [name];
            this._param = param;
        });
    }

    /**
     * 前往场景
     * @param name 
     * @param param 
     */
    public static go(name: string, param: any) {
        this._param = null;
        cc.director.loadScene(name, () => {
            this._history.push(name);
            this._param = param;
        });
    }

    /**
     * 返回上一个场景
     * @param param 
     */
    public static back(param: any) {
        if (this._history.length > 1) {
            this._param = null;
            let name = this._history[this._history.length - 2];
            cc.director.loadScene(name, () => {
                this._history.pop();
                this._param = param;
            });
        }
    }

}