import { Application, Preferences } from "/lib/impx/index.js";
import { w2toolbar, query } from "/lib/w2ui/index.js";
import { ImpxKanbanBoard } from "/lib/impx/ImpxKanBan.js";
import { ImpxGroupedApps } from "/lib/impx/ImpxGroupedApps.js";
import { ImpxW2Layout } from "/lib/impx/ImpxW2Layout.js";
import conf from "./conf.js";

class App extends Application {
    constructor() {
        super();
        Application.thisApp = this;
        this.prefs = new Preferences (this.name);

        this.app_layout = new ImpxW2Layout(conf.app_layout);
        this.app_tb = new w2toolbar(conf.app_tb);

        Object.seal(this);
    }
}

const app = new App();
let board = new ImpxKanbanBoard();
let runningApps = new ImpxGroupedApps()

app.app_layout.html("top", app.app_tb);
app.app_layout.render("#app-main");
query("#app-container").show();

const url = window.location.origin + "/landing";
app.sendHttpMessage(url, "LandingSnapshot", {}, {isdefault: false}, {method: "GET"})
    .then((response) => {
        console.log(response);
        board.loadAppsAndAlerts(response.LandingSnapshot.AppInfos, response.LandingSnapshot.Alerts)
        runningApps.setApps(response.LandingSnapshot.AppInfos);

        app.app_layout.html("main", board.toHTML());
        app.app_layout.html("left", runningApps.toHTML());

    })
    .catch((error) => console.error('Error sending message:', error));
export default app;