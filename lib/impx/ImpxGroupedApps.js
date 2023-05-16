import { Application } from "./Application.js";

export class ImpxGroupedApps extends EventTarget {
    constructor(apps = null) {
        super ();
        this.apps = apps;
        this.id = 0;

        Application.thisApp.addEventListener('htmlGenerated', () => this.setEventsListener());
    }

    setApps(apps) {
        this.apps = apps;
    }

    groupByHostName() {
        let grouped = {};
        this.apps.forEach(app => {
            let key = app.HostName;
            if(!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(app);
        });
        return grouped;
    }

    toHTML() {
        let grouped = this.groupByHostName();
        let html = '';
        for(let hostName in grouped) {
            html += `
        <div class="collapsible">
            <h2 id="header${this.id}" class="collapse-header">
                <span class="arrow">&#9658;</span>
                ${hostName}
            </h2>
            <div id="content${this.id}" class="content" style="display:none;">
        `;
            grouped[hostName].forEach(app => {
                html += `<div>${app.Application}</div>`;
            });
            html += '</div></div>';
            this.id++;
        }
        return html;
    }

    setEventsListener() {
        let headers = document.getElementsByClassName('collapse-header');
        for(let i = 0; i < headers.length; i++) {
            headers[i].addEventListener('click', function() {
                let content = this.nextElementSibling;
                let arrow = this.children[0];
                if (content.style.display === "none") {
                    content.style.display = "block";
                    arrow.innerHTML = "&#9660;";
                } else {
                    content.style.display = "none";
                    arrow.innerHTML = "&#9658;";
                }
            });
        }
    }
}
