import { ImpxToolBar } from '/lib/impx/ImpxToolBar.js';
import { Application } from '/lib/impx/Application.js';

const config ={
    name:'status_tb',
    items:[
        { type:'spacer', id:'statusSpacer'},

        {
            id: 'app_status', type: 'html', style: 'border-radius: 0px',
            html(item) {
                return `<div style='padding-top:5px; '>${Application.thisApp.connnectionStatus}</div>`;
            },
        },
    ]
}

export class ToolBar extends ImpxToolBar {
    constructor() {
        super (config)
    }
    

}