import { w2form } from '/lib/w2ui/w2ui-2.0.es6.js';

export class ImpxInputForm extends w2form {
    constructor(options) {
        super(options);
    }

    handleCommandParameters(command) {
        this.fields = [];
        this.record = {};
        this.command = command;
    
        if (command.parameters && command.parameters.length > 0) {
            command.parameters.forEach((param, index) => {
                const field = {
                    field: param.typeName,
                    type: param.values ? 'list' : param.typeName === 'Password' ? 'password' : 'text',
                    required: param.required || false,
                    default: param.default || null,
                    html: {
                        label: param.displayname,
                        attr: param.typeName === 'Password' ? 'type="password"' : '',
                    },
                };
    
                if (param.values) {
                    field.options = {
                        items: [
                            ...(param.ColumnType === 'ENUMERATION' && !param.required ? [{ id: '', text: ' ' }] : []),
                            ...param.values.map((value) => ({
                                id: value.value,
                                text: value.displayName,
                            })),
                        ],
                        selected: param.columntype === 'ENUMERATION' && !param.required
                            ? { id: '', text: ' ' }
                            : param.values.length > 0
                            ? {
                                id: param.values[0].value,
                                text: param.values[0].displayName,
                            }
                            : null,
                    };
                }
                if (field.required) {
                    if (field.default) {
                        this.record[field.field] = field.default;
                    } else if (field.options && field.options.selected) {
                        this.record[field.field] = field.options.selected;
                    }
                }
                this.fields.push(field);
            });
        }

        this.header = command.description;
        this.render();
        this.refresh ();
    }

    mapMessage(input) {
        const output = {};
        const keys = Object.keys(input);
        keys.forEach((key) => {
            if (input[key] !== null) {
                const value = input[key].id ? input[key].id : (input[key].text ? input[key].text : input[key]);
                if (value !== null) {
                    output[key] = value;
                }
            }
        });   
        return output;
    }

    render(box) {
        // Regenerate the HTML before calling the parent's render method
        const html = this.generateHTML();
        this.formHTML = html;

        // Call the parent's render method
        return super.render(box);
    }
   
    populateFormFromRecord(rowData) {
        for (const key in rowData) {
            if (rowData.hasOwnProperty(key)) {
                const field = this.fields.find(f => f.field.toLowerCase() === key.toLowerCase());
                if (field) {
                    if (field.type === 'list') {
                        const item = field.options.items.find(item => item.text === rowData[key]);
                        if (item) {    
                            this.record[field.field] = item.id;
                        }
                    } else {
                        this.record[field.field] = rowData[key];
                    }
                }
            }
        }
        this.refresh();
    }          
}
