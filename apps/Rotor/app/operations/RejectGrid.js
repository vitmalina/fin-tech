import { ImpxTabulatorGrid } from '/lib/impx/ImpxTabulatorGrid.js'

const tabConf = {
        height:'100%', // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        layout:"fitColumns",
        target: 'example-table',
        Rotor:{
            type:"Reject"
        }
    }

export class RejectGrid extends ImpxTabulatorGrid {
    constructor() {
        const targetId = RejectGrid.createTabulatorTag(tabConf.target);
        super(`#${targetId.id}`, tabConf);
        this.target = targetId;
    }

    static createTabulatorTag(targetId) {
        const target = document.createElement('div');
        target.setAttribute('id', targetId);
        document.body.appendChild(target);
        return target;
    }
}