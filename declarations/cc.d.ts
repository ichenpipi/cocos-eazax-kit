/**
 * cc 命名空间扩展
 * @author 陈皮皮（ifaswind）
 * @version 20200509
 * @see https://gitee.com/ifaswind/eazax-ccc/blob/master/declarations/cc.d.ts
 */
declare namespace cc {

    /**
     * 资源库类
     */
    export class AssetLibrary {

        static loadAsset(uuid: string, callback: (err, result) => void, options?: { existingAsset?: any });

        static queryAssetInfo(uuid: string, callback: (err, result) => void);

        static getAssetByUuid(uuid: string);

    }

}