import { Application } from './Application.js';
import TabulatorFull from '/lib/tabulator/src/js/core/TabulatorFull.js';

export class ImpxTabulatorGrid extends TabulatorFull {
    constructor(element, config) {
        super(element, config)
        this.subscribe = config.subscribe || false;
        this.on('tableBuilt',()=>{
            if (this.subscribe) {
                Application.thisApp.onLoadComplete(() => Application.thisApp.sendMessage("Subscription",
                    {
                        "SubName": config.Rotor.type,
                        "SubStatus": "Subscribe"
                    }));
            }
            if (config.Rotor) {
                Application.thisApp.subscribeDataCache('schema', event => {
                    if (event.detail.Name === config.Rotor.type) {
                        this.setupColumns(event.detail.message);
                    }
                });
    
                Application.thisApp.subscribeDataCache('data', event => {
                    if (event.detail.Name === config.Rotor.type) {
                        this.onRotorData(event.detail);
                    }
                });
            } else {
                console.warn("The Config for {", this.name, "} doesn't have {Rotor.type}. This grid will now Auto subscribe to DataCache Events");
            }
        });
        
    }
    
    setupColumns(message) {
        const columns = message.Columns;

        columns.forEach((column)=>{
            this.addColumn({title:column.Name,field:column.Name, width:125});
        });
    }

    processDataItem(dataItem) {
        switch (dataItem.data.RowData.UpdateOp) {
            case 'N':
                dataItem.data.RowData.Row.id = dataItem.data.RowId;
                this.addRow (dataItem.data.RowData.Row); 
                break;
            case 'U':
                try {
                    dataItem.data.RowData.Row.id = dataItem.data.RowId;
                    this.updateRow(dataItem.data.RowId, dataItem.data.RowData.Row);
                    
                } catch (error) {
                    console.warn(error);
                }
                break;
            case 'D':
                try{
                    this.deleteRow(dataItem.data.RowId);
                }catch (error){
                    console.warn(error);
                }
                 break;
            default:
                break;
        }
    }

    onRotorData(data) {
        //console.log("onRotorData.data", data);
        if (data.dataArray) {
            const start = performance.now ();

            data.dataArray.forEach((item) => {
                this.processDataItem(item);
            });

            console.log (`Load time for Tabulator (${data.dataArray.length}) ${(performance.now () - start) / 1000} sec`);
        } else {
            this.processDataItem(data);
        }
    }
}