/**
 * 编辑器内资源加载类
 * @see EditorAsset.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/misc/EditorAsset.ts
 */
export default class EditorAsset {

    /**
     * 在编辑器环境中加载 assets 目录下的资源
     * @param path 相对路径，根目录为 assets/，注意带上文件后缀，如：eazax-sine-wave.effect
     * @param assetType 资源类型，如：effect
     * @param callback 加载完成回调
     * @example 
     *  const path = 'eazax-ccc/resources/effects/eazax-sine-wave.effect';
     *  EditorAsset.load(path, 'effect', (err: Error, result: cc.EffectAsset) => {
     *      this.effect = result;
     *  });
     */
    public static load<T>(path: string, assetType: string, callback: (err: Error, result: T) => void): void {
        if (!CC_EDITOR) return cc.warn('[EditorAsset]', '该函数只在编辑器环境内有效！');
        Editor.assetdb.queryAssets(`db://assets/${path}`, assetType, (err: Error, results: AssetInfo[]) => {
            if (err) return callback(new Error('[EditorAsset] 未知错误!'), null);
            if (results.length === 0) return callback(new Error('[EditorAsset] 未找到指定资源!'), null);
            if (cc.assetManager && cc.assetManager.loadAny) {
                cc.assetManager.loadAny({ uuid: results[0].uuid, type: assetType }, (_err: Error, _result: T) => {
                    callback(_err, _result);
                });
            } else {
                cc.loader.load({ uuid: results[0].uuid, type: assetType }, (_err: Error, _result: T) => {
                    callback(_err, _result);
                });
            }
        });
    }

}

/** 资源信息 */
interface AssetInfo {
    destPath: string;
    hidden: boolean;
    isSubAsset: boolean;
    path: string;
    readonly: boolean;
    type: string;
    url: string;
    uuid: string;
}
