/**
 * 浏览器工具
 * @see BrowserUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/BrowserUtil.ts
 */
export default class BrowserUtil {

    /**
     * 清除当前 URL 的参数（修改历史记录，不会刷新当前网页）
     */
    public static clearUrlParam(): void {
        if (!window || !window.history) return;
        window.history.replaceState({}, null, '.');
    }

    /**
     * 设置当前 URL 的参数（修改历史记录，不会刷新当前网页）
     * @param param 参数
     */
    public static setUrlParam(param: string): void {
        if (!window || !window.history) return;
        window.history.replaceState({}, null, `?${param}`);
    }

    /**
     * 获取当前 URL 的参数
     * @param key 键
     */
    public static getUrlParam(key: string): string {
        if (!window || !window.location) return;
        const query = window.location.search.replace('?', '');
        if (query === '') return null;
        const keyValues = query.split('&');
        for (let i = 0; i < keyValues.length; i++) {
            const strings = keyValues[i].split('=');
            if (decodeURIComponent(strings[0]) === key) return decodeURIComponent(strings[1]);
        }
        return null;
    }

    /**
     * 复制文本至设备剪贴板
     * @param value 文本内容
     */
    public static copy(value: string): boolean {
        if (!document) return false;
        // 创建输入元素
        let element = document.createElement('textarea');
        element.readOnly = true;
        element.style.opacity = '0';
        element.value = value;
        document.body.appendChild(element);
        // 选择元素
        element.select();
        // 兼容低版本 iOS 的特殊处理
        let range = document.createRange();
        range.selectNodeContents(element);
        let selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        // 复制
        let result = document.execCommand('copy');
        element.remove();
        return result;
    }

    // public static copyViaNavigator(value: string) {
    //     return new Promise<boolean>(res => {
    //         if (document.location.protocol === 'https:' || document.location.hostname === 'localhost' || document.location.hostname === '127.0.0.1') {
    //             // navigator.clipboard API 只适用于安全连接
    //             console.log('Copy via navigator.clipboard');
    //             navigator.clipboard.writeText(value)
    //                 .then(() => {
    //                     console.log('Clipboard write success!');
    //                     res(true);
    //                 })
    //                 .catch(err => {
    //                     console.error('Clipboard write failed:', err);
    //                     res(false);
    //                 });
    //         } else {
    //             console.log('Copy via document.execCommand');
    //         }
    //     });
    // }

}
