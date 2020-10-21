/**
 * 实例事件
 * @see InstanceEvent.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/InstanceEvent.ts
 * @example 
 * const startEvent = new InstanceEvent();
 * startEvent.on(this.onStart, this);
 * startEvent.emit();
 * startEvent.off(this.onStart, this);
 */
export class InstanceEvent {

    private events: Array<Subscription> = null;

    private onceEvents: Array<Subscription> = null;

    constructor() {
        this.events = new Array<Subscription>();
        this.onceEvents = new Array<Subscription>();
    }

    /**
     * 监听事件
     * @param callback 回调
     * @param target 订阅对象
     */
    public on(callback: Function, target?: any) {
        this.events.push({ callback, target });
    }

    /**
     * 监听事件（一次性）
     * @param callback 回调
     * @param target 订阅对象
     */
    public once(callback: Function, target?: any) {
        this.onceEvents.push({ callback, target });
    }

    /**
     * 取消监听事件
     * @param callback 回调
     * @param target 订阅对象
     */
    public off(callback: Function, target?: any) {
        for (let i = 0; i < this.events.length; i++) {
            if (this.events[i].callback === callback && (!target || this.events[i].target === target)) {
                this.events.splice(i, 1);
            }
        }
        // 一次性事件
        for (let i = 0; i < this.onceEvents.length; i++) {
            if (this.onceEvents[i].callback === callback && (!target || this.onceEvents[i].target === target)) {
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
            promises.push(this.events[i].callback.apply(this.events[i].target, args));
        }
        // 一次性事件
        for (let i = 0; i < this.onceEvents.length; i++) {
            promises.push(this.onceEvents[i].callback.apply(this.onceEvents[i].target, args));
        }
        this.onceEvents.length = 0;
        return Promise.all(promises);
    }

    /**
     * 取消所有监听
     */
    public removeAll() {
        this.events.length = 0;
        this.onceEvents.length = 0;
    }

}

/** 订阅 */
interface Subscription {
    callback: Function;
    target: any;
}
