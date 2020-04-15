/**
 * 正则工具
 */
export default class RegexUtil {

    /**
     * 判断字符是否为双字节字符（包括汉字）
     * @param string 
     */
    public static isDWORD(string: string): boolean {
        return /[^\x00-\xff]/.test(string);
    }

}