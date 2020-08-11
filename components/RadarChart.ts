const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class RadarChart extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '绘制目标节点' })
    public target: cc.Node = null;

    @property({ tooltip: CC_DEV && '轴长' })
    public axisLength: number = 200;

    @property({ tooltip: CC_DEV && '轴数（至少 3 条）' })
    public set axes(value: number) { this._axes = value >= 3 ? value : 3; }
    public get axes() { return this._axes; }
    private _axes: number = 6;

    @property({ tooltip: CC_DEV && '是否绘制轴' })
    public drawAxes: boolean = true;

    @property({ tooltip: CC_DEV && '轴上节点数（至少 1 个，不包括圆心）' })
    public set nodesPerAxle(value: number) { this._nodesPerAxle = value >= 1 ? value : 1; }
    public get nodesPerAxle() { return this._nodesPerAxle; }
    private _nodesPerAxle: number = 3;

    @property({ tooltip: CC_DEV && '轴和外线的宽度' })
    public baseLineWidth: number = 3;

    @property({ tooltip: CC_DEV && '内线宽度' })
    public innerLineWidth: number = 3;

    @property({ tooltip: CC_DEV && '基本线颜色' })
    public baseLineColor: cc.Color = cc.Color.GRAY;

    @property({ tooltip: CC_DEV && '基本填充颜色' })
    public baseFillColor: cc.Color = cc.color(120, 180, 120, 100);

    @property({ type: [cc.String], tooltip: CC_DEV && '数据数值字符串（使用英文逗号分隔，数值单位：%）' })
    public set valuesStrings(value: string[]) { this._valuesStrings = value; this.drawWithProperties(); }
    public get valuesStrings() { return this._valuesStrings; }
    private _valuesStrings: string[] = ['0.8,0.5,0.6,0.5,0.8,0.6', '0.5,0.9,0.5,0.8,0.5,0.9'];

    @property({ type: [cc.Integer], tooltip: CC_DEV && '数据线宽度' })
    public set dataLineWidths(value: number[]) { this._dataLineWidths = value; this.drawWithProperties(); }
    public get dataLineWidths() { return this._dataLineWidths; }
    private _dataLineWidths: number[] = [4, 4];

    @property({ type: [cc.Color], tooltip: CC_DEV && '数据线颜色' })
    public set dataLineColors(value: cc.Color[]) { this._dataLineColors = value; this.drawWithProperties(); }
    public get dataLineColors() { return this._dataLineColors; }
    private _dataLineColors: cc.Color[] = [cc.Color.BLUE, cc.Color.RED];

    @property({ type: [cc.Color], tooltip: CC_DEV && '数据填充颜色' })
    public set dataFillColors(value: cc.Color[]) { this._dataFillColors = value; this.drawWithProperties(); }
    public get dataFillColors() { return this._dataFillColors; }
    private _dataFillColors: cc.Color[] = [cc.color(120, 120, 180, 100), cc.color(180, 120, 120, 100)];

    @property({ tooltip: CC_DEV && '是否绘制数据节点' })
    public drawDataJoin: boolean = true;

    @property({ tooltip: '每帧更新' })
    private keepUpdating: boolean = true;

    private graphics: cc.Graphics = null;

    private angles: number[] = null;

    private curDatas: RadarChartData[] = [];

    protected onLoad() {
        this.init();
    }

    protected start() {
        this.drawWithProperties();

        // to 使用实例
        // this.to([{
        //     values: [1, 1, 1, 1, 1, 1],
        //     lineWidth: 3,
        //     lineColor: cc.Color.RED,
        //     fillColor: cc.color(120, 120, 180, 200)
        // },
        // {
        //     values: [0, 0, 0, 0, 0, 0],
        //     lineWidth: 3,
        //     lineColor: cc.Color.BLUE,
        //     fillColor: cc.color(180, 120, 120, 200)
        // }], 5);
    }

    private drawWithProperties() {
        let datas: RadarChartData[] = [];
        for (let i = 0; i < this.valuesStrings.length; i++) {
            datas.push({
                values: this.processValuesString(this.valuesStrings[i]),
                lineWidth: this.dataLineWidths[i] || this.dataLineWidths[0] || 3,
                lineColor: this.dataLineColors[i] || this.dataLineColors[0] || cc.Color.BLUE,
                fillColor: this.dataFillColors[i] || this.dataFillColors[0] || cc.color(120, 120, 180, 200)
            });
        }
        this.draw(datas);
    }

    protected update() {
        if (!this.keepUpdating || this.curDatas.length === 0) return;
        this.draw(this.curDatas);
    }

    private init() {
        if (!this.target) this.target = this.node;
        this.graphics = this.target.getComponent(cc.Graphics) || this.target.addComponent(cc.Graphics);

        this.graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
        this.graphics.lineCap = cc.Graphics.LineCap.ROUND;
    }

    /**
     * 画基本线框
     */
    private drawBase() {
        // 填充染料
        this.graphics.lineWidth = this.baseLineWidth;
        this.graphics.strokeColor = this.baseLineColor;
        this.graphics.fillColor = this.baseFillColor;

        // 计算角度
        this.angles = [];
        const gap = 360 / this.axes;
        for (let i = 0; i < this.axes; i++) this.angles.push(gap * i);

        // 计算节点坐标
        let pointSet = [];
        for (let i = 0; i < this.nodesPerAxle; i++) {
            let points = [];
            const length = this.axisLength - (this.axisLength / this.nodesPerAxle * i);
            for (let j = 0; j < this.angles.length; j++) {
                const radian = (Math.PI / 180) * this.angles[j];
                points.push(cc.v2(length * Math.cos(radian), length * Math.sin(radian)));
            }
            pointSet.push(points);
        }

        // 画轴
        if (this.drawAxes) {
            for (let i = 0; i < pointSet[0].length; i++) {
                this.graphics.moveTo(0, 0);
                this.graphics.lineTo(pointSet[0][i].x, pointSet[0][i].y);
            }
        }
        // 画外线并闭合
        this.graphics.moveTo(pointSet[0][0].x, pointSet[0][0].y);
        for (let i = 1; i < pointSet[0].length; i++) {
            this.graphics.lineTo(pointSet[0][i].x, pointSet[0][i].y);
        }
        this.graphics.close();
        // 填充颜色
        this.graphics.fill();
        // 绘制线段
        this.graphics.stroke();

        // 画内线并闭合
        if (pointSet.length > 1) {
            this.graphics.lineWidth = this.innerLineWidth;
            for (let i = 1; i < pointSet.length; i++) {
                this.graphics.moveTo(pointSet[i][0].x, pointSet[i][0].y);
                for (let j = 1; j < pointSet[i].length; j++) {
                    this.graphics.lineTo(pointSet[i][j].x, pointSet[i][j].y);
                }
                this.graphics.close();
            }
            // 绘制内线
            this.graphics.stroke();
        }
    }

    public draw(datas: RadarChartData | RadarChartData[]) {
        // 处理单条数据
        if (!Array.isArray(datas)) datas = [datas];

        // 清除旧图像
        this.graphics.clear();

        // 画基础表
        this.drawBase();

        // 开始绘制数据
        this.curDatas = datas;
        for (let i = 0; i < datas.length; i++) {
            this.graphics.strokeColor = datas[i].lineColor;
            this.graphics.fillColor = datas[i].fillColor;
            this.graphics.lineWidth = datas[i].lineWidth;
            // 计算节点坐标
            let points = [];
            for (let j = 0; j < this.axes; j++) {
                const length = datas[i].values[j] * this.axisLength;
                const radian = (Math.PI / 180) * this.angles[j];
                points.push(cc.v2(length * Math.cos(radian), length * Math.sin(radian)));
            }
            // 画线并闭合
            this.graphics.moveTo(points[0].x, points[0].y);
            for (let j = 1; j < points.length; j++) {
                this.graphics.lineTo(points[j].x, points[j].y);
            }
            this.graphics.close();
            // 填充颜色
            this.graphics.fill();
            // 绘制线段
            this.graphics.stroke();

            // 绘制节点
            if (this.drawDataJoin) {
                for (let j = 0; j < points.length; j++) {
                    // 大圆
                    this.graphics.strokeColor = datas[i].lineColor;
                    this.graphics.circle(points[j].x, points[j].y, 2);
                    this.graphics.stroke();
                    // 小圆
                    this.graphics.strokeColor = cc.Color.WHITE;
                    this.graphics.circle(points[j].x, points[j].y, 0.75);
                    this.graphics.stroke();
                }
            }
        }
    }

    public to(datas: RadarChartData | RadarChartData[], duration: number): Promise<void> {
        return new Promise(res => {
            // 处理单条数据
            if (!Array.isArray(datas)) datas = [datas];

            this.keepUpdating = true;
            for (let i = 0; i < datas.length; i++) {
                if (!this.curDatas[i]) continue;
                for (let j = 0; j < this.curDatas[i].values.length; j++) {
                    cc.tween(this.curDatas[i].values)
                        .to(duration, {
                            [j]: datas[i].values[j]
                        })
                        .start();
                }
                cc.tween(this.curDatas[i])
                    .to(duration, {
                        lineWidth: datas[i].lineWidth,
                        lineColor: datas[i].lineColor,
                        fillColor: datas[i].fillColor,
                    })
                    .start();
            }
            setTimeout(() => {
                this.keepUpdating = false;
                res();
            }, duration);
        });
    }

    private processValuesString(dataString: string): number[] {
        const strings: string[] = dataString.split(',');
        let numbers: number[] = [];
        for (let j = 0; j < strings.length; j++) {
            numbers.push(parseFloat(strings[j]));
        }
        return numbers;
    }

}

export interface RadarChartData {
    values: number[];
    lineColor: cc.Color;
    lineWidth: number;
    fillColor: cc.Color;
}