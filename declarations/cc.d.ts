/**
 * 扩展 cc 模块，声明一些 creator.d.ts 中没有声明（但实际上有）的东西~
 * @author 陈皮皮（ifaswind）
 * @version 20201210
 * @see https://gitee.com/ifaswind/eazax-ccc/blob/master/declarations/cc.d.ts
 */
declare namespace cc {

    interface TouchOneByOne {

        _claimedTouches: Array;

        swallowTouches: boolean;

        onTouchBegan: Function;

        onTouchMoved: Function;

        onTouchEnded: Function;

        onTouchCancelled: Function;

        setSwallowTouches(needSwallow: boolean): void;

        isSwallowTouches(): boolean;

        clone(): TouchOneByOne;

        checkAvailable(): boolean;

    }

    interface Node {

        _touchListener?: TouchOneByOne;

    }

    /**
     * 资源库类（cc.AssetLibrary 在 v2.4 中被移除）
     * @deprecated
     */
    class AssetLibrary {

        static loadAsset(uuid: string, callback: (err, result) => void, options?: { existingAsset?: any });

        static queryAssetInfo(uuid: string, callback: (err, result) => void);

        static getAssetByUuid(uuid: string);

    }

}
