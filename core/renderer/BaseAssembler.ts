/**
 * 基础顶点装配器
 * @author 陈皮皮 (ifaswind)
 * @version 20210228
 * @see BaseAssembler.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/renderer/BaseAssembler.ts
 */
export default class BaseAssembler extends cc.Assembler {

    /**
     * 每个顶点的数据数量
     */
    public floatsPerVert: number = 5;

    /**
     * 顶点数量
     */
    public verticesCount: number = 4;

    /**
     * 索引数量
     */
    public indicesCount: number = 6;

    /**
     * UV 偏移
     */
    public uvOffset: number = 2;

    /**
     * 颜色偏移
     */
    public colorOffset: number = 4;

    /**
     * 本地坐标顶点数据
     */
    public _local: number[] = null;

    /**
     * 所有顶点的数据总数量
     */
    public get verticesFloats() {
        return this.verticesCount * this.floatsPerVert;
    }

    constructor() {
        super();
        // 创建渲染数据
        this._renderData = new cc.RenderData();
        this._renderData.init(this);
        // 初始化
        this.initData();
        this.initLocal();
    }

    /**
     * 初始化
     * @param renderComp 
     */
    public init(renderComp: cc.RenderComponent) {
        super.init(renderComp);
    }

    /**
     * 初始化渲染数据
     */
    public initData() {
        this._renderData.createQuadData(0, this.verticesFloats, this.indicesCount);
    }

    /**
     * 初始化本地坐标数据
     */
    public initLocal() {
        this._local = [];
        this._local.length = this.verticesCount;
    }

    /**
     * 更新渲染数据
     * @param comp 
     */
    public updateRenderData(comp: cc.RenderComponent) {
        if (comp._vertsDirty) {
            this.updateUVs(comp);
            this.updateVerts(comp);
            comp._vertsDirty = false;
        }
    }

    /**
     * 更新颜色数据
     * @param comp 
     * @param color 
     */
    public updateColor(comp: cc.RenderComponent, color: number) {
        const uintVerts = this._renderData.uintVDatas[0];
        if (!uintVerts) return;
        color = color != null ? color : comp.node.color._val;
        const verticesCount = this.verticesCount;
        const colorOffset = this.colorOffset;
        const floatsPerVert = this.floatsPerVert;
        for (let i = 0; i < verticesCount; i++) {
            uintVerts[colorOffset + (i * floatsPerVert)] = color;
        }
    }

    // 更新 UV 数据
    public updateUVs(comp: cc.RenderComponent) {
        // 设置纹理 UV 起始值
        const left = 0, right = 1, bottom = 1, top = 0;
        const uv: number[] = [];
        // 左下
        uv[0] = left;
        uv[1] = bottom;
        // 右下
        uv[2] = right;
        uv[3] = bottom;
        // 左上
        uv[4] = left;
        uv[5] = top;
        // 右上
        uv[6] = right;
        uv[7] = top;

        // 填充 UV 数据
        const vData = this._renderData.vDatas[0];
        const floatsPerVert = this.floatsPerVert;
        const uvOffset = this.uvOffset;
        for (let i = 0; i < 4; i++) {
            const srcOffset = i * 2;
            const dstOffset = floatsPerVert * i + uvOffset;
            vData[dstOffset] = uv[srcOffset];
            vData[dstOffset + 1] = uv[srcOffset + 1];
        }
    }

    /**
     * 更新本地坐标顶点数据
     * @param comp 
     */
    public updateVerts(comp: cc.RenderComponent) {
        const node = comp.node,
            width = node.width, height = node.height,
            appX = node.anchorX * width, appY = node.anchorY * height;

        // 依据宽高和锚点位置计算四个顶点的起始值
        const left = -appX,
            bottom = -appY,
            right = width - appX,
            top = height - appY;

        // 储存本地坐标值
        const local = this._local;
        local[0] = left;
        local[1] = bottom;
        local[2] = right;
        local[3] = top;

        // 更新世界坐标下的顶点数据
        this.updateWorldVerts(comp);
    }

