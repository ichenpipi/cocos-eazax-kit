interface String {

    /**
     * 翻译
     */
    // translate(): string;

    /**
     * 截断字符串，未超出限制则不作处理
     * @param start 起始下标
     * @param threshold 最大字符数（中文字符算 2 个字符）
     * @param suffix 截断后缀
     */
    clamp(start: number, threshold: number, suffix?: string): string;

}
