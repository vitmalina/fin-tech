import  app from '../app.js';

export default {
    main_grid: {
        Rotor : {
            type: "ExecReport"
        },
        name: 'main_grid',
        style: 'border: 1',
        show: {
            toolbar: false,
            lineNumbers: true,
            footer: true
        },
        
        contextMenu: [
            { id: 'cancel',  text: 'Cancel',  icon: 'w2ui-icon-info' },
            { id: 'replace', text: 'Replace', icon: 'w2ui-icon-pencil' }
        ],

        onContextMenuClick(event) {
            const record = event.owner.get (event.detail.recid);
            if (event.detail.menuItem.id === "cancel") {
              app.sendMessage ("CancelCommand", record );  
            } else if (event.detail.menuItem.id === "replace") {
                console.log ("replace");
            }
        }
    },

    fix_grid: {
        Rotor : {
            type: "FixMessage"
        },
        
        name: 'fix',
        style: 'border: 1',
        show: {
            toolbar: false,
            lineNumbers: true,
            footer: true
        },
    },

    alert_grid: {
        name: 'alerts',
        style: 'border: 1',
        show: {
            toolbar: false,
            lineNumbers: true,
            footer: true
        },
    }

}