    /**
     * 更新世界坐标顶点数据
     * @param comp 
     */
    public updateWorldVerts(comp: cc.RenderComponent) {
        const local = this._local;
        const verts = this._renderData.vDatas[0];

        // 节点世界矩阵
        // @ts-ignore
        const matrix = comp.node._worldMatrix;
        const matrixData = matrix.m,
            a = matrixData[0], b = matrixData[1], c = matrixData[4], d = matrixData[5],
            tx = matrixData[12], ty = matrixData[13];

        // 本地坐标值
        const vl = local[0], vr = local[2],
            vb = local[1], vt = local[3];

        const floatsPerVert = this.floatsPerVert;  // 每个顶点的数据个数
        let vertexOffset = 0;                      // 当前偏移量

        // 是否只是位置变化
        const justTranslate = a === 1 && b === 0 && c === 0 && d === 1;
        if (justTranslate) {
            // 左下
            verts[vertexOffset] = vl + tx;
            verts[vertexOffset + 1] = vb + ty;
            vertexOffset += floatsPerVert;
            // 右下
            verts[vertexOffset] = vr + tx;
            verts[vertexOffset + 1] = vb + ty;
            vertexOffset += floatsPerVert;
            // 左上
            verts[vertexOffset] = vl + tx;
            verts[vertexOffset + 1] = vt + ty;
            vertexOffset += floatsPerVert;
            // 右上
            verts[vertexOffset] = vr + tx;
            verts[vertexOffset + 1] = vt + ty;
        } else {
            const al = a * vl, ar = a * vr,
                bl = b * vl, br = b * vr,
                cb = c * vb, ct = c * vt,
                db = d * vb, dt = d * vt;

            // 左下
            verts[vertexOffset] = al + cb + tx;
            verts[vertexOffset + 1] = bl + db + ty;
            vertexOffset += floatsPerVert;
            // 右下
            verts[vertexOffset] = ar + cb + tx;
            verts[vertexOffset + 1] = br + db + ty;
            vertexOffset += floatsPerVert;
            // 左上
            verts[vertexOffset] = al + ct + tx;
            verts[vertexOffset + 1] = bl + dt + ty;
            vertexOffset += floatsPerVert;
            // 右上
            verts[vertexOffset] = ar + ct + tx;
            verts[vertexOffset + 1] = br + dt + ty;
        }
    }

    /**
     * 将渲染数据填充到全局缓冲区中
     * @param comp 组件
     * @param renderer 
     */
    public fillBuffers(comp: cc.RenderComponent, renderer: ModelBatcher) {

        // 更新顶点数据
        // @ts-ignore
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(comp);
        }

        const renderData = this._renderData,
            vData = renderData.vDatas[0],
            iData = renderData.iDatas[0];

        // 获取缓冲区
        const buffer = this.getBuffer(),
            // 通过设定的顶点数量及顶点索引数量获取 buffer 的数据空间
            offsetInfo = buffer.request(this.verticesCount, this.indicesCount);

        // 填充顶点数据
        const vertexOffset = offsetInfo.byteOffset >> 2,
            vertexBuffer = buffer._vData;
        if (vData.length + vertexOffset > vertexBuffer.length) {
            vertexBuffer.set(vData.subarray(0, vertexBuffer.length - vertexOffset), vertexOffset);
        } else {
            vertexBuffer.set(vData, vertexOffset);
        }

        // 填充索引数据
        const indicesBuffer = buffer._iData,
            vertexId = offsetInfo.vertexOffset;
        let indicesOffset = offsetInfo.indiceOffset;
        for (let i = 0, l = iData.length; i < l; i++) {
            indicesBuffer[indicesOffset++] = vertexId + iData[i];
        }
    }

    /**
     * 获取缓冲区
     */
    public getBuffer() {
        return cc.renderer._handle._meshBuffer;
    }

    // /**
    //  * 打包至动态图集
    //  * @param comp 
    //  * @param frame 
    //  */
    // public packToDynamicAtlas(comp, frame) {
    //     if (CC_TEST) return;

    //     if (!frame._original && cc.dynamicAtlasManager && frame._texture.packable) {
    //         let packedFrame = cc.dynamicAtlasManager.insertSpriteFrame(frame) as unknown as cc.SpriteFrame;
    //         if (packedFrame) {
    //             frame._setDynamicAtlasFrame(packedFrame);
    //         }
    //     }
    //     let material = comp._materials[0];
    //     if (!material) return;

    //     if (material.getProperty('texture') !== frame._texture) {
    //         // texture was packed to dynamic atlas, should update uvs
    //         comp._vertsDirty = true;
    //         comp._updateMaterial();
    //     }
    // }

}
