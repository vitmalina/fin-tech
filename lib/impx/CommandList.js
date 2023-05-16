import { Application } from '/lib/impx/Application.js';

export class CommandList {
    constructor(elementId) {
        this.elementId = elementId;
        this.onCommandClick = {};
    }

    populateCommands(appId) {
        const commandList = document.getElementById(this.elementId);
        const commands = Application.thisApp.command_cache.getVisibleCommands(appId);

        commandList.innerHTML = "";

        commands.forEach(command => {
            const commandItem = document.createElement("div");
            commandItem.classList.add("command-item");
            commandItem.innerText = command.displayName;
            commandItem.title = command.description || "";
            commandItem.style.cssText = `
              font-size: 12px;
              padding: 4px;
              cursor: pointer;
              margin-bottom: 4px;
            `;
            commandItem.onmouseover = () => {
              commandItem.style.backgroundColor = "darkgray";
            };
            commandItem.onmouseout = () => {
              commandItem.style.backgroundColor = "";
            };
            commandItem.onclick = () => {
                this.onCommandClick (command);
            };
            
            commandList.appendChild(commandItem);
        });
    }
}
