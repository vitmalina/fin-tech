import { Application } from './Application.js';
import { w2toolbar } from '/lib/w2ui/w2ui-2.0.es6.js';
import { w2popup } from '/lib/w2ui/w2ui-2.0.es6.js';

export class ImpxToolBar extends w2toolbar {
    constructor (options) {
        super (options);
        this.onAppValue = null; // callback to override default

        Application.thisApp.subscribeDataCache ('data', event => {
            if (event.detail.Name === "AppValue") {
                this.#updateAppItems (event.detail);
            }
        });

        Application.thisApp.addEventListener ('Critical', event => {
            if (event.detail.Name === "CriticalError") {
                this.#addCriticalError ();
            }
        });
    }

    #addCriticalError () {
        if (!this.get ('errors')) {
            this.insert ('app_status',  {
                id: 'errors',
                type: 'button',
                text: `Browser Errors: ${Application.thisApp.logger.criticalErrors.length + 1}`,
                onClick: () => {
                    let errorMessages = Application.thisApp.logger.criticalErrors.map ((error, index) => `<p>${index + 1}: ${JSON.stringify (error)}</p>`).join ('');
                    w2popup.open ({
                        title: 'Errors',
                        body: `<div style="padding: 10px;">${errorMessages}</div>`,
                    });
                }
            });
        }
        else {
            this.get ('errors').text = `Errors: ${Application.thisApp.logger.criticalErrors.length + 1}`;
            this.refresh ('errors');
        }
    }

    #updateAppItems (data) {
        if (data.dataArray) {
            data.dataArray.forEach (item => {
                this.#setAppItem (item.data);
            });
        } 
        else {
            this.#setAppItem (data.data);
        }
    }

    #setAppItem (item) {
        const statusItem = this.get (item.RowId);
            
//        if (this?.onAppValue (item.RowId, item.RowData))
//            return;

        if (statusItem) {
            const obj = item.RowData;
            const statusDataKey = obj.Row?.Name ?? '';
            const statusDataVal = obj.Row?.VarValue ?? '';
            const bgclr = obj.ColorBack ? obj.ColorBack : '';
            const clr = obj.ColorText ? obj.ColorText: '';
            statusItem.html = () => `<div style="padding:5px; margin:0px;">${statusDataKey}${statusDataVal}</div>`;
            statusItem.style = `background-color:${bgclr}; color:${clr}; border-radius: 0px`;
            this.refresh (item.RowId);
        }    
    }

    // alexg. Can not put this into constructor. Causes error: Super constructor can be called only once 
    subscribeToAppConnectionStatus () {
        Application.thisApp.addEventListener ("connectionstatus", () => {
            const item = this.get ("app_status");

            if (item != null) {
                switch (Application.thisApp.connnectionStatus) {
                    case 'Connecting':
                        item.style = 'background-color: orange; border-radius: 0px';
                        break;
                    case 'Connected':
                        item.style = 'background-color: #25a853; border-radius: 0px';
                        break;
                    case 'Disconnected':
                        item.style = 'background-color: red; border-radius: 0px';
                        break;
                    case 'Error':
                        item.style = 'background-color: crimson; border-radius: 0px';
                        break;
                    default:
                        item.style = 'background-color: gray; border-radius: 0px';
                        break;
                }
            
            this.refresh ("app_status");    
            }
        });
    }

}