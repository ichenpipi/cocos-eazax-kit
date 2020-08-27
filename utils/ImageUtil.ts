/**
 * 图像工具
 */
export default class ImageUtil {

    /**
     * 将图像转为 Base64 字符（仅 png、jpg 或 jpeg 格式资源）
     * @param url 图像地址
     * @param callback 完成回调
     */
    public static imageToBase64(url: string, callback?: (dataURL: string) => void): Promise<string> {
        return new Promise(res => {
            let extname = /\.png|\.jpg|\.jpeg/.exec(url)?.[0];
            if (['.png', '.jpg', '.jpeg'].includes(extname)) {
                let canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const image = new Image();
                image.src = url;
                image.onload = () => {
                    canvas.height = image.height;
                    canvas.width = image.width;
                    ctx.drawImage(image, 0, 0);
                    extname = extname === '.jpg' ? 'jpeg' : extname.replace('.', '');
                    const dataURL = canvas.toDataURL(`image/${extname}`);
                    callback && callback(dataURL);
                    res(dataURL);
                    canvas = null;
                }
            } else {
                console.warn('Not a jpg/jpeg or png resource!');
                callback && callback(null);
                res(null);
            }
        });
    }

    /**
     * 将 Base64 字符转为 cc.Texture2D 资源
     * @param base64 Base64 字符
     */
    public static base64ToTexture(base64: string): cc.Texture2D {
        let image = document.createElement('img');
        image.src = base64;
        const texture = new cc.Texture2D();
        texture.initWithElement(image);
        image = null;
        return texture;
    }

    /**
     * 将 Base64 字符转为二进制数据
     * @param base64 Base64 字符
     */
    public static base64ToBlob(base64: string): Blob {
        const strings = base64.split(',');
        const type = /image\/\w+|;/.exec(strings[0])[0];
        const data = window.atob(strings[1]);
        const arrayBuffer = new ArrayBuffer(data.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < data.length; i++) {
            uint8Array[i] = data.charCodeAt(i) & 0xff;
        }
        return new Blob([uint8Array], { type: type });
    }

}
