import { Application } from './Application.js';
import { w2layout, query } from '/lib/w2ui/w2ui-2.0.es6.js';

export class ImpxW2Layout extends w2layout {
    constructor(options) {
        super(options);
    }

    addTargetToPane(pane, grid) {
        const paneElement = this.get(pane);
        let pname = '#layout_'+ this.name + '_panel_'+ paneElement.type;
        const tarPane = query(this.box).find(pname + '> .w2ui-panel-content');
        tarPane[0].innerHTML = ""; //should always be the first element
        tarPane[0].appendChild(grid.target);
    }

    html(pane, content, transition) {
        super.html(pane, content, transition);
        Application.thisApp.dispatchEvent(new Event('htmlGenerated'));
    }
}