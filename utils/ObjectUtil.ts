/**
 * 对象工具
 * @author 陈皮皮 (ifaswind)
 * @version 20211125
 * @see ObjectUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/ObjectUtil.ts
 */
 export default class ObjectUtil {

    /**
     * 判断指定的值是否为对象
     * @param value 值
     */
    public static isObject(value: any): boolean {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    /**
     * 深拷贝
     * @param target 目标
     */
    public static deepCopy(target: any): any {
        if (target == null || typeof target !== 'object') {
            return target;
        }

        if (target instanceof Array) {
            const result = [];
            for (let i = 0, length = target.length; i < length; i++) {
                result[i] = ObjectUtil.deepCopy(target[i]);
            }
            return result;
        }

        if (target instanceof Object) {
            const result = {};
            for (const key in target) {
                if (target.hasOwnProperty(key)) {
                    result[key] = ObjectUtil.deepCopy(target[key]);
                }
            }
            return result;
        }

        if (target instanceof Date) {
            return (new Date()).setTime(target.getTime());
        }

        console.warn(`不支持的类型：${target}`);
        return null;
    }

    /**
     * 拷贝对象
     * @param target 目标
     */
    public static copy(target: object): object {
        return JSON.parse(JSON.stringify(target));
    }

}
