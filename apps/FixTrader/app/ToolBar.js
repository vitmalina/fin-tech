import { ImpxToolBar } from '/lib/impx/ImpxToolBar.js';
import { Application } from '/lib/impx/Application.js';

const config = {
    name: 'app_tb',
    items: [
        { id: 'home',     text: 'Home',     type: 'button', icon: 'icon-home', route: '/home' },
        { type: 'break' },
        { id: 'gateways', text: 'Gateways', type: 'button', icon: 'icon-pencil-ruler', route: '/gateways' },
        { type: 'break' },
        { type: 'html',  id: 'gateway_status', style: 'border-radius: 0px',
            html : '<div style="display: inline-block; padding: 5px; width: 150px;">Not Connected</div>'
        },            
        { type: 'break' },
        { type: 'html',  id: 'response_item',
            html: `<div id="response" style="display: inline-block; padding: 5px; width: 400px; border: 1px solid silver">&nbsp;</div>`
        }        
    ]
};

export class ToolBar extends ImpxToolBar {
    constructor() {
        super (config)
    
//        this.onAppValue = (id, value) => {
//            if (id === "gateway_status") {
//                const 
//                document.querySelector ("#gateway_status").textContent = value.Row?.VarValue;
//                return true;
//            }
//        
//        return false;
//        };
    }
   
    onProcessResponseMessage () {
        Application.thisApp.addEventListener ('response', (event) => {
            const responseStatusElement = document.querySelector("#response");

            if (responseStatusElement) {
                responseStatusElement.textContent = responseText;
                setTimeout (() => {
                    responseStatusElement.textContent = '&nbsp;';
                }, 10000);
            }
        });
    }

}