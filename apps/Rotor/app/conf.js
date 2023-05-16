import app from './app.js';

export default {
    app_layout: {
        name: 'app_layout',
        padding: 4,
        style: 'background-color: #888',
        panels: [
            {type: 'top', size: '68px', overflow: 'hidden', hidden: false, resizable: false},
            {type: 'left', size: '180px', minSize: 100, resizable: true},
            {type: 'main', overflow: 'hidden'},
            {type: 'right', size: '180px', minSize: 100, resizable: true},
            {type: 'preview', size: '200px', overflow: 'hidden', hidden: true, resizable: true},
            {type: 'bottom', size: '120px', resizable: true, hidden: false}
        ]
    },
    top_layout: {
        name:'top-layout',
        border: true,
        panels: [
            {type:'top', size: '30px', overflow:'hidden', hidden: false},
            {type:'main', size: '30px', overflow:'hidden', hidden: false},
        ]
    },
    right_layout: {
        name: 'right_layout',
        padding: 4,
        style: 'background-color: #888',
        panels: [
            {type: 'top', size: '300', resizable: true},
            {type: 'main', size: '500', hidden: false}
        ]
    },
    left_layout: {
        name: 'left_layout',
        padding: 4,
        style: 'background-color: #888',
        panels: [
            {type: 'top', size: '300', resizable: true},
            {type: 'main', size: '500', hidden: false}
        ]
    },
    left_sb: {
        name: 'main_sb',
        nodes: [
            {
            id: 'general', text: 'General', icon: '', group: true, expanded: true,
                nodes: [
                    {id: 'apps', text: 'Apps', icon: 'icon-home', route: '/process'}
                ],
            }
        ]
    },
    left_sb_proto: {
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
    }
}