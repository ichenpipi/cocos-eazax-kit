/**
 * 数学工具
 * @author 陈皮皮 (ifaswind)
 * @version 20201019
 * @see MathUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/MathUtil.ts
 */
export default class MathUtil {

    /**
    * 获取一个 min 到 max 范围内的随机整数
    * @param min 最小值
    * @param max 最大值
    */
    public static getRandomInt(min: number = 0, max: number = 1): number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * 获取一个伪随机整数
     * @param seed 随机种子
     * @param key key
     */
    public static getPseudoRandomInt(seed: number, key: number): number {
        return Math.ceil((((seed * 9301 + 49297) % 233280) / 233280) * key);
    }

    /**
     * 获取两点间的角度
     * @param p1 点1
     * @param p2 点2
     */
    public static getAngle(p1: cc.Vec2, p2: cc.Vec2): number {
        return Math.atan((p2.y - p1.y) / (p2.x - p1.x));
    }

    /**
     * 获取两点间的距离
     * @param p1 点1
     * @param p2 点2
     */
    public static getDistance(p1: cc.Vec2, p2: cc.Vec2): number {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    /**
     * 将角度转为弧度
     * @param angle 角度
     */
    public static angleToRadian(angle: number): number {
        return angle * Math.PI / 180;
    }

    /**
     * 浮点数加法运算（避免浮点数加法精度问题）
     * @param a 数
     * @param b 数
     */
    public static addSafely(a: number, b: number): number {
        const aDigits = (a.toString().split('.')[1] || '').length;
        const bDigits = (b.toString().split('.')[1] || '').length;
        const multiplier = Math.pow(10, Math.max(aDigits, bDigits));
        return (a * multiplier + b * multiplier) / multiplier;
    }

}
