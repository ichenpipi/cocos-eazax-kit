/**
 * 本地储存类
 */
export default class StorageUtil {

    /**
     * 存储数据
     * @param key 键
     * @param value 值
     */
    public static set(key: string, value: any) {
        cc.sys.localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * 读取数据
     * @param key 键
     * @param parse 解析为对象
     */
    public static get(key: string, parse: boolean = true): any {
        let value = cc.sys.localStorage.getItem(key);
        return parse ? JSON.parse(value) : value;
    }

    /**
     * 移除数据
     * @param key 键
     */
    public static remove(key: string) {
        cc.sys.localStorage.removeItem(key);
    }

}
