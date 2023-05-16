import { Application } from './Application.js';


export class ImpxLogger {
    constructor (isDebug = false, consoleLogLevel = 'Notice') {
        this.isDebug = isDebug;
        this.consoleLogLevel = consoleLogLevel;
        this.criticalErrors = [];
        this.#overrideConsole ();
        this.#captureUnhandledExceptions ();
        this.#captureUnhandledRejections ();
    }

    pad(number) {
        return number < 10 ? '0' + number : number;
    }

    log(level, ...message) {
        const date = new Date ();
        const timestamp = `${this.pad(date.getHours ())}:${this.pad(date.getMinutes ())}:${this.pad(date.getSeconds ())}.${date.getMilliseconds ()}`;

        const colors = {
            'Trace': 'color: teal',
            'Debug': 'color: gray',
            'Info': 'color: black',
            'Notice': 'color: green',
            'Warn': 'color: orange',
            'Error': 'color: red',
            'Critical': 'color: magenta'
        };

        let stack = new Error ().stack.split ('\n');
        stack = stack.slice(1).filter (line => !line.includes ('ImpxLogger.js'));
        let trace = stack.length > 0 ? stack[0].trim () : 'No trace available';

        if (this.isDebug && ['Trace', 'Debug', 'Info'].includes (level)) {
            this.originalConsoleLog (`%c${timestamp} ${level}: Location: ${trace}`, colors[level], ...message);
        }
        else if (!['Trace', 'Debug', 'Info'].includes (level)) {
            this.originalConsoleLog (`%c${timestamp} ${level}: Location: ${trace}`, colors[level], ...message);
        }
    }

    Trace (...message) {
        this.log ('Trace', ...message);
    }

    Debug (...message) {
        this.log ('Debug', ...message);
    }

    Info (...message) {
        this.log ('Info', ...message);
    }

    Notice (...message) {
        this.log ('Notice', ...message);
    }

    Warn (...message) {
        this.log ('Warn', ...message);
    }

    Error (...message) {
        this.log ('Error', ...message);
    }

    Critical (...message) {
        this.log ('Critical', ...message );
        Application.thisApp.dispatchEvent ( new CustomEvent ('Critical',  { detail: { Name: "CriticalError", ...message }}));
        this.criticalErrors.push ({ Name: "Error", ...message })
    }

    #overrideConsole () {
        this.originalConsoleLog = console.log.bind (console);
        console.debug = (...message) => { this.Debug (...message); };
        console.log = (...message) => { this[this.consoleLogLevel] (...message); };
        console.warn = (...message) => { this.Warn (...message); };
        console.error = (...message) => { this.Error (...message); };
    }

    #captureUnhandledExceptions () {
        window.onerror = (message, source, lineno, colno, error) => {
            this.Critical (`Uncaught exception: ${message}, at: ${source}:${lineno}:${colno}`, error);
        }
    }

    #captureUnhandledRejections () {
        window.onunhandledrejection = (event) => {
            this.Critical (`Unhandled promise rejection: ${event.reason}`);
        }
    }
}
