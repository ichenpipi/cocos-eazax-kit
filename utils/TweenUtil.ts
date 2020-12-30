/**
 * Tween 工具
 * @see TweenUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/TweenUtil.ts
 */
export default class TweenUtil {

    /**
     * 水平翻转（翻牌）
     * @param node 节点
     * @param duration 总时长
     * @param middleCallback 中间状态回调
     * @param finishCallback 结束回调
     */
    public static flip(node: cc.Node, duration: number, middleCallback?: Function, finishCallback?: Function): Promise<void> {
        return new Promise<void>(res => {
            const time = duration / 2;
            cc.tween(node)
                .parallel(
                    cc.tween().to(time, { scaleX: 0 }, { easing: 'sineIn' }),
                    cc.tween().to(time, { skewY: -10 }),
                )
                .set({ skewY: 10 })
                .call(() => {
                    middleCallback && middleCallback();
                })
                .parallel(
                    cc.tween().to(time, { scaleX: 1 }, { easing: 'sineOut' }),
                    cc.tween().to(time, { skewY: 0 }),
                )
                .call(() => {
                    res();
                    finishCallback && finishCallback();
                })
                .start();
        });
    }

}
