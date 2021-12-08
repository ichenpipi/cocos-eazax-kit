/**
 * 渲染工具
 * @author 陈皮皮 (ifaswind)
 * @version 20211208
 * @see RenderUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/RenderUtil.ts
 */
export default class RenderUtil {

    /**
     * 获取节点的 RenderTexture
     * @param node 节点
     * @param out 输出
     */
    public static getRenderTexture(node: cc.Node, out?: cc.RenderTexture) {
        // 检查参数
        if (!cc.isValid(node)) {
            return null;
        }
        if (!out || !(out instanceof cc.RenderTexture)) {
            out = new cc.RenderTexture();
        }
        // 获取宽高
        const width = Math.floor(node.width),
            height = Math.floor(node.height);
        // 初始化 RenderTexture
        out.initWithSize(width, height);
        // 创建临时摄像机用于渲染目标节点
        const cameraNode = new cc.Node();
        cameraNode.parent = node;
        const camera = cameraNode.addComponent(cc.Camera);
        camera.clearFlags |= cc.Camera.ClearFlags.COLOR;
        camera.backgroundColor = cc.color(0, 0, 0, 0);
        camera.zoomRatio = cc.winSize.height / height;
        // 将节点渲染到 RenderTexture 中
        camera.targetTexture = out;
        camera.render(node);
        // 销毁临时对象
        cameraNode.destroy();
        // 返回 RenderTexture
        return out;
    }

    /**
     * 使用指定材质来将 RenderTexture 渲染到另一个 RenderTexture
     * @param srcRT 来源
     * @param dstRT 目标
     * @param material 材质
     */
    public static renderWithMaterial(srcRT: cc.RenderTexture, dstRT: cc.RenderTexture | cc.Material, material?: cc.Material) {
        // 检查参数
        if (dstRT instanceof cc.Material) {
            material = dstRT;
            dstRT = new cc.RenderTexture();
        }
        // 创建临时节点（用于渲染 RenderTexture）
        const tempNode = new cc.Node();
        tempNode.setParent(cc.Canvas.instance.node);
        const tempSprite = tempNode.addComponent(cc.Sprite);
        tempSprite.sizeMode = cc.Sprite.SizeMode.RAW;
        tempSprite.trim = false;
        tempSprite.spriteFrame = new cc.SpriteFrame(srcRT);
        // 获取图像宽高
        const width = srcRT.width,
            height = srcRT.height;
        // 初始化 RenderTexture
        dstRT.initWithSize(width, height);
        // 更新材质
        if (material instanceof cc.Material) {
            tempSprite.setMaterial(0, material);
        }
        // 创建临时摄像机（用于渲染临时节点）
        const cameraNode = new cc.Node();
        cameraNode.setParent(tempNode);
        const camera = cameraNode.addComponent(cc.Camera);
        camera.clearFlags |= cc.Camera.ClearFlags.COLOR;
        camera.backgroundColor = cc.color(0, 0, 0, 0);
        camera.zoomRatio = cc.winSize.height / height;
        // 将临时节点渲染到 RenderTexture 中
        camera.targetTexture = dstRT;
        camera.render(tempNode);
        // 销毁临时对象
        cameraNode.destroy();
        tempNode.destroy();
        // 返回 RenderTexture
        return dstRT;
    }

    /**
     * 获取像素数据
     * @param node 节点
     * @param flipY 垂直翻转数据
     */
    public static getPixelsData(node: cc.Node, flipY: boolean = true) {
        if (!cc.isValid(node)) {
            return null;
        }
        // 节点宽高
        const width = Math.floor(node.width),
            height = Math.floor(node.height);
        // 创建临时摄像机用于渲染目标节点
        const cameraNode = new cc.Node();
        cameraNode.parent = node;
        const camera = cameraNode.addComponent(cc.Camera);
        camera.clearFlags |= cc.Camera.ClearFlags.COLOR;
        camera.backgroundColor = cc.color(0, 0, 0, 0);
        camera.zoomRatio = cc.winSize.height / height;
        // 将节点渲染到 RenderTexture 中
        const renderTexture = new cc.RenderTexture();
        renderTexture.initWithSize(width, height, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
        camera.targetTexture = renderTexture;
        camera.render(node);
        // 获取像素数据
        const pixelsData = renderTexture.readPixels();
        // 销毁临时对象并返回数据
        renderTexture.destroy();
        cameraNode.destroy();
        // 垂直翻转数据
        if (flipY) {
            const length = pixelsData.length,
                lineWidth = width * 4,
                data = new Uint8Array(length);
            for (let i = 0, j = length - lineWidth; i < length; i += lineWidth, j -= lineWidth) {
                for (let k = 0; k < lineWidth; k++) {
                    data[i + k] = pixelsData[j + k];
                }
            }
            return data;
        }
        return pixelsData;
    }

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

}
