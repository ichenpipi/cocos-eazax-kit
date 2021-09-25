const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class RemoteAsset extends cc.Component {

    /**
     * 加载
     * @param url 资源地址
     */
    public async load(url?: string): Promise<LoadResult> {
        return { url, loaded: false, interrupted: false, component: this };
    }

    /**
     * 设置资源
     * @param asset 资源
     */
    public set(asset?: any) {

    }

}

type LoadResult = {
    url: string;
    loaded: boolean;
    interrupted: boolean;
    component: any;
};
