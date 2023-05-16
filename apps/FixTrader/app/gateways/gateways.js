import app from '../app.js';
import conf from './conf.js'
import { query, w2grid, w2popup } from '/lib/w2ui/w2ui-2.0.es6.js'

let gateways = new w2grid (conf.gateways)

app.router.add ({
    '/gateways*'(event) {
        app.app_toolbar.uncheck (...app.app_toolbar.get())
        app.app_toolbar.check ('gateways')
    },
    '/gateways'(event) {
        app.app_layout.html ('main', gateways)
    }
});

gateways.connectDialog = function() {
    w2popup.open ({
        width: 400,
        height: 260,
        title: 'Connect to Gateway',
        focus: 0,
        body: `
            <div class="w2ui-centered" style="line-height: 1.8">
                <div>
                Session Id: <input id="session" class="w2ui-input" style="margin-bottom: 5px"><br>
                Host: <input id="host" class="w2ui-input" style="margin-bottom: 5px"><br>
                Port: <input id="port" class="w2ui-input" style="margin-bottom: 5px"><br>
                </div>
            </div>`,
        actions: {
            Ok () {
                const el = query("#session")[0].value;

                const session = query("#session")[0].value;
                const host = query("#host")[0].value;
                const port = query("#port")[0].value;

                app.sendMessage ("Connect", { SessionId: session, HostName: host, Port: port} );
                w2popup.close()
            },

            Cancel() {
                w2popup.close()
            }
        },
    })
        .then (() => {
            let sel = gateways.getSelection ();

            if (sel.length === 1) {
                const record = gateways.get (sel[0]);
                
                query("#session")[0].value = record.SessionId;
                query("#host")[0].value = record.SourceBindIP;
                query("#port")[0].value = record.Port;
            }
        });
}