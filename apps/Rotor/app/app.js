import { Application, Preferences, AppAlertBar } from '/lib/impx/index.js';
import { ImpxAlertGrid } from '/lib/impx/ImpxAlertGrid.js';
import { ImpxW2Layout } from '/lib/impx/ImpxW2Layout.js';
import { ImpxAlertBar } from '/lib/impx/ImpxAlertBar.js';
import { ToolBar } from './ToolBar.js';
import { w2alert, w2layout, w2sidebar, query, w2toolbar } from '/lib/w2ui/index.js';
import conf from "./conf.js";

class App extends Application {
    constructor() {
        super();
        Application.thisApp = this;
        this.prefs = new Preferences (this.name, { "ui-sidebar-size":"large" });

        this.app_layout = new ImpxW2Layout(conf.app_layout);
        this.right_layout = new w2layout(conf.right_layout);
        this.left_layout = new w2layout(conf.left_layout);
        this.top_layout = new w2layout(conf.top_layout);
        this.app_tb = new ToolBar; //new w2toolbar(conf.app_tb);
        this.left_sb = new w2sidebar(Object.assign(conf.left_sb, conf.left_sb_proto));
        Object.seal(this);
    }
}
const app = new App ();

const alert_grid = new ImpxAlertGrid;
const alert_bar = new ImpxAlertBar;
//export const tool_bar = new ToolBar;

app.router.baseRoutes = {
    '/process*':    app_root_dir + '/app/process/process.js',
    '/operations*': app_root_dir + '/app/operations/operations.js',
}

app.router.on('error', (event) => {
    w2alert(`Route "${event.detail.hash}" is not defined.`);
    app.router.go('/process');
});

app.router.init('/process');

app.app_layout.render('#app-main');
query('#app-container').show();

app.app_tb.subscribeToAppConnectionStatus ();

app.initialize (window.location.hostname, parseInt(window.location.port), app.prefs.get("Token"));

app.top_layout.html ('top', alert_bar);
app.top_layout.html ('main', app.app_tb);

app.app_layout.html ('top', app.top_layout);
app.app_layout.html ("bottom", alert_grid);


export default app;