/**
 * Tween 工具
 * @see TweenUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/TweenUtil.ts
 */
export default class TweenUtil {

    /**
     * 水平翻转（翻牌）
     * @param node 节点
     * @param duration 总时长
     * @param onMiddle 中间状态回调
     * @param onComplete 完成回调
     */
    public static flip(node: cc.Node, duration: number, onMiddle?: Function, onComplete?: Function): Promise<void> {
        return new Promise<void>(res => {
            const time = duration / 2;
            const skew = 10;
            cc.tween(node)
                .parallel(
                    cc.tween().to(time, { scaleX: 0 }, { easing: 'sineIn' }),
                    cc.tween().to(time, { skewY: -skew }),
                )
                .set({ skewY: skew })
                .call(() => {
                    onMiddle && onMiddle();
                })
                .parallel(
                    cc.tween().to(time, { scaleX: 1 }, { easing: 'sineOut' }),
                    cc.tween().to(time, { skewY: 0 }),
                )
                .call(() => {
                    onComplete && onComplete();
                    res();
                })
                .start();
        });
    }

}
