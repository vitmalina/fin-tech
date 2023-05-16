import { ImpxAlertGrid } from '/lib/impx/ImpxAlertGrid.js';
import { CommandList } from '/lib/impx/CommandList.js';
import { ToolBar } from './ToolBar.js';

import { Application, Preferences, ImpxResultView, ImpxInputForm } from '/lib/impx/index.js';
import { query, w2layout, w2toolbar } from '/lib/w2ui/w2ui-2.0.es6.js'

const config_app_layout = {
    name: 'app_layout',
    padding: 4,
    style: 'background-color: #888',
    panels: [
        { type: 'top', size: '20px', overflow: 'hidden', hidden: true },
        { type: 'left', size: '180px', minSize: 100, resizable: true, title: "Commands" },
        { type: 'main', size: '200px', overflow: 'hidden', title: "Command" },
        { type: 'right', size: '0px', resizable: false, hidden: true },
        { type: 'preview', size: '200px', overflow: 'hidden', hidden: false, resizable: true },
        { type: 'bottom', size: '120px', resizable: true, hidden: false }
    ]
};

const config_app_toolbar = {
    name: 'app_tb',
    items: [
        { id: 'home',     text: 'Home',     type: 'button', icon: 'icon-home', route: '/home' },
        { type: 'break' },
        { type: 'html',  id: 'response_status',
            html: `<div id="response_status" style="display: inline-block; padding: 5px"></div>`
        },        
    ],
};

const config_command_form = {
    name: 'command_input_form',
    fields: [],
    record: {},
    actions: {
        run: function () {
            console.log('Run button clicked', this.command, this.record);
            if (this.command) {
                app.runCommand(this.command, this.mapMessage(this.record));
            } else {
                console.warn("Please Select Command before hitting run");
            }
        },
    },
};

class App extends Application {
    constructor() {
        super();
        Application.thisApp = this;

        Object.seal(this);
    }

    updateToolbarWithResponse (responseText) {
        const responseStatusElement = document.querySelector("#response_status");

        if (responseStatusElement) {
            responseStatusElement.textContent = responseText;
        
            setTimeout(() => {
                responseStatusElement.textContent = "";
            }, 10000);
        }
    }     
}

const app = new App ();

const app_layout = new w2layout (config_app_layout);
const app_toolbar = new ToolBar;

const alerts = new ImpxAlertGrid;
const results = new ImpxResultView;
const command_input_form = new ImpxInputForm (config_command_form);

app.initialize (window.location.hostname, parseInt (window.location.port), "");

app_toolbar.render ('#toolbar');
app_layout.render ('#app-main');

app_layout.html ('left', `
  <div id="command-list">
  </div>
`);

app_layout.html ("main", command_input_form);
app_layout.html ("preview", results);
app_layout.html ("bottom", alerts);

app_toolbar.subscribeToAppConnectionStatus ();

const commandList = new CommandList ("command-list");

commandList.onCommandClick = (commandObj) => {
    command_input_form.handleCommandParameters (commandObj);    
    
    if (typeof(commandObj.DefaultCommand) !== "undefined" && commandObj.DefaultCommand) {
        app.runCommand (commandObj, {}, { isdefault: true });
    }
};

query ('#app-container').show ();

app.addEventListener('response', (event) => {
    app.updateToolbarWithResponse(event.detail);
});

app.onLoadComplete ( () => {
    commandList.populateCommands (app.appInfo.AppId);
});
