import { Application } from './Application.js';
import { ImpxW2Grid } from './ImpxW2Grid.js';

const config = {
    name: 'alerts',
    Rotor : {
        type: "AppAlert"
    },
    show: {
        toolbar: false,
        toolbarSearch: false,
        toolbarReload: false,
        toolbarEdit: false,
        toolbarDelete: false,
        lineNumbers: true,
        footer: true
    },
    multiSelect : false,
    selectType : 'row',
    style: 'border: 1',
    contextMenu: [
        { id: 'reset',   text: 'Reset',   icon: 'w2ui-icon-pencil' },
        { id: 'clear',   text: 'Clear',   icon: 'w2ui-icon-cross' },
        { id: 'disable', text: 'Disable', icon: 'w2ui-icon-cross' },
    ],
    
    onContextMenuClick(event) {
        console.log("onContextMenuClick", event);
        const menuItem = event.detail.menuItem;
        const selectedRowIds = event.owner.getSelection();
        const command = Application.thisApp.command_cache.getCommandByTypeName(Application.thisApp.appInfo.AppId, "AlertAction");

        if (command != null && selectedRowIds.length > 0) {
            switch (menuItem.id) {
                case 'clear':
                    Application.thisApp.runCommand(command, { AlertCommand: 'clear', AlertIds: selectedRowIds });
                    break;
                case 'reset':
                    Application.thisApp.runCommand(command, { AlertCommand: 'reset', AlertIds: selectedRowIds });
                    break;
                case 'disable':
                    Application.thisApp.runCommand(command, { AlertCommand: 'disable', AlertIds: selectedRowIds });
                    break;
                default:
                    console.warn('Unknown menu item', menuItem.id);
                    break;
            }
        }
    }
};

export class ImpxAlertGrid extends ImpxW2Grid {
    constructor () {
        super (config);
    }

}

