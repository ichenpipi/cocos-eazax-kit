import RemoteLoader from "../../core/remote/RemoteLoader";
import RemoteAsset from "./RemoteAsset";

const { ccclass, property, executeInEditMode, help } = cc._decorator;

/**
 * 远程图像
 * @author 陈皮皮 (ifaswind)
 * @version 20211009
 * @see RemoteTexture.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/remote/RemoteTexture.ts
 * @see RemoteAsset.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/remote/RemoteAsset.ts
 * @see RemoteLoader.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/remote/RemoteLoader.ts
 */
@ccclass
@executeInEditMode
@help('https://gitee.com/ifaswind/eazax-ccc/blob/master/components/remote/RemoteTexture.ts')
export default class RemoteTexture extends RemoteAsset {

    @property()
    protected _sprite: cc.Sprite = null;
    @property(cc.Sprite)
    public get sprite() {
        return this._sprite;
    }
    public set sprite(value) {
        this._sprite = value;
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
        if (!cc.isValid(this._sprite)) {
            this._sprite = this.getComponent(cc.Sprite);
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
        if (!cc.isValid(this._sprite)) {
            cc.warn('[RemoteTexture]', 'load', '->', '缺少 cc.Sprite 组件');
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
        let texture: cc.Texture2D = null,
            loadCount = 0;
        const maxLoadTimes = this.retryTimes + 1;
        while (!texture && loadCount < maxLoadTimes) {
            loadCount++;
            texture = await RemoteLoader.loadTexture(url);
            // 当前加载请求是否已被覆盖
            if (this.lastRequestId !== curRequestId) {
                texture = null;
                return { url, loaded: false, interrupted: true, component: this };
            }
        }
        // 加载失败？
        if (!texture) {
            cc.warn('[RemoteTexture]', 'load', '->', '资源加载失败', url);
            return { url, loaded: false, interrupted: false, component: this };
        }
        // 加载成功
        this.set(texture);
        return { url, loaded: true, interrupted: false, component: this };
    }

    /**
     * 设置
     * @param texture 纹理
     */
    public set(texture: cc.Texture2D) {
        if (texture) {
            this._sprite.spriteFrame = new cc.SpriteFrame(texture);
        } else {
            this._sprite.spriteFrame = null;
        }
        this.node.emit('sprite:sprite-frame-updated', this._sprite, texture);
    }

    /**
     * 更新编辑器预览
     */
    protected async updatePreview() {
        if (!CC_EDITOR || !this._sprite) {
            return;
        }
        const actualSprite = this._sprite,
            actualNode = actualSprite.node;
        // 移除旧的预览节点
        actualNode.children.forEach(node => {
            if (node.name === 'temporary-preview-node')
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
        // const previewNode = new cc.Node('temporary-preview-node');
        // previewNode['_objFlags'] |= cc.Object['Flags'].HideInHierarchy;
        const previewNode = new cc.PrivateNode('temporary-preview-node');
        previewNode['_objFlags'] |= cc.Object['Flags'].DontSave;
        previewNode.setParent(actualNode);
        previewNode.setContentSize(actualNode.getContentSize());
        // 加载资源
        const texture = await RemoteLoader.loadTexture(this._url);
        if (!cc.isValid(previewNode) || !texture) {
            previewNode.removeFromParent(true);
            return;
        }
        // 设置资源
        const previewSprite = previewNode.addComponent(cc.Sprite);
        previewSprite.type = actualSprite.type;
        previewSprite.sizeMode = actualSprite.sizeMode;
        previewSprite.trim = actualSprite.trim;
        previewSprite.spriteFrame = new cc.SpriteFrame(texture);
    }

}

interface LoadResult {
    url: string;
    loaded: boolean;
    interrupted: boolean;
    component: RemoteTexture;
};
