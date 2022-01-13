/**
 * 几何工具（无优化）
 * @author 陈皮皮 (ifaswind)
 * @version 20220107
 * @see GeometryUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/GeometryUtil.ts
 */
export default class GeometryUtil {

    /**
     * 判断点是否在线段上
     * @param p 目标点
     * @param a 线段端点 a
     * @param b 线段端点 b
     */
    public static pointOnLine(p: cc.Vec3, a: cc.Vec3, b: cc.Vec3) {
        // 使用叉乘判断三点共线
        const ab = b.sub(a);
        const ap = p.sub(a);
        const collinear = (ab.cross(ap).mag() === 0);
        // 根据斜率判断三点共线
        // const collinear = ((p.x - a.x) * (b.y - a.y) === (b.x - a.x) * (p.y - a.y));
        // 确认点不在线段的延长线上
        const between = (p.x >= Math.min(a.x, b.x) && p.x <= Math.max(a.x, b.x)) &&
            (p.y >= Math.min(a.y, b.y) && p.y <= Math.max(a.y, b.y));
        // 满足两个条件则点在线段上
        return collinear && between;
    }

    /**
     * 判断点是否在三角形内（同向法）
     * @param p 目标点
     * @param a 三角形顶点 a
     * @param b 三角形顶点 b
     * @param c 三角形顶点 c
     */
    public static pointInTriangle(p: cc.Vec3, a: cc.Vec3, b: cc.Vec3, c: cc.Vec3) {
        function sameSide(_p: cc.Vec3, _a: cc.Vec3, _b: cc.Vec3, _c: cc.Vec3) {
            const ab = _b.sub(_a);
            const ac = _c.sub(_a);
            const ap = _p.sub(_a);
            const v1 = ab.cross(ac);
            const v2 = ab.cross(ap);
            return v1.dot(v2) >= 0;
        }
        return sameSide(p, a, b, c) && sameSide(p, b, c, a) && sameSide(p, c, a, b);
        // return (a.x - p.x) * (b.y - p.y) - (b.x - p.x) * (a.y - p.y) >= 0 &&
        //     (b.x - p.x) * (c.y - p.y) - (c.x - p.x) * (b.y - p.y) >= 0 &&
        //     (c.x - p.x) * (a.y - p.y) - (a.x - p.x) * (c.y - p.y) >= 0;
    }

    /**
     * 获取点到线段的最短距离
     * @param p 目标点
     * @param a 线段端点 a
     * @param b 线段端点 b
     */
    public static pointLineDistance(p: cc.Vec3, a: cc.Vec3, b: cc.Vec3) {
        // 线段向量
        const ab = b.sub(a);
        // 斜边向量（由目标点和线段某端点组成）
        const ap = p.sub(a);
        // 两线段夹角（弧度制）
        const radians = cc.Vec3.angle(ab, ap);
        // 斜边长度
        const length = ap.mag();
        // 计算距离
        const distance = Math.sin(radians) * length;
        // DONE
        return distance;
    }

}

if (CC_PREVIEW) {
    window['GeometryUtil'] = GeometryUtil;
}
