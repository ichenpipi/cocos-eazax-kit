/**
 * 图像工具
 */
export default class ImageUtil {

    /**
     * 将图像转为 Base64 字符串（仅 png 和 jpg 资源）
     * @param url 图像地址
     * @param callback 完成回调
     */
    public static imageToBase64(url: string, callback?: (dataURL: string) => void): Promise<string> {
        return new Promise(res => {
            const extname = /\.png|\.jpg/.exec(url)?.[0];
            if (['.png', '.jpg'].includes(extname)) {
                let canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const image = new Image();
                image.src = url;
                image.onload = () => {
                    canvas.height = image.height;
                    canvas.width = image.width;
                    ctx.drawImage(image, 0, 0);
                    const dataURL = canvas.toDataURL(`image/${extname}`);
                    callback && callback(dataURL);
                    res(dataURL);
                    canvas = null;
                }
            } else {
                console.warn('Not a jpg or png resource!');
                callback && callback(null);
                res(null);
            }
        });
    }

    /**
     * 将 Base64 字符转为 cc.Texture2D 资源
     * @param dataURL base64 字符
     */
    public static base64ToTexture(dataURL: string): cc.Texture2D {
        let image = document.createElement('img');
        image.src = dataURL;
        const texture = new cc.Texture2D();
        texture.initWithElement(image);
        image = null;
        return texture;
    }

}
