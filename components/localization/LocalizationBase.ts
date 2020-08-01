import { GameEvent } from "../../core/GameEvent";

/**
 * 语言更改事件
 */
export const LANG_CHANGE = 'langchange';

/**
 * 语种
 */
export enum Lang {
    Cn = 'cn',
    Eng = 'eng'
}

/**
 * 默认语言
 */
export enum DefaultLang {
    cn = 1,
    eng,
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalizationBase<T> extends cc.Component {

    @property({ type: cc.Enum(DefaultLang), tooltip: CC_DEV && '无当前语言资源时使用的默认语言' })
    protected defaultLang: DefaultLang = DefaultLang.cn;

    private curLang: string = Lang.Cn;

    protected onLoad() {
        GameEvent.on(LANG_CHANGE, (lang: string) => {
            this.curLang = lang;
            this.onLangChange();
        }, this);
    }

    protected onDestroy() {
        GameEvent.off(LANG_CHANGE, (lang: string) => {
            this.curLang = lang;
            this.onLangChange();
        }, this);
    }

    /**
     * 语言更改回调
     */
    protected onLangChange() {

    }

    /**
     * 获取当前语言资源
     */
    protected get(): T {
        if (this[this.curLang]) {
            if (Array.isArray(this[this.curLang]) && this[this.curLang].length === 0) {
                return this[DefaultLang[this.defaultLang]];
            } else {
                return this[this.curLang];
            }
        } else {
            return this[DefaultLang[this.defaultLang]];
        }
    }
}
