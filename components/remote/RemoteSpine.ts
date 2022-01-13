import SpineLoader from "../../core/remote/SpineLoader";
import RemoteAsset from "./RemoteAsset";

const { ccclass, property, executeInEditMode, help, menu } = cc._decorator;

/**
 * 远程 Spine
 * @author 陈皮皮 (ifaswind)
 * @version 20211009
 * @see RemoteSpine.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/remote/RemoteSpine.ts
 * @see RemoteAsset.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/remote/RemoteAsset.ts
 * @see SpineLoader.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/remote/SpineLoader.ts
 */
@ccclass
@executeInEditMode
@help('https://gitee.com/ifaswind/eazax-ccc/blob/master/components/remote/RemoteSpine.ts')
@menu('eazax/远程组件/RemoteSpine')
export default class RemoteSpine extends RemoteAsset {

    @property()
    protected _skeleton: sp.Skeleton = null;
    @property(sp.Skeleton)
    public get skeleton() {
        return this._skeleton;
    }
    public set skeleton(value) {
        this._skeleton = value;
        this.onPropertyUpdated();
    }

    @property()
    protected _url: string = '';
    @property({ tooltip: CC_DEV && '远程资源地址' })
    public get url() {
        return this._url;
    }
    public set url(value) {
        this._url = value;
        this.onPropertyUpdated();
    }

    @property()
    protected _defaultSkin: string = 'default';
    @property({ tooltip: CC_DEV && '默认皮肤' })
    public get defaultSkin() {
        return this._defaultSkin;
    }
    public set defaultSkin(value) {
        this._defaultSkin = value;
        this.onPropertyUpdated();
    }

    @property()
    protected _defaultAnimation: string = '';
    @property({ tooltip: CC_DEV && '默认动画' })
    public get defaultAnimation() {
        return this._defaultAnimation;
    }
    public set defaultAnimation(value) {
        this._defaultAnimation = value;
        this.onPropertyUpdated();
    }

    @property({ tooltip: CC_DEV && '加载失败后的重试次数' })
    protected retryTimes: number = 2;

    @property()
    protected _previewInEditor: boolean = true;
    @property({ tooltip: CC_DEV && '在编辑器内预览' })
    public get previewInEditor() {
        return this._previewInEditor;
    }
    public set previewInEditor(value) {
        this._previewInEditor = value;
        this.onPropertyUpdated();
    }

    @property()
    protected _showPreviewNode: boolean = false;
    @property({ tooltip: CC_DEV && '展示预览节点（该节点不会被保存，无需手动删除）', visible() { return this['_previewInEditor']; } })
    public get showPreviewNode() {
        return this._showPreviewNode;
    }
    public set showPreviewNode(value) {
        this._showPreviewNode = value;
        this.onPropertyUpdated();
    }

    /**
     * 最后一个请求 ID（用来处理短时间内的重复加载，仅保留最后一个请求）
     */
    protected lastRequestId: number = 0;

    protected onLoad() {
        this.init();
    }

    protected resetInEditor() {
        this.init();
    }

    /**
     * 初始化
     */
    protected init() {
        if (!cc.isValid(this._skeleton)) {
            this._skeleton = this.getComponent(sp.Skeleton);
        }
        this.onPropertyUpdated();
    }

    /**
     * 属性更新回调
     */
    public onPropertyUpdated() {
        if (CC_EDITOR) {
            this.updatePreview();
        } else {
            this.load(this._url);
        }
    }

