import app from '../../app.js';
import { ImpxInputForm } from '/lib/impx/index.js';

let conf = {
     command_input_form_container: {
         name: 'command_input_form',
         fields: [],
         record: {},
         actions: {
             run: function () {
                 console.log('Run button clicked', this.command, this.record);
                 if (this.command) {
                     app.runCommand(this.command, this.mapMessage(this.record));
                 } else {
                     console.warn("Please Select Command before hitting run");
                 }
             },
         },
     }
}

export const command_input_form = new ImpxInputForm(conf.command_input_form_container);
