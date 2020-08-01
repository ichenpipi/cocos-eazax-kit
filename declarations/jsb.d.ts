/**
 * ##### ---
 * jsb 命名空间
 * 包含以下定义：
 * 1. AssetsManager
 * 2. Manifest
 * 3. EventAssetsManager
 * @author 陈皮皮（ifaswind）
 * @version 20200731
 * @see https://gitee.com/ifaswind/eazax-ccc/blob/master/declarations/jsb.d.ts
 */
declare namespace jsb {

    /**
     * This class is used to auto update resources, such as pictures or scripts.
     */
    export class AssetsManager {

        constructor(manifestUrl: string, storagePath: string);

        constructor(manifestUrl: string, storagePath: string, handle: VersionCompareHandle);

        static readonly VERSION_ID: string;

        static readonly MANIFEST_ID: string;

        /**
         * Create function for creating a new AssetsManagerEx
         * @param manifestUrl The url for the local manifest file
         * @param storagePath The storage path for downloaded assets
         * @warning The cached manifest in your storage path have higher priority and will be searched first, only if it doesn't exist, AssetsManagerEx will use the given manifestUrl.
         */
        static create(manifestUrl: string, storagePath: string): AssetsManager;

        /**
         * Check out if there is a new version of manifest.
         * You may use this method before updating, then let user determine whether he wants to update resources.
         */
        checkUpdate(): void;

        /**
         * Prepare the update process, this will cleanup download process flags, fill up download units with temporary manifest or remote manifest
         */
        prepareUpdate(): void;

        /**
         * Update with the current local manifest.
         */
        update(): void;

        /**
         * Reupdate all failed assets under the current AssetsManagerEx context
         */
        downloadFailedAssets(): void;

        /**
         * Gets the current update state.
         */
        getState(): jsb.AssetsManager.State;

        /**
         * Gets storage path.
         */
        getStoragePath(): string;

        /**
         * Function for retrieving the local manifest object
         */
        getLocalManifest(): Manifest;

        /**
         * Load a custom local manifest object, the local manifest must be loaded already.
         * You can only manually load local manifest when the update state is UNCHECKED, it will fail once the update process is began.
         * This API will do the following things:
         * 1. Reset storage path
         * 2. Set local storage
         * 3. Search for cached manifest and compare with the local manifest
         * 4. Init temporary manifest and remote manifest
         * If successfully load the given local manifest and inited other manifests, it will return true, otherwise it will return false
         * @param localManifest The local manifest object to be set
         * @param storagePath The local storage path
         */
        loadLocalManifest(localManifest: Manifest, storagePath: string): boolean;

        /**
         * Load a local manifest from url.
         * You can only manually load local manifest when the update state is UNCHECKED, it will fail once the update process is began.
         * This API will do the following things:
         * 1. Reset storage path
         * 2. Set local storage
         * 3. Search for cached manifest and compare with the local manifest
         * 4. Init temporary manifest and remote manifest
         * If successfully load the given local manifest and inited other manifests, it will return true, otherwise it will return false
         * @param manifestUrl The local manifest url
         */
        loadLocalManifest(manifestUrl: string): boolean;

        /**
         * Function for retrieving the remote manifest object
         */
        getRemoteManifest(): Manifest;

        /**
         * Load a custom remote manifest object, the manifest must be loaded already.
         * You can only manually load remote manifest when the update state is UNCHECKED and local manifest is already inited, it will fail once the update process is began.
         * @param remoteManifest The remote manifest object to be set
         */
        loadRemoteManifest(remoteManifest: Manifest): boolean;

        /**
         * Gets whether the current download is resuming previous unfinished job, this will only be available after READY_TO_UPDATE state, under unknown states it will return false by default.
         */
        isResuming(): boolean;

        /**
         * Gets the total byte size to be downloaded of the update, this will only be available after READY_TO_UPDATE state, under unknown states it will return 0 by default.
         */
        getTotalBytes(): number;

        /**
         * Gets the current downloaded byte size of the update, this will only be available after READY_TO_UPDATE state, under unknown states it will return 0 by default.
         */
        getDownloadedBytes(): number;

        /**
         * Gets the total files count to be downloaded of the update, this will only be available after READY_TO_UPDATE state, under unknown states it will return 0 by default.
         */
        getTotalFiles(): number;

        /**
         * Gets the current downloaded files count of the update, this will only be available after READY_TO_UPDATE state, under unknown states it will return 0 by default.
         */
        getDownloadedFiles(): number;

        /**
         * Function for retrieving the max concurrent task count
         */
        getMaxConcurrentTask(): number;

        /**
         * Function for setting the max concurrent task count
         * @param max 
         */
        setMaxConcurrentTask(max: number): void;

        /**
         * Set the handle function for comparing manifests versions
         * @param handle The compare function
         */
        setVersionCompareHandle(handle: VersionCompareHandle): void;

        /**
         * Set the verification function for checking whether downloaded asset is correct, e.g. using md5 verification
         * @param callback The verify callback function
         */
        setVerifyCallback(callback: VerifyCallback): void;

        /**
         * Set the event callback for receiving update process events
         * @param callback The event callback function
         */
        setEventCallback(callback: EventCallback): void;

    }

    export class Manifest {

        constructor(manifestUrl?: string);