    /**
     * 加载
     * @param url 资源地址
     */
    public async load(url: string = this._url): Promise<LoadResult> {
        if (!cc.isValid(this._skeleton)) {
            cc.warn('[RemoteSpine]', 'load', '->', '缺少 sp.Skeleton 组件');
            return { url, loaded: false, interrupted: false, component: this };
        }
        // 保存地址
        this._url = url;
        if (!url || url === '') {
            this.set(null);
            return { url, loaded: false, interrupted: false, component: this };
        }
        // 增加请求 ID 并记录当前的 ID
        const curRequestId = ++this.lastRequestId;
        // 开始加载
        let skeletonData: sp.SkeletonData = null,
            loadCount = 0;
        const maxLoadTimes = this.retryTimes + 1;
        while (!skeletonData && loadCount < maxLoadTimes) {
            loadCount++;
            skeletonData = await SpineLoader.loadRemote(url);
            // 当前加载请求是否已被覆盖
            if (this.lastRequestId !== curRequestId) {
                skeletonData = null;
                return { url, loaded: false, interrupted: true, component: this };
            }
        }
        // 加载失败？
        if (!skeletonData) {
            cc.warn('[RemoteSpine]', 'load', '->', '资源加载失败', url);
            return { url, loaded: false, interrupted: false, component: this };
        }
        // 加载成功
        this.set(skeletonData);
        return { url, loaded: true, interrupted: false, component: this };
    }

    /**
     * 设置
     * @param skeletonData 骨骼数据
     */
    public set(skeletonData: sp.SkeletonData) {
        const skeleton = this._skeleton;
        if (!skeleton) {
            return;
        }
        skeleton.skeletonData = skeletonData;
        if (skeletonData) {
            if (this._defaultSkin !== '') {
                skeleton.setSkin(this._defaultSkin);
            }
            skeleton.animation = this._defaultAnimation;
        } else {
            skeleton.animation = '';
        }
        this.node.emit('skeleton:skeleton-data-updated', this._skeleton, skeletonData);
    }

    /**
     * 更新编辑器预览
     */
    protected async updatePreview() {
        if (!CC_EDITOR || !this._skeleton) {
            return;
        }
        const actualSkeleton = this._skeleton,
            actualNode = actualSkeleton.node;
        // 移除旧的预览节点
        actualNode.children.forEach(node => {
            if (node.name === 'PREVIEW_NODE')
                node.removeFromParent(true);
        });
        // 是否开启预览
        if (!this._previewInEditor) {
            return;
        }
        // 链接是否有效
        if (!this._url || this._url === '') {
            return;
        }
        // 生成临时预览节点
        let previewNode: cc.Node = null;
        if (this._showPreviewNode) {
            previewNode = new cc.Node('PREVIEW_NODE');
        } else {
            previewNode = new cc.PrivateNode('PREVIEW_NODE');
        }
        // previewNode['_objFlags'] |= cc.Object['Flags'].HideInHierarchy;
        previewNode['_objFlags'] |= cc.Object['Flags'].DontSave;
        previewNode['_objFlags'] |= cc.Object['Flags'].LockedInEditor;
        previewNode.setParent(actualNode);
        previewNode.setContentSize(actualNode.getContentSize());
        // 加载资源
        const skeletonData = await SpineLoader.loadRemote(this._url);
        if (!cc.isValid(previewNode) || !skeletonData) {
            previewNode.removeFromParent(true);
            return;
        }
        // 设置资源
        const previewSkeleton = previewNode.addComponent(sp.Skeleton);
        previewSkeleton.loop = actualSkeleton.loop;
        previewSkeleton.premultipliedAlpha = actualSkeleton.premultipliedAlpha;
        previewSkeleton.timeScale = actualSkeleton.timeScale;
        previewSkeleton.skeletonData = skeletonData;
        if (this._defaultSkin !== '') {
            previewSkeleton.setSkin(this._defaultSkin);
        }
        previewSkeleton.animation = this._defaultAnimation;
        // tips
        if (this._showPreviewNode) {
            cc.log('[RemoteSpine]', 'Preview', '->', '预览节点（PREVIEW_NODE）不会被保存，无需手动删除');
        }
        cc.log('[RemoteSpine]', 'Preview', '->', 'skins', Object.keys(skeletonData.skeletonJson.skins));
        cc.log('[RemoteSpine]', 'Preview', '->', 'animations', Object.keys(skeletonData.skeletonJson.animations));
    }

}

interface LoadResult {
    url: string;
    loaded: boolean;
    interrupted: boolean;
    component: RemoteSpine;
};
