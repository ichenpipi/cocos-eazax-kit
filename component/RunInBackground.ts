const { ccclass } = cc._decorator;

@ccclass
export default class RunInBackground extends cc.Component {

    private worker: Worker = null;

    private url: string = "Worker.js";

    protected onLoad() {
        if (CC_DEBUG) this.url = "app/editor/static/preview-templates/Worker.js";

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                if (cc.game["_paused"]) cc.game["resume"]();
                this.worker = new Worker(this.url);
                this.worker.onmessage = () => { cc.director["mainLoop"](); }
            } else if (document.visibilityState === "visible") {
                if (this.worker) this.worker.terminate();
            }
        });
    }

}

/*

以下为 Worker.js 脚本内容：

function call(){
	postMessage(1);
	setTimeout("call()", 1000 / 60);
}
call();

*/