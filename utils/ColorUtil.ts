/**
 * 颜色工具
 * @author 陈皮皮 (ifaswind)
 * @version 20211116
 * @see ColorUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/ColorUtil.ts
 */
export default class ColorUtil {

    /**
     * 将 16 进制（hex）颜色字符串转为 RGBA 格式
     * @param {string} hex 
     * @example
     * ColorUtil.hexToRgba('#FFFFFF'); // { r: 255, g: 255, b: 255, a: 255 }
     */
    public static hexToRgba(hex: string) {
        if (!ColorUtil.isHex(hex)) {
            return null;
        }
        const r = parseInt(hex.substr(1, 2), 16) || 0,
            g = parseInt(hex.substr(3, 2), 16) || 0,
            b = parseInt(hex.substr(5, 2), 16) || 0,
            a = parseInt(hex.substr(7, 2), 16) || 255;
        return { r, g, b, a };
    }

    /**
     * 将 RGB 或 RGBA 颜色值转为 16 进制（hex）颜色字符串
     * @param color 
     * @example
     * const color = {
     *   r: 255,
     *   g: 255,
     *   b: 255,
     * };
     * ColorUtil.rgbaToHex(color);  // '#FFFFFF'
     */
    public static rgbaToHex(color: { r: number, g: number, b: number, a?: number }) {
        const r = (color.r | 1 << 8).toString(16).slice(1),
            g = (color.g | 1 << 8).toString(16).slice(1),
            b = (color.b | 1 << 8).toString(16).slice(1);
        if (color.a == undefined) {
            return `#${r}${g}${b}`.toUpperCase();
        }
        const a = (color.a | 1 << 8).toString(16).slice(1);
        return `#${r}${g}${b}${a}`.toUpperCase();
    }

    /**
     * 测试字符串是否为 16 进制（hex）颜色值
     * @param hex 
     */
    public static isHex(hex: string) {
        return /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(hex);
    }

    // /**
    //  * 将 16 进制（hex）颜色字符串转为 RGB 格式
    //  * @param {string} hex 
    //  */
    // public static hexToRGB(hex: string) {
    //     // 是否为 HEX 格式
    //     if (!ColorUtil.isHex(hex)) {
    //         return null;
    //     }
    //     // 四位
    //     if (hex.length === 4) {
    //         const r = hex.substr(1, 1),
    //             g = hex.substr(2, 1),
    //             b = hex.substr(3, 1);
    //         hex = `#${r}${r}${g}${g}${b}${b}`;
    //     }
    //     // 转换进制
    //     const rgb = {
    //         r: parseInt(`0x${hex.substr(1, 2)}`),
    //         g: parseInt(`0x${hex.substr(3, 2)}`),
    //         b: parseInt(`0x${hex.substr(5, 2)}`),
    //     };
    //     return rgb;
    // }

}
