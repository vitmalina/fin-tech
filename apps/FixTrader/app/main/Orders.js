import  app from '../app.js';
import { ImpxInputForm } from '/lib/impx/index.js'
import { ImpxW2Grid } from '/lib/impx/index.js'

import { query, w2alert, w2grid, w2popup } from '/lib/w2ui/w2ui-2.0.es6.js'

let orders_grid;
let input_form;

let conf = {
    file_grid: {
        Rotor : {
            type: "NewOrderRequest"
        },
        name: 'files',
        multiSelect: false,
        style: 'border: 1',
        show: {
            toolbar: true,
            toolbarSearch: false,
            toolbarReload: false,
            lineNumbers: true,
            toolbarAdd: true,
            toolbarEdit: true,
            toolbarDelete: true,
            footer: true
        },


        toolbar: {
            items: [
                { type: 'menu', id: 'action', text: 'Action', icon: 'icon-filter',
                    items: [
                        { id: 'load', text: 'Load ...', icon: 'icon-file-up' },
                        { id: 'save', text: 'Save',     icon: 'icon-file-down' }
                    ]
                }
            ],
            onClick (event) {
                event.done (() => {
                    if (event.detail.subItem) {
                        if (event.detail.item.selected === 'load') {
                            app.sendMessage ("Orders", { Action: "Load", Name: "orders.txt"} );
                        }
                        else if (event.detail.item.selected === 'save') {
                            app.sendMessage ("Orders", { Action: "Save", Name: "orders.txt"} );
                        }
                    }
                })
            }
        },

        onAdd: function (event) {
            app.sendMessage ("Orders", { Action: "Add", Name: "orders.txt"} );
        },

        onEdit: function (event) {
            w2alert ('edit');
        },

        onDelete: function (event) {
        },

        contextMenu: [
            { id: 'send',     text: 'Send',     icon: 'icon-rocket' },
            { id: 'send_all', text: 'Send All', icon: 'icon-heatmap' },
            { id: 'edit',     text: 'Edit',     icon: 'icon-pencil' }
        ],

        onContextMenuClick(event) {
            const record = orders_grid.get(event.detail.recid);
            console.log("Selected record:", record);
            if (event.detail.menuItem.id === "send") {
                input_form.populateFormFromRecord(record);
                // input_form.updateFormActions(false);
            } else if (event.detail.menuItem.id === "edit") {
                input_form.populateFormFromRecord({ ...record, recid: event.detail.recid });
                // input_form.updateFormActions(true);
            }
            this.refresh();
        }
               
    },
    form: {
        name: 'dynamic_form',
        fields: [],
        actions: {
            Reset() {
                for (const field of this.fields) {
                    if (field.required) {
                        if (field.default) {
                            this.record[field.field] = field.default;
                        } else if (field.options && field.options.selected) {
                            this.record[field.field] = field.options.selected;
                        }
                    } else {
                        this.record[field.field] = null;
                    }
                }
                this.refresh();
            },            
            Run() {
                app.sendMessage ("NewOrderRequest", this.mapMessage(this.record));
            },
            Edit() {
                const rowData = orders_grid.get(this.record.recid);
                const newRecordData = { ...rowData, ...this.record };    
                orders_grid.set(this.record.recid, newRecordData);
                orders_grid.refresh();          
            }                                          
        },        
    }
}
orders_grid = new ImpxW2Grid (conf.file_grid);
input_form = new ImpxInputForm (conf.form);

app.onLoadComplete (() => {
    const newOrderCommand = app.command_cache.getCommandByTypeName (app.appInfo.AppId, "NewOrderRequest");
    
    input_form.handleCommandParameters (newOrderCommand);
    app.app_layout.html ("left", input_form);
});

export { orders_grid }; 
