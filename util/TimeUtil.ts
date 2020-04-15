/**
 * 时间工具
 */
export default class TimeUtil {

    /**
     * 获取当天指定时间的时间戳
     * @param hour 时
     * @param minute 分
     * @param second 秒
     */
    public static getTargetTimestamp(hour: number = 0, minute: number = 0, second: number = 0): number {
        let start = new Date(new Date().toLocaleDateString()).getTime();
        let target = ((hour * 3600) + (minute * 60) + second) * 1000;
        let result = new Date(start + target).getTime();
        return result;
    }

    /**
     * 获取当前时间戳
     */
    public static getCurrentTimestamp(): number {
        return new Date().getTime();
    }

}
