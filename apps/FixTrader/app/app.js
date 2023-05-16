import { ToolBar } from './ToolBar.js';
import { Application, Preferences } from '/lib/impx/index.js';
import { query, w2layout } from '/lib/w2ui/w2ui-2.0.es6.js';

const config_layout = {
    name: 'app_layout',
    padding: 4,
    style: 'background-color: #888',
    panels: [
        { type: 'top', size: '20px', overflow: 'hidden', hidden: true },
        { type: 'left', size: '300px', minSize: 100, resizable: true },
        { type: 'main', size: '400px', overflow: 'hidden' },
//        { type: 'right', size: '300px', minSize: 100, resizable: true, hidden: false },
        { type: 'preview', size: '400px', overflow: 'hidden', hidden: false, resizable: true,
            toolbar: {
                items: [
                    { type: 'radio', id: 'messages', group: '1', text: 'Messages', icon: 'icon-callouts', checked: true },
                    { type: 'radio', id: 'fix_log',  group: '1', text: 'Fix Log',  icon: 'icon-arrows' },
                    { type: 'spacer' }
                ],
                onClick (event) {
                    if (event.target === "messages") {
                        app.router.go ("/home/messages");
                    }
                    
                    if (event.target === "fix_log") {
                        app.router.go ("/home/fix");
                    }
                }
            }
        },
        { type: 'bottom', size: '120px', resizable: true, hidden: false }
    ]
};

const config_toolbar = {
    name: 'app_tb',
    items: [
        { id: 'home',     text: 'Home',     type: 'button', icon: 'icon-home', route: '/home' },
        { type: 'break' },
        { id: 'gateways', text: 'Gateways', type: 'button', icon: 'icon-pencil-ruler', route: '/gateways' },
        { type: 'break' },
        { type: 'html',  id: 'status',
            html (item) {
                return '<div id="status" style="display: inline-block; padding: 5px; border: 1px solid silver">Not connected</div>';
            }
        },            
        { type: 'html',  id: 'response_status',
            html: `<div id="response_status" style="display: inline-block; padding: 5px"></div>`
        },        
    ],
};
    
class App extends Application {
    constructor() {
        super();
        Application.thisApp = this;

        this.app_layout = new w2layout (config_layout);
        this.app_toolbar = new ToolBar;
              
        Object.seal(this);
    }

}

const app = new App ();

app.router.baseRoutes = {
    '/home*':     app_root_dir + '/app/main/main.js',
    '/gateways*': app_root_dir + '/app/gateways/gateways.js'
}

app.router.on ('error', (event) => {
    w2alert (`Route "${event.detail.hash}" is not defined.`)
    app.router.go ('/home')
});

app.initialize (window.location.hostname, window.location.port, "");
app.router.init ('/home');

app.app_toolbar.render ('#app-toolbar');
app.app_layout.render ('#app-main');

query ('#app-container').show ();

app.app_toolbar.onProcessResponseMessage ();
app.app_toolbar.subscribeToAppConnectionStatus ();

export default app;

