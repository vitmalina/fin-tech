import app from '../app.js';
import { command_input_form } from './form/form.js';
import { CommandList } from '/lib/impx/CommandList.js';

export default {
    app_grid: {
        name: 'app_grid',
        Rotor : {
            type: "AppInfo"
        },
        show: {
            toolbar: false,
            footer: true
        },
        style: 'border: 1',
        contextMenu: [],
        onContextMenuClick(event) {
            const appId = event.detail.menuItem.appid;
            const typename = event.detail.menuItem.typeName
            const command = app.command_cache.getCommandByTypeName(appId, typename);

            if (typeof(command.DefaultCommand) !== "undefined" && command.DefaultCommand) {
                app.runCommand(command, {}, { isdefault: true });
            }

            command_input_form.handleCommandParameters(command);
            console.log('command', command)
        },
        onSelect(event) {
            const rowId = event.detail.clicked.recid;
            if (rowId === "-none-") { return; }

            this.updateContextMenu(rowId);

            const app_data = app.data_cache.getData("AppInfo", rowId);
            commandList.populateCommands(app_data.Row.AppId);
        },
        updateContextMenu(rowId) {
            const app_data = app.data_cache.getData("AppInfo", rowId);
            const app_commands = app.command_cache.getVisibleCommands(app_data.Row.AppId);

            this.contextMenu = app_commands.map(command => {
                return {
                    id: command.key,
                    text: command.displayName,
                    icon: command.icon || '',
                    description: command.description || '',
                    appid: app_data.Row.AppId,
                    typeName: command.typeName
                };
            });
        },
    }
}

const commandList = new CommandList("command-list");
commandList.onCommandClick = (commandObj) => {
    if (typeof(commandObj.DefaultCommand) !== "undefined" && commandObj.DefaultCommand) {
        app.runCommand (commandObj, {}, { isdefault: true });
    }

    command_input_form.handleCommandParameters(commandObj);    
};