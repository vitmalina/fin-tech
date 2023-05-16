import app from '../app.js';

export default {
    left_sb: {
        flatButton: true,
        onFlat(event) {
            if (event.detail.goFlat === true) {
                app.app_layout.set('left', {size: 35, minSize: 35, resizable: false})
                app.prefs.set('ui-sidebar-size', 'small')
            } else {
                app.app_layout.set('left', {size: 180, minSize: 100, resizable: true})
                app.prefs.set('ui-sidebar-size', 'large')
            }
        },
        onRender(event) {
            event.done(function () {
                if (app.prefs.get('ui-sidebar-size') === 'small' && this.flat !== true) {
                    this.goFlat(true)
                }
                if (app.prefs.get('ui-sidebar-size') === 'large' && this.flat === true) {
                    this.goFlat(false)
                }
            })
        }
    },
    project_sb: {
        name: 'project_sb',
        style: 'background-color: #fff',
        nodes: [
            { id: 'general', text: 'Operations', group: true, expanded: true,
                nodes: [
                    { id: 'MessageStats', text: 'Message Stats', icon: 'icon-table', route:'/operations/MessageStats'},
                    { id: 'AlgoOrderGrid', text: 'Algo Orders', icon: 'icon-table', route:'/operations/AlgoOrderGrid'},
                    { id: 'SorOrderGrid', text: 'Sor New Orders', icon: 'icon-table', route:'/operations/SorOrderGrid'},
                    { id: 'MarketFillGrid', text: 'Market Fills', icon: 'icon-table', route:'/operations/MarketFillGrid'},
                    { id: 'MarketNewOrderGrid', text: 'Market New Orders', icon: 'icon-table', route:'/operations/MarketNewOrderGrid'},
                    { id: 'OrderGrid', text: 'Orders', icon: 'icon-table', route:'/operations/OrderGrid'},
                    { id: 'RejectGrid', text: 'Rejects', icon: 'icon-table', route:'/operations/RejectGrid'},
                    { id: 'TabGrid', text: 'Rejects Tabulator', icon: 'icon-table', route:'/operations/Grid'},
                ],
            }
        ],
    },
    AlgoOrderGrid: {
        name: 'AlgoOrderGrid',
        Rotor : {
            type: "AlgoNewOrder"
        },
        show :{
            toolbar: true,
            footer:true
        },
    },
    SorOrderGrid: {
        name: 'SorOrderGrid',
        Rotor : {
            type: "SorNewOrder"
        },
        show :{
            toolbar: true,
            footer:true
        },
    },
    MarketFillGrid: {
        name: 'MarketFillGrid',
        Rotor : {
            type: "MarketFill"
        },
        show :{
            toolbar: true,
            footer:true
        },
    },
    MarketNewOrderGrid: {
        name: 'MarketNewOrderGrid',
        Rotor : {
            type: "MarketNewOrder"
        },
        show :{
            toolbar: true,
            footer:true
        },
    },
    OrderGrid: {
        name: 'OrderGrid',
        Rotor : {
            type: "Order"
        },
        show :{
            toolbar: true,
            footer:true
        },
    },
    RejectGrid: {
        name: 'RejectGrid',
        Rotor : {
            type: "Reject"
        },
        show :{
            toolbar: true,
            footer:true
        },
    },
    MessageStats: {
        name: 'MessageStats',
        Rotor : {
            type: "MessageStats"
        },
        show :{
            toolbar: true,
            footer:true
        },
    },

}