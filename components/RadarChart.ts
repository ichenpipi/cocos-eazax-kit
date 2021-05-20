const { ccclass, property, executeInEditMode, executionOrder } = cc._decorator;

/**
 * 雷达图组件（cc.Graphics）
 * @see RadarChart.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/RadarChart.ts
 * @see Example https://ifaswind.gitee.io/eazax-cases/?case=radarChart
 * @version 20210521
 */
@ccclass
@executeInEditMode
@executionOrder(-1)
export default class RadarChart extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '绘制节点（不指定则默认为当前节点）' })
    protected target: cc.Node = null;

    @property protected _axisLength: number = 200;
    @property({ tooltip: CC_DEV && '轴线长度' })
    public get axisLength() { return this._axisLength; }
    public set axisLength(value: number) { this._axisLength = value; this.draw(this.curDatas); }

    @property protected _axes: number = 6;
    @property({ tooltip: CC_DEV && '轴线数量（至少 3 条）' })
    public get axes() { return this._axes; }
    public set axes(value: number) { this._axes = Math.floor(value >= 3 ? value : 3); this.draw(this.curDatas); }

    @property protected _axisScales: number = 3;
    @property({ tooltip: CC_DEV && '轴线上的刻度数（至少 1 个）' })
    public get axisScales() { return this._axisScales; }
    public set axisScales(value: number) { this._axisScales = Math.floor(value >= 1 ? value : 1); this.draw(this.curDatas); }

    @property protected _drawAxes: boolean = true;
    @property({ tooltip: CC_DEV && '是否绘制轴线' })
    public get drawAxes() { return this._drawAxes; }
    public set drawAxes(value: boolean) { this._drawAxes = value; this.draw(this.curDatas); }

    @property protected _gridLineWidth: number = 4;
    @property({ tooltip: CC_DEV && '轴线和外网格线的宽度' })
    public get gridLineWidth() { return this._gridLineWidth; }
    public set gridLineWidth(value: number) { this._gridLineWidth = value; this.draw(this.curDatas); }

    @property protected _innerGridLineWidth: number = 4;
    @property({ tooltip: CC_DEV && '内网格线宽度' })
    public get innerGridLineWidth() { return this._innerGridLineWidth; }
    public set innerGridLineWidth(value: number) { this._innerGridLineWidth = value; this.draw(this.curDatas); }

    @property protected _gridLineColor: cc.Color = cc.Color.GRAY;
    @property({ tooltip: CC_DEV && '轴线和网格线的颜色' })
    public get gridLineColor() { return this._gridLineColor; }
    public set gridLineColor(value: cc.Color) { this._gridLineColor = value; this.draw(this.curDatas); }

    @property protected _gridFillColor: cc.Color = cc.color(100, 100, 100, 100);
    @property({ tooltip: CC_DEV && '网格内部填充的颜色' })
    public get gridFillColor() { return this._gridFillColor; }
    public set gridFillColor(value: cc.Color) { this._gridFillColor = value; this.draw(this.curDatas); }

    @property protected _dataValuesStrings: string[] = ['0.8,0.5,0.6,0.5,0.8,0.6', '0.5,0.9,0.5,0.8,0.5,0.9'];
    @property({ type: [cc.String], tooltip: CC_DEV && '数据数值（字符串形式，使用英文逗号分隔）' })
    public get dataValuesStrings() { return this._dataValuesStrings; }
    public set dataValuesStrings(value: string[]) { this._dataValuesStrings = value; this.drawWithProperties(); }

    @property protected _dataLineWidths: number[] = [5, 5];
    @property({ type: [cc.Integer], tooltip: CC_DEV && '数据线宽度' })
    public get dataLineWidths() { return this._dataLineWidths; }
    public set dataLineWidths(value: number[]) { this._dataLineWidths = value; this.drawWithProperties(); }

    @property protected _dataLineColors: cc.Color[] = [cc.Color.BLUE, cc.Color.RED];
    @property({ type: [cc.Color], tooltip: CC_DEV && '数据线颜色' })
    public get dataLineColors() { return this._dataLineColors; }
    public set dataLineColors(value: cc.Color[]) { this._dataLineColors = value; this.drawWithProperties(); }

    @property protected _dataFillColors: cc.Color[] = [cc.color(120, 120, 180, 100), cc.color(180, 120, 120, 100)];
    @property({ type: [cc.Color], tooltip: CC_DEV && '数据填充颜色' })
    public get dataFillColors() { return this._dataFillColors; }
    public set dataFillColors(value: cc.Color[]) { this._dataFillColors = value; this.drawWithProperties(); }

    @property protected _dataJoinColors: cc.Color[] = [];
    @property({ type: [cc.Color], tooltip: CC_DEV && '数据节点颜色' })
    public get dataJoinColors() { return this._dataJoinColors; }
    public set dataJoinColors(value: cc.Color[]) { this._dataJoinColors = value; this.drawWithProperties(); }

    @property protected _drawDataJoin: boolean = true;
    @property({ tooltip: CC_DEV && '是否绘制数据节点' })
    public get drawDataJoin() { return this._drawDataJoin; }
    public set drawDataJoin(value: boolean) { this._drawDataJoin = value; this.draw(this.curDatas); }

    protected graphics: cc.Graphics = null;

    protected keepUpdating: boolean = false;

    protected angles: number[] = null;

    protected _curDatas: RadarChartData[] = [];
    public get curDatas() { return this._curDatas; }

    protected toRes: () => void = null;

    protected onLoad() {
        this.init();
        this.drawWithProperties();
    }

    protected update() {
        if (!this.keepUpdating || this._curDatas.length === 0) {
            return;
        }
        this.draw(this._curDatas);
    }

    /**
     * 初始化
     */
    protected init() {
        // 获取组件
        if (!this.target) {
            this.target = this.node;
        }
        this.graphics = this.target.getComponent(cc.Graphics) || this.target.addComponent(cc.Graphics);
        // 设置端点和拐角样式
        this.graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
        this.graphics.lineCap = cc.Graphics.LineCap.ROUND;
    }

    /**
     * 使用当前属性绘制
     */
    protected drawWithProperties() {
        // 获取属性面板配置
        const datas: RadarChartData[] = [],
            valueStrings = this.dataValuesStrings,
            lineWidths = this._dataLineWidths,
            lineColors = this._dataLineColors,
            fillColors = this._dataFillColors,
            joinColors = this._dataJoinColors;
        for (let i = 0; i < valueStrings.length; i++) {
            datas.push({
                values: this.processValuesString(valueStrings[i]),
                lineWidth: lineWidths[i] || defaultOptions.lineWidth,
                lineColor: lineColors[i] || defaultOptions.lineColor,
                fillColor: fillColors[i] || defaultOptions.fillColor,
                joinColor: joinColors[i] || defaultOptions.joinColor
            });
        }
        // 绘制
        this.draw(datas);
    }

    /**
     * 将数值字符串转为数值数组
     * @param valuesString 数值字符串
     */
    protected processValuesString(valuesString: string): number[] {
        const strings = valuesString.split(','),
            values: number[] = [];
        for (let j = 0; j < strings.length; j++) {
            const value = parseFloat(strings[j]);
            values.push(isNaN(value) ? 0 : value);
        }
        return values;
    }

    /**
     * 画基本线框
     */
    protected drawBase() {
        // 填充染料
        const graphics = this.graphics;
        graphics.lineWidth = this._gridLineWidth;
        graphics.strokeColor = this._gridLineColor;
        graphics.fillColor = this._gridFillColor;

        // 计算轴线角度
        const angles = this.angles = [],
            // 轴间夹角
            iAngle = 360 / this.axes;
        for (let i = 0; i < this.axes; i++) {
            angles.push(iAngle * i);
        }

        // 计算刻度坐标
        const scalesSet: cc.Vec2[][] = [],
            axisLength = this._axisLength,
            axisScales = this._axisScales,
            iLength = axisLength / axisScales;
        for (let i = 0; i < axisScales; i++) {
            const scales = [];
            // 计算刻度在轴上的位置
            const length = axisLength - (iLength * i);
            for (let j = 0, l = this.angles.length; j < l; j++) {
                // 将角度转为弧度
                const radian = (Math.PI / 180) * this.angles[j];
                // 根据三角公式计算刻度相对于中心点（0, 0）的坐标
                scales.push(cc.v2(length * Math.cos(radian), length * Math.sin(radian)));
            }
            scalesSet.push(scales);
        }

        // 创建轴线
        const out = scalesSet[0];
        if (this._drawAxes) {
            for (let i = 0; i < out.length; i++) {
                graphics.moveTo(0, 0);
                graphics.lineTo(out[i].x, out[i].y);
            }
        }

        // 创建外网格线
        graphics.moveTo(out[0].x, out[0].y);
        for (let i = 1; i < out.length; i++) {
            graphics.lineTo(out[i].x, out[i].y);
        }
        // 闭合当前线条（外网格线）
        graphics.close();

        // 填充线条包围的空白区域
        graphics.fill();
        // 绘制已创建的线条（轴线和外网格线）
        graphics.stroke();

        // 画内网格线
        if (scalesSet.length > 1) {
            graphics.lineWidth = this._innerGridLineWidth;
            // 创建内网格线
            for (let i = 1; i < scalesSet.length; i++) {
                const set = scalesSet[i];
                graphics.moveTo(set[0].x, set[0].y);
                for (let j = 1; j < set.length; j++) {
                    graphics.lineTo(set[j].x, set[j].y);
                }
                // 闭合当前线条（内网格线）
                graphics.close();
            }
            // 绘制已创建的线条（内网格线）
            graphics.stroke();
        }
    }

    /**
     * 绘制数据
     * @param data 数据
     */
    public draw(data: RadarChartData | RadarChartData[]) {
        // 擦除旧图像
        const graphics = this.graphics;
        graphics.clear();

        // 画轴线和网格线
        this.drawBase();

        // 包装单条数据
        const datas = Array.isArray(data) ? data : [data];
        this._curDatas = datas;

        // 数值不足需补 0
        this.resizeCurDatasValues(0);

        // 开始绘制数据
        const axes = this.axes,
            axisLength = this.axisLength,
            angles = this.angles;
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            // 装填染料
            graphics.strokeColor = data.lineColor || defaultOptions.lineColor;
            graphics.fillColor = data.fillColor || defaultOptions.fillColor;
            graphics.lineWidth = data.lineWidth || defaultOptions.lineWidth;

            // 计算节点坐标
            const coords = [];
            for (let j = 0; j < axes; j++) {
                const length = (data.values[j] > 1 ? 1 : data.values[j]) * axisLength,
                    radian = (Math.PI / 180) * angles[j];
                coords.push(cc.v2(length * Math.cos(radian), length * Math.sin(radian)));
            }

            // 创建线条
            graphics.moveTo(coords[0].x, coords[0].y);
            for (let j = 1; j < coords.length; j++) {
                graphics.lineTo(coords[j].x, coords[j].y);
            }
            // 闭合线条
            graphics.close();

            // 填充包围区域
            graphics.fill();
            // 绘制线条
            graphics.stroke();

            // 绘制数据节点
            if (this._drawDataJoin) {
                for (let j = 0; j < coords.length; j++) {
                    const coord = coords[j];
                    // 大圆
                    graphics.strokeColor = data.lineColor || defaultOptions.lineColor;
                    graphics.circle(coord.x, coord.y, 2);
                    graphics.stroke();
                    // 小圆
                    graphics.strokeColor = data.joinColor || defaultOptions.joinColor;
                    graphics.circle(coord.x, coord.y, .65);
                    graphics.stroke();
                }
            }
        }
    }

    /**
     * 缓动绘制
     * @param data 目标数据
     * @param duration 动画时长
     */
    public to(data: RadarChartData | RadarChartData[], duration: number): Promise<void> {
        return new Promise(res => {
            // 处理上一个 Promise
            this.unscheduleAllCallbacks();
            this.toRes && this.toRes();
            this.toRes = res;

            // 包装单条数据
            const datas = Array.isArray(data) ? data : [data];

            // 打开每帧更新
            this.keepUpdating = true;

            // 动起来！
            for (let i = 0; i < datas.length; i++) {
                const curData = this._curDatas[i];
                if (!curData) {
                    continue;
                }
                // 数值动起来！
                const data = datas[i];
                for (let j = 0; j < curData.values.length; j++) {
                    cc.tween(curData.values)
                        .to(duration, { [j]: (data.values[j] > 1) ? 1 : data.values[j] })
                        .start();
                }
                // 样式动起来！
                cc.tween(curData)
                    .to(duration, {
                        lineWidth: data.lineWidth || curData.lineWidth,
                        lineColor: data.lineColor || curData.lineColor,
                        fillColor: data.fillColor || curData.fillColor,
                        joinColor: data.joinColor || curData.joinColor
                    })
                    .start();
            }

            this.scheduleOnce(() => {
                // 关闭每帧更新
                this.keepUpdating = false;
                // resolve Promise
                this.toRes();
                this.toRes = null;
            }, duration);
        });
    }

    /**
     * 检查并调整数据中的数值数量
     * @param fill 填充数值
     */
    protected resizeCurDatasValues(fill: number = 0) {
        const curDatas = this._curDatas;
        for (let i = 0; i < curDatas.length; i++) {
            const curData = curDatas[i];
            // 数值数量少于轴数时才进行调整
            if (curData.values.length < this._axes) {
                const diff = this._axes - curData.values.length;
                for (let j = 0; j < diff; j++) {
                    curData.values.push(fill);
                }
            }
        }
    }

}

/**
 * 雷达图数据
 */
export interface RadarChartData {

    /** 数值 */
    values: number[];

    /** 线的宽度 */
    lineWidth?: number;

    /** 线的颜色 */
    lineColor?: cc.Color;

    /** 填充的颜色 */
    fillColor?: cc.Color;

    /** 节点的颜色 */
    joinColor?: cc.Color;

}

/**
 * 不指定时使用的样式配置
 */
const defaultOptions = {
    lineWidth: 5,
    lineColor: cc.Color.BLUE,
    fillColor: cc.color(120, 120, 180, 100),
    joinColor: cc.Color.WHITE,
}
