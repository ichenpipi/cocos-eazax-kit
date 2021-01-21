/**
 * 计算工具
 */
export default class CalUtil {

    /**
    * 获取随机数
    * @param min 最小值
    * @param max 最大值
    */
    public static getRandomNumber(min: number = 0, max: number = 1): number {
        let result = Math.floor(Math.random() * (max - min + 1)) + min;
        return result;
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

}
