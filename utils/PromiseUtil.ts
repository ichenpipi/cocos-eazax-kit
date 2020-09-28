/**
 * Promise 工具
 * @see PromiseUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/PromiseUtil.ts
 */
export default class PromiseUtil {

    /**
     * 等待
     * @param time 时间（单位：秒）
     */
    public static delay(time: number): Promise<void> {
        return new Promise(res => setTimeout(res, time * 1000));
    }

}
