/**
 * 图像工具
 * @author 陈皮皮 (ifaswind)
 * @version 20211019
 * @see ImageUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/ImageUtil.ts
 */
export default class ImageUtil {

    /**
     * 垂直翻转图像数据
     * @param array 数据
     * @param width 行宽
     */
    public static flipY(array: Uint8Array, width: number) {
        // const height = Math.floor(array.length / width),
        //     halfHeight = Math.floor(height / 2),
        //     maxRowIndex = height - 1;
        // for (let i = 0; i < halfHeight; i++) {
        //     const a = i * width,
        //         b = (maxRowIndex - i) * width;
        //     for (let k = 0; k < width; k++) {
        //         [array[a + k], array[b + k]] = [array[b + k], array[a + k]];
        //     }
        //     // const block = array.slice(a, a + width);
        //     // for (let k = 0; k < width; k++) {
        //     //     array[a + k] = array[b + k];
        //     //     array[b + k] = block[k]
        //     // }
        // }
        // return array;
        const length = array.length,
            flipped = new Uint8Array(length);
        for (let i = 0, j = length - width; i < length; i += width, j -= width) {
            for (let k = 0; k < width; k++) {
                flipped[i + k] = array[j + k];
            }
        }
        return flipped;
    }

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
        const canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
        const { width, height } = texture;
        canvas.width = width;
        canvas.height = height;
        const image = texture.getHtmlElementObj();
        ctx.drawImage(image, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        canvas.remove();
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
    public static getPixelColor(texture: cc.Texture2D, x: number, y: number): cc.Color {
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
    public static imageToBase64(url: string, callback?: (dataURL: string) => void): Promise<string> {
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
    public static base64ToCCTexture(base64: string): cc.Texture2D {
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

    /**
     * (仅 Web 平台下可用) 将 Base64 字符转为二进制数据
     * @param base64 Base64 字符
     */
    public static base64ToBlob(base64: string): Blob {
        if (!window || !window.atob) {
            return null;
        }
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
