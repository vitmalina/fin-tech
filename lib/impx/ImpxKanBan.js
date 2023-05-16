class Task {
    constructor(alert) {
        this.name = alert.Name;
        this.description = alert.AlertText;
    }
}

class List {
    constructor(app) {
        this.name = app.Application;
        this.app = app; // store the whole app object
        this.tasks = [];
    }

    addTask(alert) {
        this.tasks.push(new Task(alert));
    }

    removeTask(taskName) {
        this.tasks = this.tasks.filter(task => task.name !== taskName);
    }
}

export class ImpxKanbanBoard {
    constructor() {
        this.lists = [];
    }

    addList(app) {
        this.lists.push(new List(app));
    }

    removeList(listName) {
        this.lists = this.lists.filter(list => list.name !== listName);
    }

    addTaskToList(appName, alert) {
        let list = this.lists.find(list => list.name === appName);
        if (list) {
            list.addTask(alert);
        }
    }

    moveTask(taskName, sourceListName, targetListName) {
        let sourceList = this.lists.find(list => list.name === sourceListName);
        let targetList = this.lists.find(list => list.name === targetListName);

        if (sourceList && targetList) {
            let task = sourceList.tasks.find(task => task.name === taskName);
            if (task) {
                sourceList.removeTask(taskName);
                targetList.addTask(task);
            }
        }
    }

    loadAppsAndAlerts(apps, alerts) {
        this.apps = apps;

        if (alerts && typeof alerts[Symbol.iterator] === 'function') {
            this.alerts = alerts;
        } else {
            this.alerts = [];
        }

        for (let app of apps) {
            this.addList(app);
        }

        for (let alert of this.alerts) {
            this.addTaskToList(alert.Application, alert);
        }
    }


    toHTML() {
        let html = '<div class="kanban-board">';
        for (let list of this.lists) {
            let app = list.app;
            if (app) {
                html += `<div class="kanban-list">
                    <div class="kanban-list-header">
                        <h2>${list.name}</h2>
                        <p>App ID: ${app.AppId}</p>
                        <p>Start Time: ${app.StartTime}</p>
                    </div>
                    <ul>`;
                for (let task of list.tasks) {
                    html += `<li>${task.name}: ${task.description}</li>`;
                }
                html += '</ul></div>';
            }
        }
        html += '</div>';
        return html;
    }
}
