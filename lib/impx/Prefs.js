export class Preferences {
    constructor(app, defaults) {
        this.app = app;
        this.data = {};

        this.init(defaults);
    }

    init(defaults) {
        // init preferences
        try {
            this.data = localStorage.getItem(this.app.name + '-prefs');
            this.data = JSON.parse(this.data);
        } catch (e) {
            this.data = null;
        }
        if (this.data == null) {
            this.data = defaults || {};
            localStorage.setItem(this.app.name + '-prefs', JSON.stringify(this.data));
        }
    }

    set(name, value) {
        if (name == null) return;
        this.data[name] = value;
        localStorage.setItem(this.app.name + '-prefs', JSON.stringify(this.data));
    }

    get(name) {
        if (name == null) return null;
        return this.data[name];
    }

    remove(name) {
        if (name == null) return;
        delete this.data[name];
        localStorage.setItem(this.app.name + '-prefs', JSON.stringify(this.data));
    }

}
