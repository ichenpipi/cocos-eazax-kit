const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class RadarChart extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '目标' })
    private target: cc.Node = null;

    @property({ tooltip: CC_DEV && '轴长度' })
    private axleLength: number = 200;

    @property({ tooltip: CC_DEV && '轴数' })
    private axes: number = 6;

    @property({ tooltip: CC_DEV && '线和轴的宽度' })
    private lineWidth: number = 5;

    @property({ tooltip: CC_DEV && '内线宽度' })
    private innerLineWidth: number = 3;

    @property({ tooltip: CC_DEV && '背景线颜色' })
    private baseLineColor: cc.Color = cc.Color.WHITE;

    @property({ tooltip: CC_DEV && '背景线颜色' })
    private dataLineColor: cc.Color = cc.Color.GRAY;

    @property({ tooltip: CC_DEV && '背景颜色' })
    private dataContentColor: cc.Color = cc.Color.RED;

    @property({ tooltip: CC_DEV && '每根轴上的点数（不包括圆心）' })
    private pointsPerAxle: number = 3;

    private graphics: cc.Graphics = null;

    private angels: number[] = null;

    protected onLoad() {
        if (!this.target) this.target = this.node;
        this.graphics = this.target.getComponent(cc.Graphics);
        if (!this.graphics) this.target.addComponent(cc.Graphics);
    }

    protected start() {
        this.graphics.clear();
        this.drawBase();
        this.draw();
    }

    /**
     * 画基本线框
     */
    private drawBase() {
        this.graphics.strokeColor = this.baseLineColor;
        this.graphics.lineWidth = this.lineWidth;

        // 计算角度
        this.angels = [];
        const gap = 360 / this.axes;
        for (let i = 0; i < this.axes; i++) this.angels.push(gap * i);

        // 计算点坐标
        let pointSet = [];
        for (let i = 0; i < this.pointsPerAxle; i++) {
            let points = [];
            const length = this.axleLength - (this.axleLength / this.pointsPerAxle * i);
            for (let j = 0; j < this.angels.length; j++) {
                const radian = (Math.PI / 180) * this.angels[j];
                let pos = cc.v2(length * Math.cos(radian), length * Math.sin(radian))
                points.push(pos);
            }
            pointSet.push(points);
        }

        // 画轴
        for (let i = 0; i < pointSet[0].length; i++) {
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(pointSet[0][i].x, pointSet[0][i].y);
            this.graphics.stroke();
        }

        // 闭合
        for (let i = 0; i < pointSet.length; i++) {
            this.graphics.lineWidth = (i === 0) ? this.lineWidth : this.innerLineWidth;
            this.graphics.moveTo(pointSet[i][0].x, pointSet[i][0].y);
            for (let j = 1; j < pointSet[i].length; j++) {
                this.graphics.lineTo(pointSet[i][j].x, pointSet[i][j].y);
            }
            this.graphics.lineTo(pointSet[i][0].x, pointSet[i][0].y);
            this.graphics.stroke();
        }
        this.graphics.lineWidth = this.lineWidth;
    }

    private draw() {
        this.graphics.strokeColor = this.dataLineColor;
        this.graphics.lineWidth = this.innerLineWidth;

        let data = [80, 50, 60, 30, 70, 40];

        // 计算点坐标
        let points = [];
        for (let i = 0; i < this.axes; i++) {
            const length = (data[i] || 0) / 100 * this.axleLength;
            for (let j = 0; j < this.angels.length; j++) {
                let radian = (Math.PI / 180) * this.angels[j];
                let pos = cc.v2(length * Math.cos(radian), length * Math.sin(radian))
                points.push(pos);
            }
        }

        // 画线闭合
        this.graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.graphics.lineTo(points[i].x, points[i].y);
        }
        this.graphics.lineTo(points[0].x, points[0].y);
        this.graphics.stroke();
        this.graphics.fillColor = this.dataContentColor;
        this.graphics.fill();
    }

}