        constructor(content: string, manifestRoot: string);

        /**
         * Check whether the version informations have been fully loaded
         */
        isVersionLoaded(): boolean;

        /**
         * Check whether the manifest have been fully loaded
         */
        isLoaded(): boolean;

        /**
         * Gets remote package url.
         */
        getPackageUrl(): string;

        /**
         * Gets remote manifest file url.
         */
        getManifestFileUrl(): string;

        /**
         * Gets remote version file url.
         */
        getVersionFileUrl(): string;

        /**
         * Gets manifest version.
         */
        getVersion(): string;

        /**
         * Get the search paths list related to the Manifest.
         */
        getSearchPaths(): string[];

        /**
         * Get the manifest root path, normally it should also be the local storage path.
         */
        getManifestRoot(): string;

        /**
         * Parse the manifest file information into this manifest
         * @param manifestUrl manifestUrl Url of the local manifest
         */
        parseFile(manifestUrl: string): void;

        /**
         * Parse the manifest from json string into this manifest
         * @param content content Json string content
         * @param manifestRoot manifestRoot The root path of the manifest file (It should be local path, so that we can find assets path relative to the root path)
         */
        parseJSONString(content: string, manifestRoot: string): void;

        /**
         * Get whether the manifest is being updating
         */
        isUpdating(): boolean;

        /**
         * Set whether the manifest is being updating
         * @param updating updating Updating or not
         */
        setUpdating(updating: boolean): void;

    }

    export class EventAssetsManager {

        constructor(eventName: string, manager: jsb.AssetsManager, code: jsb.EventAssetsManager.EventCode, assetId?: string, message?: string, curle_code?: number, curlm_code?: number);

        static readonly ERROR_NO_LOCAL_MANIFEST: number; // 0

        static readonly ERROR_DOWNLOAD_MANIFEST: number; // 1

        static readonly ERROR_PARSE_MANIFEST: number; // 2

        static readonly NEW_VERSION_FOUND: number; // 3

        static readonly ALREADY_UP_TO_DATE: number; // 4

        static readonly UPDATE_PROGRESSION: number; // 5

        static readonly ASSET_UPDATED: number; // 6

        static readonly ERROR_UPDATING: number; // 7

        static readonly UPDATE_FINISHED: number; // 8

        static readonly UPDATE_FAILED: number; // 9

        static readonly ERROR_DECOMPRESS: number; // 10

        getEventCode(): jsb.EventAssetsManager.EventCode;

        getCURLECode(): number;

        getCURLMCode(): number;

        getMessage(): string;

        getAssetId(): string;

        getAssetsManagerEx(): jsb.AssetsManager;

        isResuming(): boolean;

        getPercent(): number;

        getPercentByFile(): number;

        getDownloadedBytes(): number;

        getTotalBytes(): number;

        getDownloadedFiles(): number;

        getTotalFiles(): number;
    }

}

/**
 * The compare function
 */
type VersionCompareHandle = (versionA: string, versionB: string) => void;

/**
 * The verify callback function
 */
type VerifyCallback = (path: string, asset: jsb.Manifest.Asset) => boolean;

/**
 * The event callback function
 */
type EventCallback = (event: jsb.EventAssetsManager) => void;

declare namespace jsb.AssetsManager {

    /**
     * Update states
     */
    const enum State {
        UNINITED = 0,
        UNCHECKED,
        PREDOWNLOAD_VERSION,
        DOWNLOADING_VERSION,
        VERSION_LOADED,
        PREDOWNLOAD_MANIFEST,
        DOWNLOADING_MANIFEST,
        MANIFEST_LOADED,
        NEED_UPDATE,
        READY_TO_UPDATE,
        UPDATING,
        UNZIPPING,
        UP_TO_DATE,
        FAIL_TO_UPDATE
    }

}

interface DownloadUnit {
    srcUrl: string;
    storagePath: string;
    customId: string;
    size: number;
}

interface ManifestAsset {
    md5: string;
    path: string;
    compressed: boolean;
    size: number;
    downloadState: number;
}

type DownloadUnits = Map<string, DownloadUnit>;

declare namespace jsb.Manifest {

    /**
     * The type of difference
     */
    enum DiffType {
        ADDED = 0,
        DELETED,
        MODIFIED
    }

    enum DownloadState {
        UNSTARTED = 0,
        DOWNLOADING,
        SUCCESSED,
        UNMARKED
    }

    /**
     * Asset object
     */
    type Asset = ManifestAsset;

    /**
     * Object indicate the difference between two Assets
     */
    interface AssetDiff {
        asset: Asset;
        type: AssetDiff;
    }

}

declare namespace jsb.EventAssetsManager {

    /**
     * Update events code
     */
    enum EventCode {

        ERROR_NO_LOCAL_MANIFEST = 0,

        ERROR_DOWNLOAD_MANIFEST = 1,

        ERROR_PARSE_MANIFEST = 2,

        NEW_VERSION_FOUND = 3,

        ALREADY_UP_TO_DATE = 4,

        UPDATE_PROGRESSION = 5,

        ASSET_UPDATED = 6,

        ERROR_UPDATING = 7,

        UPDATE_FINISHED = 8,

        UPDATE_FAILED = 9,

        ERROR_DECOMPRESS = 10

    }

}