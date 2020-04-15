interface ISubscription {
    callback: Function;
    object: any;
}

export class GameEvent2 {

    private subscriptions: Array<ISubscription> = null;

    private onceSubscriptions: Array<ISubscription> = null;

    constructor() {
        this.subscriptions = new Array<ISubscription>();
        this.onceSubscriptions = new Array<ISubscription>();
    }

    /**
     * 订阅事件
     * @param callback 回调
     * @param object 订阅对象
     */
    public on(callback: Function, object?: any) {
        this.subscriptions.push({ callback, object });
    }

    /**
     * 订阅事件（一次性）
     * @param callback 回调
     * @param object 订阅对象
     */
    public once(callback: Function, object?: any) {
        this.onceSubscriptions.push({ callback, object });
    }

    /**
     * 取消订阅
     * @param 回调
     */
    public off(callback: Function, object?: any) {
        for (let i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].callback === callback && (!object || this.subscriptions[i].object === object)) {
                this.subscriptions.splice(i, 1);
            }
        }
        // one-time Subscriptions
        for (let i = 0; i < this.onceSubscriptions.length; i++) {
            if (this.onceSubscriptions[i].callback === callback && (!object || this.onceSubscriptions[i].object === object)) {
                this.onceSubscriptions.splice(i, 1);
            }
        }
    }

    /**
     * 派遣事件
     * @param args 参数
     */
    public dispatch(...args: any[]) {
        let promises = [];

        for (let i = 0; i < this.subscriptions.length; i++) {
            promises.push(this.subscriptions[i].callback.apply(this.subscriptions[i].object, args));
        }
        // one-time Subscriptions
        for (let i = 0; i < this.onceSubscriptions.length; i++) {
            promises.push(this.onceSubscriptions[i].callback.apply(this.onceSubscriptions[i].object, args));
        }
        this.onceSubscriptions = new Array<ISubscription>();

        return Promise.all(promises);
    }

    /**
     * 移除所有订阅
     */
    public removeAll() {
        this.subscriptions = new Array<ISubscription>();
        this.onceSubscriptions = new Array<ISubscription>();
    }

}
