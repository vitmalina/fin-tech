
export class CommandCache extends EventTarget {
    constructor() {
        super ();
        this.commands = {};
    }

    onCommand (item) {
        if (!(item.Commands.AppId in this.commands)) {
            this.commands[item.Commands.AppId] = item.Commands.CommandsList;
        } else {
            console.warn ("Received update on command");
            this.commands[item.Commands.AppId] = item.Commands.CommandsList;
        }
        console.log("commands", this.commands);
    }

    getVisibleCommands(app) {
        return this.commands[app].filter ((command) => !command.Hidden);
    }

    getCommandByTypeName(app, commandTypeName) {
        if (!this.commands[app]) {
            console.warn("App not found in commands.");
            return null;
        }

        const command = this.commands[app].find(
            (command) => command.typeName === commandTypeName
        );

        if (!command) {
            console.warn("Command not found for the given typeName.");
            return null;
        }

        return command;
    }
}

