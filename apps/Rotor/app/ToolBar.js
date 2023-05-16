import { ImpxToolBar } from '/lib/impx/ImpxToolBar.js';
import { Application } from '/lib/impx/Application.js';

const config = {
    name:'app_toolbar',
    items:[
        { id: 'applications', type: 'button', text: 'Applications', icon: 'icon-home', route: '/process' },
        { type: 'break' },
        { id: 'operations', text: 'Ops', type: 'button', icon: 'icon-pencil-ruler', route: '/operations' },
        { type: 'break' },
        { id: 'spacer1', type: 'spacer' },
        { type:'spacer', id:'statusSpacer' },
        { type: 'break' },
        { id: 'users', type: 'html', style:'border-radius: 0px',
            html(item) {
                return  `<div style='padding-top:5px; '>Users</div>`;
            }
        },
        { id: 'site', type: 'html', style:'border-radius: 0px',
            html(item){
                return `<div style='padding-top:5px; '>Site</div>`;    
            }
        },
        { id: 'version', type: 'html', style:'border-radius: 0px',
            html(item){
                return `<div style='padding-top:5px; '>Version</div>`;
            }
        },
                                                       
        { id: 'app_status', type: 'html',style: 'border-radius: 0px',
           html(item) {
                return `<div style='padding-top:5px; '>${Application.thisApp.connnectionStatus}</div>`;
            }
        },
        { type: 'break'},
        {
            id: 'user', text: 'User', type: 'menu',
            items: [
                {id: 'watching', text: 'Watching', icon: 'icon-eye'},
                {id: 'away',     text: 'Away',     icon: 'icon-exit'},
                {id: 'home',     text: 'Home',     icon: 'icon-home'},
                {id: 'logout',   text: 'Logout',   icon: 'icon-off'},
            ]
        },
    ],

    onClick (event) {
    event.done (() => {
        console.log(event);
        if (event.detail.subItem) {
            if (event.detail.item.selected === 'watching') {
                Application.thisApp.sendMessage ("UserOperation", { Action: "watch"} );
            }
            else if (event.detail.item.selected === 'away') {
                Application.thisApp.sendMessage ("UserOperation", { Action: "away"} );
            }
            else if (event.detail.item.selected === "logout") {
                Application.thisApp.sendMessage ("UserOperation", { Action: "logout"} );
                Application.thisApp.prefs.remove("Token");
                window.location.href = window.location.origin;
            }
            else if (event.detail.item.selected === "home") {
                window.location.href = window.location.origin;
            }
        }// else if (event.detail.item.id === 'home') {
//                    app.prefs.remove("Token");
//                    window.location.href = window.location.origin;
//                }
    });
}
};

export class ToolBar extends ImpxToolBar {
    constructor() {
        super (config)
    }
}