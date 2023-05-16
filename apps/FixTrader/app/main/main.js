import app from '../app.js';
import { orders_grid } from './Orders.js';
import conf from './conf.js'
import { ImpxW2Grid } from '/lib/impx/index.js';
import { ImpxAlertGrid } from '/lib/impx/ImpxAlertGrid.js'

import { query, w2ui, w2toolbar, w2layout } from '/lib/w2ui/w2ui-2.0.es6.js'

const message_grid = new ImpxW2Grid (conf.main_grid);
const fix_grid = new ImpxW2Grid (conf.fix_grid);
const alert_grid = new ImpxAlertGrid;

app.router.add ({
    '/home*'(event) {
        app.app_toolbar.uncheck (...app.app_toolbar.get ())
        app.app_toolbar.check ('home')
    },

    '/home'(event) {
//        main_sidebar.select ('orders');
        app.app_layout.html ('main', orders_grid);
        app.app_layout.html ('preview', message_grid);
    },

    '/home/messages'(event) {
//        main_sidebar.select ('messages');
//        app.app_layout.html ('main', orders_grid);
        app.app_layout.html ('preview', message_grid);
    },

    '/home/fix'(event) {
//        main_sidebar.select ('fix');
//        app.app_layout.html ('main', orders_grid);
        app.app_layout.html ('preview', fix_grid);
    }
});

app.app_layout.html ('bottom', alert_grid);

app.router.process ();
