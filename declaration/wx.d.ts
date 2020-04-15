/**
 * 微信的命名空间
 */
declare namespace wx {

    /**
     * 打开另一个小程序。
     */
    export function navigateToMiniProgram(object: object): void;

    /**
     * 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。
     */
    export function authorize(object: object): void;

    /**
     * 获取用户信息。
     */
    export function getUserInfo(object: object): void;

    /**
     * 向开放数据域发送消息。
     */
    export function postMessage(object: object): void;

    /**
     * 监听主域发送的消息。
     */
    export function onMessage(callback: Function): void;

    /**
     * 对用户托管数据进行写数据操作。允许同时写多组 KV 数据。
     */
    export function setUserCloudStorage(object: object): void;

    /**
     * 获取当前用户托管数据当中对应 key 的数据。该接口只可在开放数据域下使用。
     */
    export function getUserCloudStorage(object: object): void;

    /**
     * 删除用户托管数据当中对应 key 的数据。
     */
    export function removeUserCloudStorage(object: object): void;

    /**
     * 监听成功修改好友的互动型托管数据事件，该接口在游戏主域使用。
     */
    export function onInteractiveStorageModified(callback: Function): void;

    /**
     * 修改好友的互动型托管数据，该接口只可在开放数据域下使用。
     */
    export function modifyFriendInteractiveStorage(object: object): void;

    /**
     * 获取当前用户互动型托管数据对应 key 的数据。
     */
    export function getUserInteractiveStorage(object: object): void;

    /**
     * 获取可能对游戏感兴趣的未注册的好友名单。每次调用最多可获得 5 个好友，此接口只能在开放数据域中使用。
     */
    export function getPotentialFriendList(object: object): void;

    /**
     * 获取群信息。小游戏通过群分享卡片打开的情况下才可以调用。该接口只可在开放数据域下使用。
     */
    export function getGroupInfo(object: object): void;

    /**
     * 获取群同玩成员的游戏数据。小游戏通过群分享卡片打开的情况下才可以调用。该接口只可在开放数据域下使用。
     */
    export function getGroupCloudStorage(object: object): void;

    /**
     * 拉取当前用户所有同玩好友的托管数据。该接口只可在开放数据域下使用。
     */
    export function getFriendCloudStorage(object: object): void;

    /**
     * 给指定的好友分享游戏信息，该接口只可在开放数据域下使用。接收者打开之后，可以用 wx.modifyFriendInteractiveStorage 传入参数 quiet=true 发起一次无需弹框确认的好友互动。
     */
    export function shareMessageToFriend(object: object): void;

    /**
     * 获取主域和开放数据域共享的 sharedCanvas。只有开放数据域能调用。
     */
    export function getSharedCanvas(): any;

    /**
     * 获取开放数据域。
     */
    export function getOpenDataContext(): any;

    /**
     * 创建一个图片对象。
     */
    export function createImage(): any;

}

/**
 * 托管数据
 */
declare type UserGameData = {
    avatarUrl: string;
    nickname: string;
    openid: string;
    KVDataList: KVData[];
}

/**
 * 托管的 KV 数据
 */
declare type KVData = {
    key: string;
    value: string;
}

/**
 * 用户信息
 */
declare type FriendInfo = {
    avatarUrl: string;
    nickname: string;
    openid: string;
}
