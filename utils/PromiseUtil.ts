/**
 * Promise 工具
 * @author 陈皮皮 (ifaswind)
 * @version 20210925
 * @see PromiseUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/PromiseUtil.ts
 */
export default class PromiseUtil {

    /**
     * 等待
     * @param time 时长（秒）
     * @example
     * await PromiseUtil.sleep(1);
     */
    public static sleep(time: number): Promise<void> {
        return new Promise(res => cc.Canvas.instance.scheduleOnce(res, time));
    }

}
