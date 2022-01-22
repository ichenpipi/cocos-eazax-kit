/**
 * Base64 工具
 * @author 陈皮皮 (ifaswind)
 * @version 20220122
 * @see Base64Util.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/Base64Util.ts
 */
export default class Base64Util {

    /**
     * 将普通文本编码为 Base64 格式文本
     * @param string 
     * @see
     */
    public static encodeString(string: string) {
        // codes from http://www.webtoolkit.info/javascript-base64.html
        const keyString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        let base64 = '';
        let i = 0;
        let chr1: number, chr2: number, chr3: number,
            enc1: number, enc2: number, enc3: number, enc4: number;

        string = Base64Util.encodeUtf8(string);

        while (i < string.length) {
            chr1 = string.charCodeAt(i++);
            chr2 = string.charCodeAt(i++);
            chr3 = string.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            base64 = base64 + keyString.charAt(enc1) + keyString.charAt(enc2) + keyString.charAt(enc3) + keyString.charAt(enc4);
        }

        return base64;
    }

    /**
     * 将 Base64 格式文本解码为普通文本
     * @param base64 
     */
    public static decodeString(base64: string) {
        // codes from http://www.webtoolkit.info/javascript-base64.html
        const keyString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        let string = '';
        let i = 0;
        let chr1: number, chr2: number, chr3: number,
            enc1: number, enc2: number, enc3: number, enc4: number;

        base64 = base64.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < base64.length) {
            enc1 = keyString.indexOf(base64.charAt(i++));
            enc2 = keyString.indexOf(base64.charAt(i++));
            enc3 = keyString.indexOf(base64.charAt(i++));
            enc4 = keyString.indexOf(base64.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            string = string + String.fromCharCode(chr1);

            if (enc3 != 64) {
                string = string + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                string = string + String.fromCharCode(chr3);
            }
        }

        string = Base64Util.decodeUtf8(string);

        return string;
    }

    /**
     * 将普通文本编码为 UTF-8 格式文本
     * @param string 
     */
    public static encodeUtf8(string: string) {
        // codes from http://www.webtoolkit.info/javascript-base64.html
        string = string.replace(/\r\n/g, "\n");
        let utf8 = '';

        for (let i = 0; i < string.length; i++) {
            const c = string.charCodeAt(i);

            if (c < 128) {
                utf8 += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utf8 += String.fromCharCode((c >> 6) | 192);
                utf8 += String.fromCharCode((c & 63) | 128);
            } else {
                utf8 += String.fromCharCode((c >> 12) | 224);
                utf8 += String.fromCharCode(((c >> 6) & 63) | 128);
                utf8 += String.fromCharCode((c & 63) | 128);
            }
        }

        return utf8;
    }

    /**
     * 将为 UTF-8 格式文本解码为普通文本
     * @param utf8 
     */
    public static decodeUtf8(utf8: string) {
        // codes from http://www.webtoolkit.info/javascript-base64.html
        let string = '';
        let i = 0;
        let c1 = 0, c2 = 0, c3 = 0;

        while (i < utf8.length) {
            c1 = utf8.charCodeAt(i);

            if (c1 < 128) {
                string += String.fromCharCode(c1);
                i++;
            } else if ((c1 > 191) && (c1 < 224)) {
                c2 = utf8.charCodeAt(i + 1);
                string += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utf8.charCodeAt(i + 1);
                c3 = utf8.charCodeAt(i + 2);
                string += String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }

        return string;
    }

    /**
     * (仅 Web 平台下可用) 将 Base64 文本转为二进制数据
     * @param base64 
     */
    public static base64ToBlob(base64: string) {
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

if (CC_PREVIEW) {
    window['Base64Util'] = Base64Util;
}
