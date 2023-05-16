import { Application } from './Application.js';
import { w2toolbar } from '/lib/w2ui/w2ui-2.0.es6.js';

export class AppAlertBar extends w2toolbar {
    constructor(options){
        super(options)
        this.alertData = {};
        this.depthCount = 0;

        //subscribe to data app alerts
        Application.thisApp.subscribeDataCache('data', event =>{
            if(event.detail.Name === "AppAlert") {
                this.addAlert(event.detail);
            }
        })
    }

    addAlert(data){

        if (data.dataArray) {
            if (!data.dataArray.length > 0) {return;}

            data.dataArray.sort((a, b) => {
                return new Date(b.data.RowData.Row.Timestamp) - new Date(a.data.RowData.Row.Timestamp);
            });

            this.alertData = {[data.dataArray[0].data.RowId] : data.dataArray[0].data.RowData};
            this.depthCount = data.dataArray.length;
        } else {
            this.alertData = {[data.data.RowId]: data.data.RowData}
            this.depthCount++;
        }
        this.updateDepthItem();
        this.items.slice(1).forEach((item)=>{
            this.updateAlertItem(item.id);
        })  
    }

    handleAlert(action){
        const command = Application.thisApp.command_cache.getCommandByTypeName(Application.thisApp.appInfo.AppId, "AlertAction");
        switch (action) {
            case 'clear':
                Application.thisApp.runCommand(command, { AlertCommand: 'clear', AlertIds: [Object.values(this.alertData)[0].Row.recid] });
                break;
            case 'reset':
                Application.thisApp.runCommand(command, { AlertCommand: 'reset', AlertIds: [Object.values(this.alertData)[0].Row.recid] });
                break;
            default:
                break;
        }
        
    }

    updateDepthItem() {
        const depthItem = this.get('AlertDepth');
        depthItem.html = () => `<p style="padding:5px">${this.depthCount}</p>`;
        this.refresh('AlertDepth');
    }

    updateAlertItem(item){
            const alert = this.get(`${item}`);
            if(alert === null) {return;}
            const key = Object.keys(this.alertData).pop()
            const data = this.alertData[key]
            const alertDataItem = data ? data.Row[item] : `No ${item}`;
            const bgclr = data ? data.ColorBack : 'white';
            alert.html = () => `<p style="padding:5px; margin:0px;">${alertDataItem}</p>`
            alert.text = `${alertDataItem}`
            this.box.style = `background-color:${bgclr};`
            this.refresh(`${item}`);
          
    }
}