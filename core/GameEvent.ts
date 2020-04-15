interface ISubscription {
    callback: Function;
    object: any;
}

interface IEvents {
    [event: string]: ISubscription[];
}

/**
 * 事件系统
 */
export class GameEvent {

    private static events: IEvents = {};

    private static onceEvents: IEvents = {};

    /**
     * 监听事件
     * @param event 事件名
     * @param callback 回调
     * @param object 订阅对象
     */
    public static on(event: string, callback: Function, object?: any) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push({ callback, object });
    }

    /**
     * 监听事件（一次性）
     * @param event 事件名
     * @param callback 回调
     * @param object 订阅对象
     */
    public static once(event: string, callback: Function, object?: any) {
        if (!this.onceEvents[event]) this.onceEvents[event] = [];
        this.onceEvents[event].push({ callback, object });
    }

    /**
     * 取消监听事件
     * @param event 事件名
     * @param callback 回调
     * @param object 订阅对象
     */
    public static off(event: string, callback: Function, object?: any) {
        if (this.events[event]) {
            for (let i = 0; i < this.events[event].length; i++) {
                if (this.events[event][i].object === object &&
                    (this.events[event][i].callback === callback ||
                        this.events[event][i].callback.toString() === callback.toString())) {
                    this.events[event].splice(i, 1);
                    return;
                }
            }
        }
        // 一次性事件
        if (this.onceEvents[event]) {
            for (let i = 0; i < this.onceEvents[event].length; i++) {
                if (this.onceEvents[event][i].object === object &&
                    (this.onceEvents[event][i].callback === callback ||
                        this.onceEvents[event][i].callback.toString() === callback.toString())) {
                    this.onceEvents[event].splice(i, 1);
                    return;
                }
            }
        }
    }

    /**
     * 发射事件
     * @param event 事件名
     * @param args 参数
     */
    public static emit(event: string, ...args: any[]) {
        if (this.events[event]) {
            for (let i = 0; i < this.events[event].length; i++) {
                this.events[event][i].callback.apply(this.events[event][i].object, args);
            }
        }
        // 一次性事件
        if (this.onceEvents[event]) {
            for (let i = 0; i < this.onceEvents[event].length; i++) {
                this.onceEvents[event][i].callback.apply(this.onceEvents[event][i].object, args);
            }
            this.onceEvents[event] = [];
        }
    }

    /**
     * 移除事件
     * @param event 事件名
     */
    public static remove(event: string) {
        if (this.events[event]) delete this.events[event];
        if (this.onceEvents[event]) delete this.onceEvents[event];
    }

    /**
     * 移除所有事件
     */
    public static removeAll() {
        this.events = {};
        this.onceEvents = {};
    }

}
