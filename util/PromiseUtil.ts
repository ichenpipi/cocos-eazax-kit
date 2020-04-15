/**
 * Promise 工具
 */
export default class PromiseUtil {

    /**
     * 等待
     * @param time 时间（秒）
     */
    public static delay(time: number): Promise<void> {
        return new Promise(res => setTimeout(res, time * 1000));
    }

}
