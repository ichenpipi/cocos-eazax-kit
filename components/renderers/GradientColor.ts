const { ccclass, property, requireComponent, disallowMultiple, executeInEditMode } = cc._decorator;

/**
 * 渐变颜色，支持 Sprite（SIMPLE 和 FILLED）和 Label，注意这会覆盖默认的节点颜色设置
 * @see GradientColor.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/renderers/GradientColor.ts
 */
@ccclass
@requireComponent(cc.RenderComponent)
@disallowMultiple
@executeInEditMode
export default class GradientColor extends cc.Component {

    @property protected _colors: cc.Color[] = [cc.Color.RED, cc.Color.BLUE, cc.Color.RED, cc.Color.BLUE];
    @property({ type: [cc.Color], tooltip: CC_DEV && '支持最多 4 种颜色（左下、右下、左上、右上）' })
    public get colors() { return this._colors; }
    public set colors(colors) {
        if (colors.length > 4) {
            colors.length = 4;
        }
        this._colors = colors;
        this.markForRender();
    }

    protected onEnable() {
        this.replaceFunction();
    }

    protected onDisable() {
        this.restoreFunction();
    }

    protected resetInEditor() {
        this.markForRender();
    }

    /**
     * 替换颜色填充函数
     */
    protected replaceFunction() {
        // 获取渲染组件
        const renderComponent = this.getComponent(cc.RenderComponent);
        if (!renderComponent) return;
        // 获取装配器
        const assembler = renderComponent._assembler;
        if (!(assembler instanceof cc.Assembler2D)) return;
        // 替换颜色填充函数
        assembler.updateColor = () => {
            // 获取颜色数据缓存
            const uintVDatas = assembler._renderData.uintVDatas[0];
            if (!uintVDatas) return;
            // 顶点数据
            const floatsPerVert = assembler.floatsPerVert;  // 每个顶点的数据数量
            const colorOffset = assembler.colorOffset;      // 颜色偏移
            const nodeColor = this.node.color;              // 节点颜色
            let offset = 0;
            for (let i = colorOffset, l = uintVDatas.length; i < l; i += floatsPerVert) {
                uintVDatas[i] = (this.colors[offset++] || nodeColor)._val;
            }
        }
        // 标记
        this.markForRender();
    }

    /**
     * 还原颜色填充函数
     */
    protected restoreFunction() {
        // 获取渲染组件
        const renderComponent = this.getComponent(cc.RenderComponent);
        if (!renderComponent) return;
        // 获取装配器
        const assembler = renderComponent._assembler;
        if (!(assembler instanceof cc.Assembler2D)) return;
        // 恢复颜色填充函数
        assembler.updateColor = cc.Assembler2D.prototype.updateColor;
        // 标记
        this.markForRender();
    }

    /**
     * 标记
     */
    protected markForRender() {
        this.node._renderFlag |= cc.RenderFlow.FLAG_COLOR;
    }

}
