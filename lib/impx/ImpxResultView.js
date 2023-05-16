import { Application } from './Application.js';
import { w2grid } from '/lib/w2ui/w2ui-2.0.es6.js';


const config = {
        name: 'result_grid',
        header: 'Results',
        show: {
            toolbar: false,
            footer: true
        },
        contextMenu: [{
            id: "Export",
            text: "Export",
            icon: '',
            description: ''
        }],
        onContextMenuClick (event) {
            if (event.detail.menuItem.text === "Export") {
                this.exportData ();
            }
        },
    };

export class ImpxResultView extends w2grid {
    constructor() {
        super (config);
        this.result = {};
        this.name = config.name;
        this.header = config.header;
        this.columns =  [];
        this.records =  [];
        this.recordHeight = 24;

        Application.thisApp.addEventListener ("results", event => {
            this.result = event.detail.Results;
            this.columns = this.generateColumns ();
            this.records = this.generateRecords ();
            this.render ();
        });
    }

    generateColumns () {
        return this.result.DataHeader.map ((header, index) => {
            return { field: String(index), text: header, sortable: true, size: '150px', autoResize: true };
        });
    }

    generateRecords () {
        return this.result.Data.map ((row, index) => {
            let style = '';
            if (row.ColorBack) {
                style += `background-color: ${row.ColorBack}; `;
            }
            if (row.ColorText) {
                style += `color: ${row.ColorText};`;
            }

            const record = {
                recid: index + 1,
                w2ui : {
                    style: style
                }
            };

            row.RowData.forEach ((cell, index) => {
                record[String (index)] = cell;
            });
            return record;
        });
    }


    exportData () {
        if (!this.records.length) {
            return;
        }

        const csvEscape = (entry) => {
            if (entry !== null) {
                entry = entry.toString ();
                if (entry.includes ('"') || entry.includes (",")) {
                    return `"${entry.replace (/"/g, '""')}"`;
                }
                return entry;
            }
        };

        const lines = [];
        if (this.header != null) {
            lines.push (this.columns.map (column => csvEscape (column.text)).join (","));
        }
        if (this.records != null) {
            this.records.forEach ((record) => {
                const row = this.columns.map (column => csvEscape (record[column.field]));
                lines.push (row.join(","));
            });
        }
        const csvContent = lines.join("\r\n");

        const csvBlob = new Blob ([csvContent], { type: "text/csv" });
        const link = document.createElement ("a");
        link.href = URL.createObjectURL (csvBlob);
        link.download = "export.csv";
        document.body.appendChild (link);
        link.click ();
        document.body.removeChild (link);
    }
}
