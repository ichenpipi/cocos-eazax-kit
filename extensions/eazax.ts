/**
 * Eazax 全局命名空间
 */
namespace eazax {

    /**
     * 打出光彩夺目的日志（黑蓝白配色）
     * @param title 标题
     * @param msg 信息
     */
    export function log(title: any, msg?: any): void {
        if (msg) {
            console.log(
                `%c ${title} %c ${msg} `,
                'background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;',
                'background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;'
            );
        } else {
            console.log(
                `%c ${title} `,
                'background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;',
            );
        }
    }

    /**
     * 显示左下角的统计面板
     */
    export function showStats(): void {
        cc.debug.setDisplayStats(true);
    }

    /**
     * 更改统计面板的文本颜色
     * @param color 文本颜色
     */
    export function setStatsColor(color: cc.Color) {
        const profilerNode = cc.director.getScene().getChildByName('PROFILER-NODE');
        if (!profilerNode) return;
        profilerNode.children.forEach(node => node.color = color);
    }

    /**
     * 上一次渲染帧所提交的渲染批次总数
     */
    export function getDrawCalls(): number {
        return cc.renderer.drawCalls;
    }

}

window.eazax = eazax;
