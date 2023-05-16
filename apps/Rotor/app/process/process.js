import app from '../app.js';
import { ImpxW2Grid, ImpxResultView } from '/lib/impx/index.js';
import { command_input_form } from "./form/form.js";
import conf from './conf.js';

let app_grid = new ImpxW2Grid (conf.app_grid);
let last_result = new ImpxResultView;

app.router.add({
    '/process*'(event) {
        app.app_layout.html('left', app.left_sb);
        app.app_layout.show ("right", true);
        app.app_tb.uncheck(...app.app_tb.get());
        app.app_tb.check('applications');
    },
    '/process'(event) {
        app.left_sb.select('apps');
        app.app_layout.html('main', app_grid);
        app.app_layout.html('right', app.right_layout);
        app.app_layout.html('left', app.left_layout);
        app.left_layout.html('top', app.left_sb);
        app.right_layout.html('top', command_input_form);
        app.right_layout.html('main',  last_result);
    }
})

app.left_layout.html('main', `
  <div id="command-list">
  </div>
`);

app.router.process ();
