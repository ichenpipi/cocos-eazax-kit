/**
 * 本地储存工具
 * @see StorageUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/StorageUtil.ts
 */
export default class StorageUtil {

    /**
     * 存储数据到本地
     * @param key 键
     * @param value 值
     */
    public static set(key: string, value: any) {
        cc.sys.localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * 读取本地数据
     * @param key 键
     * @param parse 解析为对象
     */
    public static get(key: string, parse: boolean = true): any {
        const value = cc.sys.localStorage.getItem(key);
        return parse ? JSON.parse(value) : value;
    }

    /**
     * 移除本地数据
     * @param key 键
     */
    public static remove(key: string) {
        cc.sys.localStorage.removeItem(key);
    }

}

window['eazax'] && (window['eazax']['storage'] = StorageUtil);
