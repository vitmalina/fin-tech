import { AppAlertBar } from './AppAlertBar.js';

const config = {
    name:'alert_tb',
        style:'height:26px',
        items: [
            {
                type: `html`, id: 'AlertDepth', style: '',
                html(item) {
                    const html = `<p style="padding:5px;">0</p>`
                    return html
                }
            },
            {
                type: `html`, id: 'LogLevel', style: '',
                html(item) {
                    const html = `<p style="padding:5px;">No Log Level</p>`
                    return html
                }
            },
            {
                type: `html`, id: 'AppId', style: '',
                html(item) {
                    const html = `<p style="padding:5px;">No AppId</p>`
                    return html
                }
            },
            {
                type: `html`, id: 'Name', style: '',
                html(item) {
                    const html = `<p style="padding:5px;">No Name</p>`
                    return html
                }
            },
            {
                type: `html`, id: 'Timestamp', style: '',
                html(item) {
                    const html = `<p style="padding:5px;">No TimeStamp</p>`
                    return html
                }
            },
            {
                type: `html`, id: 'AlertText', style: '',
                html(item) {
                    const html = `<p style="padding:5px; text-overflow:ellipsis">No new alerts</p>`
                    return html
                }
            },
            { type:'spacer', id: 'closeSpacer'}, 
            { type:'button', id:'reset', text:'Reset', icon:'w2ui-icon-pencil'},
            { type:'button', id:'clear', text:'Clear', icon:'w2ui-icon-cross'},
        ],
        onClick(event){
            this.handleAlert(event.detail.item.id)
        }

}

export class ImpxAlertBar extends AppAlertBar{
    constructor(){
        super(config)
    }
}