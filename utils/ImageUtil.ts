/**
 * 图像工具
 * @author 陈皮皮 (ifaswind)
 * @version 20220122
 * @see ImageUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/ImageUtil.ts
 */
export default class ImageUtil {

    /**
     * 获取图像的透明剪裁尺寸数据（结果基于左上角）
     * @param data 图像数据
     * @param width 图像宽度
     * @param height 图像高度
     */
    public static getTrim(data: Uint8Array, width: number, height: number) {
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        let i = 0, j = 0;
        const lineWidth = width * 4;
        // 左 -> 右
        left: {
            for (i = 0; i < width; i++) {
                for (j = 0; j < height; j++) {
                    const index = (lineWidth * j) + (4 * i) + 3;
                    if (data[index] !== 0) {
                        break left;
                    }
                }
            }
        }
        minX = i;
        // 右 -> 左
        right: {
            for (i = width - 1; i >= 0; i--) {
                for (j = 0; j < height; j++) {
                    const index = (lineWidth * j) + (4 * i) + 3;
                    if (data[index] !== 0) {
                        break right;
                    }
                }
            }
        }
        maxX = i + 1;
        // 上 -> 下
        top: {
            for (i = 0; i < height; i++) {
                for (j = 0; j < width; j++) {
                    const index = (lineWidth * i) + (4 * j) + 3;
                    if (data[index] !== 0) {
                        break top;
                    }
                }
            }
        }
        minY = i;
        // 下 -> 上
        bottom: {
            for (i = height - 1; i >= 0; i--) {
                for (j = 0; j < width; j++) {
                    const index = (lineWidth * i) + (4 * j) + 3;
                    if (data[index] !== 0) {
                        break bottom;
                    }
                }
            }
        }
        maxY = i + 1;
        // 完成
        return { minX, maxX, minY, maxY };
    }

    // ------------------------------ 以下 API 仅 Web 平台下可用 ------------------------------

    /**
     * (仅 Web 平台下可用) 获取纹理的颜色数据。
     * @param texture 纹理
     */
    public static getPixelsData(texture: cc.Texture2D) {
        if (!window || !window.document) {
            return null;
        }
        // 获取画布
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // 调整画布尺寸
        const { width, height } = texture;
        canvas.width = width;
        canvas.height = height;
        // 将纹理画到画布上
        const image = texture.getHtmlElementObj();
        ctx.drawImage(image, 0, 0, width, height);
        // 获取像素数据
        const imageData = ctx.getImageData(0, 0, width, height);
        // 销毁临时对象
        image.remove();
        canvas.remove();
        // 返回 Unit8Array 格式的数据
        return new Uint8Array(imageData.data);
    }

    /**
     * (仅 Web 平台下可用) 获取纹理中指定像素的颜色。原点为左上角，从像素 (0, 0) 开始。
     * @param texture 纹理
     * @param x x 坐标
     * @param y y 坐标
     * @example
     * // 获取纹理左上角第一个像素的颜色
     * const color = ImageUtil.getPixelColor(texture, 0, 0);
     * // cc.color(50, 100, 123, 255);
     */
    public static getPixelColor(texture: cc.Texture2D, x: number, y: number) {
        if (!window || !window.document) {
            return null;
        }
        const pixelsData = ImageUtil.getPixelsData(texture),
            width = texture.width;
        const index = (width * 4 * Math.floor(y)) + (4 * Math.floor(x)),
            data = pixelsData.slice(index, index + 4),
            color = cc.color(data[0], data[1], data[2], data[3]);
        return color;
    }

    /**
     * (仅 Web 平台下可用) 将图像转为 Base64 字符（仅 png、jpg 或 jpeg 格式资源）
     * @param url 图像地址
     * @param callback 完成回调
     */
    public static imageToBase64(url: string, callback?: (dataURL: string) => void) {
        return new Promise(res => {
            let extname = /\.png|\.jpg|\.jpeg/.exec(url)?.[0];
            if (['.png', '.jpg', '.jpeg'].includes(extname)) {
                const canvas = document.createElement('canvas');
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
                    image.remove();
                    canvas.remove();
                }
            } else {
                console.warn('Not a jpg/jpeg or png resource!');
                callback && callback(null);
                res(null);
            }
        });
    }

    /**
     * (仅 Web 平台下可用) 将 Base64 字符转为 cc.Texture2D 资源
     * @param base64 Base64 字符
     */
    public static base64ToCCTexture(base64: string) {
        if (!window || !window.document) {
            return null;
        }
        const image = new Image();
        image.src = base64;
        const texture = new cc.Texture2D();
        texture.initWithElement(image);
        image.remove();
        return texture;
    }

}
