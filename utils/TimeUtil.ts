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

    /**
     * 将毫秒转为时分秒的格式（最小单位为秒，如：”00:01:59“）
     * @param time 毫秒数
     * @param separator 分隔符
     */
    public static msToHMS(time: number, separator: string = ':'): string {
        let hours = Math.floor(time / 3600000);
        let minutes = Math.floor((time - (hours * 3600000)) / 60000);
        let seconds = Math.floor((time - (hours * 3600000) - (minutes * 60000)) / 1000);
        return `${hours.toString().padStart(2, '0')}${separator}${minutes.toString().padStart(2, '0')}${separator}${seconds.toString().padStart(2, '0')}`;
    }

}
