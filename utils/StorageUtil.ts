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
        const dataString = (typeof value === 'object') ? JSON.stringify(value) : value;
        cc.sys.localStorage.setItem(key, dataString);
    }

    /**
     * 读取本地数据
     * @param key 键
     * @param parse 解析
     */
    public static get(key: string, parse: boolean = true): any {
        const dataString = cc.sys.localStorage.getItem(key);
        if (dataString) {
            if (parse) {
                try {
                    return JSON.parse(dataString);
                } catch {
                    return dataString;
                }
            }
            return dataString;
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
