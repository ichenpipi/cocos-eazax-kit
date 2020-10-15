export class EventManager2 {

    private events: Array<ISubscription> = null;

    private onceEvents: Array<ISubscription> = null;

    constructor() {
        this.events = new Array<ISubscription>();
        this.onceEvents = new Array<ISubscription>();
    }

    /**
     * 监听事件
     * @param callback 回调
     * @param object 订阅对象
     */
    public on(callback: Function, object?: any) {
        this.events.push({ callback, object });
    }

    /**
     * 监听事件（一次性）
     * @param callback 回调
     * @param object 订阅对象
     */
    public once(callback: Function, object?: any) {
        this.onceEvents.push({ callback, object });
    }

    /**
     * 取消监听事件
     * @param 回调
     */
    public off(callback: Function, object?: any) {
        for (let i = 0; i < this.events.length; i++) {
            if (this.events[i].callback === callback && (!object || this.events[i].object === object)) {
                this.events.splice(i, 1);
            }
        }

        // 一次性事件
        for (let i = 0; i < this.onceEvents.length; i++) {
            if (this.onceEvents[i].callback === callback && (!object || this.onceEvents[i].object === object)) {
                this.onceEvents.splice(i, 1);
            }
        }
    }

    /**
     * 发射事件
     * @param args 参数
     */
    public emit(...args: any[]) {
        let promises = [];

        for (let i = 0; i < this.events.length; i++) {
            promises.push(this.events[i].callback.apply(this.events[i].object, args));
        }

        // 一次性事件
        for (let i = 0; i < this.onceEvents.length; i++) {
            promises.push(this.onceEvents[i].callback.apply(this.onceEvents[i].object, args));
        }
        this.onceEvents = new Array<ISubscription>();

        return Promise.all(promises);
    }

    /**
     * 取消所有监听
     */
    public removeAll() {
        this.events = new Array<ISubscription>();
        this.onceEvents = new Array<ISubscription>();
    }

}

interface ISubscription {
    callback: Function;
    object: any;
}
