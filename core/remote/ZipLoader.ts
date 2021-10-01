import JSZip = require('../../third-party/jszip');

// 使用二进制的方式下载 zip 文件（数据格式为 ArrayBuffer）
cc.assetManager.downloader.register({
    '.zip': cc.assetManager.downloader['_downloaders']['.bin'],
});

/**
 * Zip 加载器
 * @version 20211001
 * @see ZipLoader.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/remote/ZipLoader.ts
 * @see jszip.js https://github.com/Stuk/jszip
 */
export default class ZipLoader {

    /**
     * 加载远程资源
     * @param url 资源地址
     * @param callback 加载回调
     */
    public static loadRemote(url: string, callback?: (error: Error, zip: JSZip) => void) {
        return new Promise<JSZip>(res => {
            cc.assetManager.loadRemote(url, (error: Error, asset: cc.Asset) => {
                if (error) {
                    cc.error(error);
                    callback && callback(error, null);
                    res(null);
                    return;
                }
                if (!(asset instanceof cc.Asset) || !asset['_nativeAsset']) {
                    cc.error(new Error('invalid asset'));
                    callback && callback(new Error('invalid asset'), null);
                    res(null);
                    return;
                }
                const jszip = new JSZip(),
                    nativeAsset = asset['_nativeAsset'];
                jszip.loadAsync(nativeAsset)
                    .then((zip: JSZip) => {
                        callback && callback(null, zip);
                        res(zip);
                    })
                    .catch((error: Error) => {
                        cc.error(error);
                        callback && callback(error, null);
                        res(null);
                    });
            });
        });
    }

    /**
     * 转为文本
     * @param file 
     */
    public static toText(file: any) {
        return new Promise<any>(res => {
            if (file) {
                file.async('text')
                    .then((result: string) => {
                        res(result);
                    })
                    .catch((error: Error) => {
                        cc.error(error);
                        res(null);
                    });
            } else {
                res(null);
            }
        });
    }

    /**
     * 转为 Json
     * @param file 
     */
    public static async toJson(file: any) {
        const text = await ZipLoader.toText(file);
        if (!text) {
            return null;
        }
        try {
            return JSON.parse(text);
        } catch (error) {
            cc.error(error);
            return null;
        }
    }

    /**
     * 转为 Base64
     * @param file 
     */
    public static toBase64(file: any) {
        return new Promise<string>(res => {
            if (file) {
                file.async('base64')
                    .then((result: string) => {
                        res(result);
                    })
                    .catch((error: Error) => {
                        cc.error(error);
                        res(null);
                    });
            } else {
                res(null);
            }
        });
    }

    /**
     * 转为 cc.Texture2D 资源
     * @param file 
     */
    public static async toCCTexture(file: any) {
        let base64 = await ZipLoader.toBase64(file);
        if (!base64) {
            return null;
        }
        if (!base64.startsWith('data:image/png')) {
            base64 = `data:image/png;base64,${base64}`;
        }
        return ZipLoader.base64ToTexture(base64);
    }

    /**
     * 将 Base64 字符转为 cc.Texture2D 资源
     * @param base64 Base64 字符
     */
    private static base64ToTexture(base64: string): cc.Texture2D {
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

if (CC_DEV) {
    window['JSZip'] = JSZip;
}
