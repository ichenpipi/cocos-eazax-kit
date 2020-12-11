/**
 * 对象工具
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
     * @param target 目标对象
     */
    public static deepCopy(target: object): any {
        if (target == null || typeof target !== 'object') {
            return target;
        }

        let result = null;

        if (target instanceof Date) {
            result = new Date();
            result.setTime(target.getTime());
            return result;
        }

        if (target instanceof Array) {
            result = [];
            for (let i = 0, length = target.length; i < length; i++) {
                result[i] = this.deepCopy(target[i]);
            }
            return result;
        }

        if (target instanceof Object) {
            result = {};
            for (const key in target) {
                if (target.hasOwnProperty(key)) {
                    result[key] = this.deepCopy(target[key]);
                }
            }
            return result;
        }
    }

    /**
     * 返回目标对象的拷贝（仅基本类型）
     * @param target 目标对象
     */
    public static copy(target: object): object {
        // 1
        // let result = {...target};

        // 2
        // let result = JSON.parse(JSON.stringify(target));

        // 3
        const result = {};
        for (let name in target) {
            result[name] = target[name];
        }
        return result;
    }

}
