import app from '../app.js';
import conf from './conf.js'
import { RejectGrid } from './RejectGrid.js';
import { w2sidebar } from '/lib/w2ui/index.js'
import { ImpxW2Grid } from '/lib/impx/ImpxW2Grid.js'

const project_sb = new w2sidebar(Object.assign(conf.project_sb, conf.left_sb))
const MessageStats = new ImpxW2Grid(conf.MessageStats)
const AlgoOrderGrid = new ImpxW2Grid(conf.AlgoOrderGrid)
const SorOrderGrid = new ImpxW2Grid(conf.SorOrderGrid)
const MarketFillGrid = new ImpxW2Grid(conf.MarketFillGrid)
const MarketNewOrderGrid = new ImpxW2Grid(conf.MarketNewOrderGrid)
const OrderGrid = new ImpxW2Grid(conf.OrderGrid)
const RejectsW2Grid = new ImpxW2Grid(conf.RejectGrid)
const Grid = new RejectGrid();

app.router.add({
    '/operations*'(event) {
        app.app_layout.html('left', project_sb);
        app.app_layout.hide ("right", true);
        app.app_tb.uncheck(...app.app_tb.get());
        app.app_tb.check('operations');
    },
    '/operations'(event) {
        project_sb.select('operations');
        app.app_layout.html('main', AlgoOrderGrid);
    },
    '/operations/MessageStats'(event) {
        project_sb.select('operations');
        app.app_layout.html('main', MessageStats);
    },
    '/operations/AlgoOrderGrid'(event) {
        project_sb.select('operations');
        app.app_layout.html('main', AlgoOrderGrid);
    },
    '/operations/SorOrderGrid'(event) {
        project_sb.select('operations');
        app.app_layout.html('main', SorOrderGrid);
    },
    '/operations/MarketFillGrid'(event) {
        project_sb.select('operations');
        app.app_layout.html('main', MarketFillGrid);
    },
    '/operations/MarketNewOrderGrid'(event) {
        project_sb.select('operations');
        app.app_layout.html('main', MarketNewOrderGrid);
    },
    '/operations/OrderGrid'(event) {
        project_sb.select('operations');
        app.app_layout.html('main', OrderGrid);
    },
    '/operations/RejectGrid'(event) {
        project_sb.select('operations');
        app.app_layout.html('main', RejectsW2Grid);
    },
    '/operations/Grid'(event) {
        project_sb.select('operations');
        app.app_layout.addTargetToPane('main', Grid);
    }
});