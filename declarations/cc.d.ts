/**
 * 扩展 cc 模块，声明一些 creator.d.ts 中没有声明（但实际上有）的东西~
 * @author 陈皮皮（ifaswind）
 * @version 20210117
 * @see https://gitee.com/ifaswind/eazax-ccc/blob/master/declarations/cc.d.ts
 */
declare module cc {

    interface Node {

        _touchListener?: TouchOneByOne;

    }

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

    interface RenderComponent {

        _materials: cc.Material,

        _assembler: any;

        _vertsDirty: any;

        _resetAssembler();

        __preload();

        setVertsDirty();

        _on3DNodeChanged();

        _validateRender();

        markForValidate();

        markForRender();

        disableRender();

        _getDefaultMaterial();

        _activateMaterial();

        _updateMaterial();

        _updateColor();

        _checkBacth();

    }

    /**
     * 资源库模块
     * @deprecated cc.AssetLibrary 已在 v2.4 中被移除
     */
    module AssetLibrary {

        function loadAsset(uuid: string, callback: (err, result) => void, options?: { existingAsset?: any });

        function queryAssetInfo(uuid: string, callback: (err, result) => void);

        function getAssetByUuid(uuid: string);

    }

}
