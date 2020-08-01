export default class BrowserUtil {

    /**
     * 复制数据至设备剪贴板
     * @param value 内容
     */
    public static copy(value: string) {
        return new Promise<boolean>(res => {
            if (document.location.protocol === 'https:' || document.location.hostname === 'localhost' || document.location.hostname === '127.0.0.1') {
                // navigator.clipboard API 只适用于安全连接
                console.log('Copy via navigator.clipboard');
                navigator.clipboard.writeText(value)
                    .then(() => {
                        console.log('Clipboard write success!');
                        res(true);
                    })
                    .catch(err => {
                        console.error('Clipboard write failed:', err);
                        res(false);
                    });
            } else {
                console.log('Copy via document.execCommand');
                // 创建输入元素
                let element = document.createElement('input');
                element.readOnly = true;
                element.style.opacity = '0';
                element.value = value;
                document.body.appendChild(element);
                // 选择元素
                element.select();
                // 低版本 iOS 特殊处理
                let range = document.createRange();
                range.selectNodeContents(element);
                let selection = getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                // 复制
                let result = document.execCommand('copy');
                element.remove();
                res(result);
            }
        });
    }

}