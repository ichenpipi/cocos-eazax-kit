/**
 * Promise 工具
 * @see PromiseUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/PromiseUtil.ts
 */
export default class PromiseUtil {

    /**
     * 等待
     * @param time 时长（秒）
     * @example
     * await PromiseUtil.wait(1);
     */
    public static wait(time: number): Promise<void> {
        return new Promise(res => cc.Canvas.instance.scheduleOnce(res, time));
    }

}
