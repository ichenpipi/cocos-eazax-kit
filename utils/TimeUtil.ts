/**
 * 时间工具
 * @author 陈皮皮 (ifaswind)
 * @version 20210317
 * @see TimeUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/TimeUtil.ts
 */
export default class TimeUtil {

    /**
     * 获取当前时间戳
     * @example
     * TimeUtil.getTimestamp(); // 1614616955186
     */
    public static getTimestamp(): number {
        return new Date().getTime();
    }

    /**
     * 获取当前日期（年/月/日）
     * @example
     * TimeUtil.getDate(); // "2021/3/2"
     */
    public static getDate(): string {
        return new Date().toLocaleDateString();
    }

    /**
     * 获取当天指定时间的时间戳
     * @param hour 时
     * @param minute 分
     * @param second 秒
     * @example
     * const time = TimeUtil.getTargetTimestamp(10, 20, 30); // 1601259630000
     * new Date(time).toLocaleString(); // "上午10:20:30"
     */
    public static getTargetTimestamp(hour: number = 0, minute: number = 0, second: number = 0): number {
        const start = new Date(new Date().toLocaleDateString()).getTime();
        const target = ((hour * 3600) + (minute * 60) + second) * 1000;
        return new Date(start + target).getTime();
    }

    /**
     * 将毫秒转为时分秒的格式（最小单位为秒，如："00:01:59"）
     * @param time 毫秒数
     * @param separator 分隔符
     * @param keepHours 当小时数为 0 时依然展示小时数
     * @example 
     * TimeUtil.msToHMS(119000); // "00:01:59"
     */
    public static msToHMS(time: number, separator: string = ':', keepHours: boolean = true): string {
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time - (hours * 3600000)) / 60000);
        const seconds = Math.floor((time - (hours * 3600000) - (minutes * 60000)) / 1000);
        const hoursString = (hours === 0 && !keepHours) ? '' : `${hours.toString().padStart(2, '0')}:`;
        return `${hoursString}${minutes.toString().padStart(2, '0')}${separator}${seconds.toString().padStart(2, '0')}`;
    }

}
