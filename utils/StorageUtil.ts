/**
 * 本地储存工具
 * @see StorageUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/StorageUtil.ts
 */
export default class StorageUtil {

    /**
     * 保存数据到本地
     * @param key 键
     * @param value 值
     */
    public static set(key: string, value: any): void {
        const data = (typeof value === 'object') ? JSON.stringify(value) : value;
        cc.sys.localStorage.setItem(key, data);
    }

    /**
     * 读取本地数据
     * @param key 键
     * @param parse 解析
     */
    public static get(key: string, parse: boolean = true): any {
        const data: string = cc.sys.localStorage.getItem(key);
        if (data !== null) {
            if (parse) {
                try {
                    return JSON.parse(data);
                } catch {
                    return data;
                }
            }
            return data;
        }
        return null;
    }

    /**
     * 移除本地数据
     * @param key 键
     */
    public static remove(key: string): void {
        cc.sys.localStorage.removeItem(key);
    }

}
