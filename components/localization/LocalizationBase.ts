import { GameEvent } from "../../core/GameEvent";

/** 语言更改事件 */
export const LANG_CHANGED = 'lang-change';

/** 语言 */
export enum Lang {
    /** 中文 */
    Cn = 'cn',
    /** 英语 */
    Eng = 'eng'
}

/** 默认语言 */
export enum DefaultLang {
    /** 中文 */
    cn = 1,
    /** 英语 */
    eng,
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalizationBase<T> extends cc.Component {

    @property({ type: cc.Enum(DefaultLang), tooltip: CC_DEV && '无当前语言资源时使用的默认语言' })
    protected defaultLang: DefaultLang = DefaultLang.cn;

    private curLang: Lang = Lang.Cn;

    private langChanged: Function = (lang: Lang) => {
        this.curLang = lang;
        this.onLangChanged(lang);
    }

    protected onLoad() {
        GameEvent.on(LANG_CHANGED, this.langChanged, this);
    }

    protected onDestroy() {
        GameEvent.off(LANG_CHANGED, this.langChanged, this);
    }

    /**
     * 语言更改回调（子类重写该函数以具体实现）
     */
    protected onLangChanged(lang: Lang) {

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
