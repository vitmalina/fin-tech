import { Application } from './Application.js';
import { w2grid } from '/lib/w2ui/w2ui-2.0.es6.js';

export class ImpxW2Grid extends w2grid {
    constructor (config) {
        super (config);
        this.recordHeight = 24;
        this.reorderColumns = true;
        this.subscribe = config.subscribe || false;

        if (this.subscribe) {
            Application.thisApp.onLoadComplete (() => Application.thisApp.sendMessage ("Subscription",
                {
                    "SubName": config.Rotor.type,
                    "SubStatus": "Subscribe"
                }));
        }

        if (config.Rotor) {
            Application.thisApp.subscribeDataCache ('schema', event => {
                if (event.detail.Name === config.Rotor.type) {
                    this.setupColumns (event.detail.message);
                }
            });

            Application.thisApp.subscribeDataCache ('data', event => {
                if (event.detail.Name === config.Rotor.type) {
                    this.onRotorData (event.detail);
                }
            });
        }
        else {
            console.warn ("The Config for {", this.name, "} doesn't have {Rotor.type}. This grid will not auto subscribe to DataCache events");
        }
    }

    setupColumns (message) {
        message.Columns.forEach (column => {
            {
            const hidden = column.Name === "AppId" ? true : false;
            let style = "";
            
            if (column.ColumnType === "NUMBER" || column.ColumnType === "TIMESTAMP") {
                style = "text-align: right";
            }

            this.addColumn ( { field: column.Name, text: column.Name, size: "100px", sortable: true, resizable: true, autoResize: true, hidden: hidden, style: style } );
            }
        });
    }

    processDataItem (item) {
        let style = '';
        if (item.data.RowData.ColorBack) {
            style += `background-color: ${item.data.RowData.ColorBack}; `;
        }
        if (item.data.RowData.ColorText) {
            style += `color: ${item.data.RowData.ColorText};`;
        }

        switch (item.data.RowData.UpdateOp) {
            case 'N':
                item.data.RowData.Row.recid = item.data.RowId;
                item.data.RowData.Row.w2ui = { style: style };
                this.add (item.data.RowData.Row);
                break;

            case 'U':
                const update_row = this.get (item.data.RowId);

                if (update_row != null) {
                    item.data.RowData.Row.w2ui = { style: style };
                    this.set (item.data.RowId, item.data.RowData.Row);
                }
                else {
                    console.warn (`Record not found for update {${this.name}, {${item.data.RowId}}`);
                }
                break;

            case 'D':
                const delete_row = this.get (item.data.RowId);

                if (delete_row != null) {
                    this.remove (item.data.RowId);
                } 
                else {
                    console.warn (`Record not found for delete {${this.name}, {${item.data.RowId}}`);
                }
                break;

            default:
                break;
        }
    }

    onRotorData (data) {

        if (data.dataArray) {
            const start = performance.now ();

            data.dataArray.forEach ((item) => {
                this.processDataItem (item);
            });
        
            console.log (`Load time for {${this.name}}, rows (${data.dataArray.length}) (${(performance.now () - start) / 1000}) sec`);
        } else {
            this.processDataItem (data);
        }
    }
}

