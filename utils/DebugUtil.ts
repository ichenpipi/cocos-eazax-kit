/**
 * 调试工具
 * @author 陈皮皮 (ifaswind)
 * @version 20200928
 * @see DebugUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/TimeUtil.ts
 */
export default class DebugUtil {

    /**
     * 打出光彩夺目的日志（黑蓝白配色）
     * @param title 标题
     * @param msg 信息
     */
    public static log(title: any, msg?: any): void {
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
     * 展示动态图集
     * @param status 状态
     */
    public static showDynamicAtlas(status: boolean = true): cc.Node {
        return cc.dynamicAtlasManager.showDebug(status);
    }

    /**
     * 展示左下角的统计面板
     * @param status 状态
     */
    public static showStats(status: boolean = true): void {
        cc.debug.setDisplayStats(status);
    }

    /**
     * 更改统计面板的文本颜色
     * @param font 文本颜色
     */
    public static setStatsColor(font: cc.Color = cc.Color.WHITE, background: cc.Color = cc.color(0, 0, 0, 150)) {
        const profiler = cc.find('PROFILER-NODE');
        if (!profiler) return cc.warn('未找到统计面板节点！');

        // 文字
        profiler.children.forEach(node => node.color = font);

        // 背景
        let node = profiler.getChildByName('BACKGROUND');
        if (!node) {
            node = new cc.Node('BACKGROUND');
            profiler.addChild(node, cc.macro.MIN_ZINDEX);
            node.setContentSize(profiler.getBoundingBoxToWorld());
            node.setPosition(0, 0);
        }
        const graphics = node.getComponent(cc.Graphics) || node.addComponent(cc.Graphics);
        graphics.clear();
        graphics.rect(-5, 12.5, node.width + 10, node.height - 10);
        graphics.fillColor = background;
        graphics.fill();
    }

    /**
     * 上一次渲染帧所提交的渲染批次总数
     */
    public static getDrawCalls(): number {
        return cc.renderer.drawCalls;
    }

}

if (CC_PREVIEW) {
    window['DebugUtil'] = DebugUtil;
}
