export default class EditorAsset {

    /**
     * 在编辑器中动态加载资源
     * @param url 相对路径，根目录为 ’asssts/‘，带文件后缀
     * @param type 资源类型
     * @param callback 完成回调
     * @example 
     *  EditorAsset.load('eazax-ccc/resources/effects/eazax-hollowout.effect', 'effect', (err: any, result: cc.EffectAsset) => {
     *      this.effect = result;
     *  });
     */
    static load<T>(url: string, type: string, callback: (err: any, result: T) => void): void {
        if (!CC_EDITOR) return;
        Editor.assetdb.queryAssets('db://assets/' + url, type, (err: any, results: any[]) => {
            if (err) return callback('[EditorAsset] Unknow error!', null);
            if (results.length === 0) return callback('[EditorAsset] No asset found!', null);
            // cc.AssetLibrary.loadAsset(results[0].uuid, (_err: any, _result: any) => {
            //     callback(_err, _result);
            // });
            cc.loader.load({ uuid: results[0].uuid, type: type }, (_err: any, _result: T) => {
                callback(_err, _result);
            });
        });
    }

}