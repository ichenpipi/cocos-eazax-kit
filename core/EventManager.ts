/**
 * 事件管理器
 * @see EventManager.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/EventManager.ts
 * @example 
 * EventManager.on('start', this.onStart, this);
 * EventManager.emit('start');
 */
export default class EventManager {

    private static events: Map<string, Subscription[]> = new Map<string, Subscription[]>();

    private static onceEvents: Map<string, Subscription[]> = new Map<string, Subscription[]>();

    /**
     * 监听事件
     * @param name 事件名
     * @param callback 回调
     * @param target 订阅对象
     */
    public static on(name: string, callback: Function, target?: any) {
        if (!this.events.has(name)) {
            this.events.set(name, []);
        }
        this.events.get(name).push({ callback, target });
    }

    /**
     * 监听事件（一次性）
     * @param name 事件名
     * @param callback 回调
     * @param target 订阅对象
     */
    public static once(name: string, callback: Function, target?: any) {
        if (!this.onceEvents.has(name)) {
            this.onceEvents.set(name, []);
        }
        this.onceEvents.get(name).push({ callback, target });
    }

    /**
     * 取消监听事件
     * @param name 事件名
     * @param callback 回调
     * @param target 订阅对象
     */
    public static off(name: string, callback: Function, target?: any) {
        if (this.events.has(name)) {
            const subscriptions = this.events.get(name);
            for (let i = 0; i < subscriptions.length; i++) {
                if (subscriptions[i].target === target &&
                    (subscriptions[i].callback === callback || subscriptions[i].callback.toString() === callback.toString())) {
                    subscriptions.splice(i, 1);
                    break;
                }
            }
        }
        // 一次性事件
        if (this.onceEvents.has(name)) {
            const subscriptions = this.onceEvents.get(name);
            for (let i = 0; i < subscriptions.length; i++) {
                if (subscriptions[i].target === target &&
                    (subscriptions[i].callback === callback || subscriptions[i].callback.toString() === callback.toString())) {
                    subscriptions.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * 发射事件
     * @param name 事件名
     * @param args 参数
     */
    public static emit(name: string, ...args: any[]) {
        if (this.events.has(name)) {
            const subscriptions = this.events.get(name);
            for (let i = 0; i < subscriptions.length; i++) {
                subscriptions[i].callback.apply(subscriptions[i].target, args);
            }
        }
        // 一次性事件
        if (this.onceEvents.has(name)) {
            let subscriptions = this.onceEvents.get(name);
            for (let i = 0; i < subscriptions.length; i++) {
                subscriptions[i].callback.apply(subscriptions[i].target, args);
            }
            subscriptions.length = 0;
        }
    }

    /**
     * 移除事件
     * @param name 事件名
     */
    public static remove(name: string) {
        if (this.events.has(name)) {
            this.events.delete(name);
        }
        if (this.onceEvents.has(name)) {
            this.onceEvents.delete(name);
        }
    }

    /**
     * 移除所有事件
     */
    public static removeAll() {
        this.events.clear();
        this.onceEvents.clear();
    }

}

/** 订阅 */
interface Subscription {
    callback: Function;
    target: any;
}
