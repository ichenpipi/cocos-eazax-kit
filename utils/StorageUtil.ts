/**
 * 本地储存工具
 * @author 陈皮皮 (ifaswind)
 * @version 20220122
 * @see StorageUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/StorageUtil.ts
 */
export default class StorageUtil {

    /**
     * 保存数据到本地
     * @param key 键
     * @param value 值
     */
    public static set(key: string, value: any) {
        if (typeof value === 'object') {
            cc.sys.localStorage.setItem(key, JSON.stringify(value));
        } else {
            cc.sys.localStorage.setItem(key, value);
        }
    }

    /**
     * 读取本地数据
     * @param key 键
     * @param parse 解析
     */
    public static get(key: string, parse: boolean = true) {
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
    public static remove(key: string) {
        cc.sys.localStorage.removeItem(key);
    }

}
