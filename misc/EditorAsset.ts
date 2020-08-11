export default class EditorAsset {

    /**
     * 在编辑器环境中加载 assets 目录下的资源
     * @param url 相对路径，根目录为 ’asssts/‘，注意带上文件后缀
     * @param type 资源类型
     * @param callback 完成回调
     * @example 
     *  EditorAsset.load('eazax-ccc/resources/effects/eazax-hollowout.effect', 'effect', (err: any, result: cc.EffectAsset) => {
     *      this.effect = result;
     *  });
     */
    static load<T>(url: string, type: string, callback: (err: Error, result: T) => void): void {
        if (!CC_EDITOR) return;
        Editor.assetdb.queryAssets(`db://assets/${url}`, type, (err: Error, results: AssetInfo[]) => {
            if (err) return callback(new Error('[EditorAsset] Unknow error!'), null);
            if (results.length === 0) return callback(new Error('[EditorAsset] No asset found!'), null);

            if (cc.assetManager) {
                cc.assetManager.loadAny({ uuid: results[0].uuid, type: type }, (_err: Error, _result: T) => {
                    callback(_err, _result);
                });
            } else {
                cc.loader.load({ uuid: results[0].uuid, type: type }, (_err: Error, _result: T) => {
                    callback(_err, _result);
                });
            }
        });
    }

}

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