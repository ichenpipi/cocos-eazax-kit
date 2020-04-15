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