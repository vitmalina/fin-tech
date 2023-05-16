import app from '../app.js';

export default {
    gateway_sb: {
        name: 'gateway_sb',
        nodes: [
            { id: 'general', text: 'General', icon: '', group: true, expanded: true,
                nodes: [
                    { id: 'gateways', text: 'Gateways', icon: 'icon-star', route: '/gateways/list' },
                ],
            }
        ]
    },

    gateways: {
        name: 'gateways',
        url: '/session_config',
        recordHeight: 24,
        show: {
            toolbar: false,
            toolbarSearch: false,
            toolbarReload: false,
            footer: true
        },
        toolbar: {
            items: [
                { type: 'menu', text: 'Action', icon: 'icon-filter',
                    items: [
                        { id: 'connect',    text: 'Connect',    icon: 'icon-rocket' },
                        { id: 'disconnect', text: 'Disconnect', icon: 'icon-off' }
                    ]
                }
            ],
            onClick (event) {
                event.done (() => {
                    if (event.detail.subItem) {
                        if (event.detail.item.selected === 'connect') {
                            this.connectDialog ();
                        }
                        else if (event.detail.item.selected === 'disconnect') {
                            app.sendMessage ("Disconnect", {} );
                        }
                    }
                })
            }
        },
        style: 'border: 1',
        columns: [
            { field: 'GatewayId',    text: 'GatewayId',    sortable: true, size: '100px'},
            { field: 'SessionId',    text: 'SessionId',    sortable: true },
            { field: 'SessionName',  text: 'SessionName',  sortable: true },
            { field: 'SenderCompId', text: 'SenderCompId', sortable: true },
            { field: 'TargetCompId', text: 'TargetCompId', sortable: true },
            { field: 'Port',         text: 'Port'         },
            { field: 'SourceBindIP', text: 'SourceBindIP' },
            { field: 'SenderSubId',  text: 'SenderSubId'  },
            { field: 'TargetSubId',  text: 'TargetSubId'  },
            { field: 'Comment',      text: 'Comment'      }
        ],
        contextMenu: [
            { id: 'connect',    text: 'Connect', icon: 'w2ui-icon-info' },
            { id: 'disconnect', text: 'Disconnet', icon: 'w2ui-icon-pencil' }
        ],
        onContextMenuClick (event) {
            if (event.detail.menuItem.id === "connect") {
                this.connectDialog ();
            }
            else if (event.detail.menuItem.id === "disconnet") {
                app.sendMessage ("Disconnect", {} );
            }
        }

    }
}