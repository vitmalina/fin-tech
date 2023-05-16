import { Router } from './Router.js';
import { DataCache } from './DataCache.js';
import { CommandCache } from './CommandCache.js';
import { ImpxLogger } from './ImpxLogger.js';

export class Application extends EventTarget {
        static thisApp = null;
    
    constructor() {
        super ();
        this.name = "Application";
        this.connnectionStatus = "Disconnected";
        this.isLoadComplete = false;
        this.root_dir = "./";
        this.appInfo = null;
        this.socket = null;
        this.data_cache = new DataCache ();
        this.command_cache = new CommandCache();
        this.logger = new ImpxLogger ();
        this.router = new Router ();
    }

    initialize (host, port, Token = "") {
        this.onLoadComplete (() => {
            this.isLoadComplete = true;
            console.log ("Load completed");
        });

        window.addEventListener ('load', () => {
            console.log ("Window Loading Complete");
            this.#connect (host, port, Token);
        });
    }

    #connect (host, port, Token = "") {
        this.socket = new WebSocket ("ws://" + host + ':' + port);

        console.log ("Rotor socket connected");

        this.socket.onerror = (event) => {
            this.connnectionStatus = "Error";
            this.dispatchEvent (new Event ("connectionstatus"));
            console.error ("Rotor socket error: ", event);
        }

        this.socket.onclose = (event) => {
            this.connnectionStatus = "Disconnected";
            this.dispatchEvent (new Event ('connectionstatus'));
            console.warn ("Rotor socket close: ", event);
        }

        this.socket.onopen = () => {
            this.connnectionStatus = "Connected";
            this.dispatchEvent (new Event ("connectionstatus"));
            this.sendMessage ("Login", {"Token": Token});
        }

        this.socket.onmessage = (message) => {
            try {
                const rotor_message = JSON.parse (message.data);
                const type = Object.keys (rotor_message)[0];

                console.log ("Message: ", type, rotor_message);

                switch (type) {
                    case "DataSchema":
                        this.data_cache.onSchema (rotor_message.DataSchema);
                        break;
                    
                    case "DataEvent":
                        this.data_cache.onDataEvent (rotor_message.DataEvent);
                        break;
                    
                    case "Commands":
                        this.command_cache.onCommand (rotor_message);
                        break;
                    
                    case "Results":
                        this.dispatchEvent (new CustomEvent ('results', {detail : rotor_message}));
                        break;
                    
                    case "Response":  
                        this.dispatchEvent (new CustomEvent('response', {detail: rotor_message.Response.Text}));
                        break;
                    
                    case "LoadStart":
                        this.dispatchEvent (new Event ('loadstart'));
                        break;
                    
                    case "LoadComplete":
                        document.title = this.appInfo.AppId + " " + this.appInfo.Site;
                        this.dispatchEvent (new Event ('loadcomplete'));
                        break;
                    
                    case "AppLogon":
                        break;

                    case "AppInfo":
                        this.appInfo = rotor_message.AppInfo;
                        break;

                    default:
                        console.warn("Unknown rotor message", type);
                        break
                }
            }
            catch (error) {
                console.error (error);
            }
        }
    }

    socketSend (message) {
        if (this.connnectionStatus === "Connected") {
            console.log ("socketSend.message", message);
            this.socket.send (message);
        }
        else {
            console.warn ("Connection to application closed")
        }
    }

    runCommand (command, message = {}, options = { isdefault: false }) {
        const msg = {
            CommandHeader: {
                AppId: command.AppId,
                Command: options.isdefault === true ? command.DefaultCommand : command.typeName,
                IsDefault: options.isdefault,
            },
            [command.typeName]: message,
        };

        console.debug ("runCommand", msg);
        this.socketSend(JSON.stringify(msg));
    }

    sendMessage (type, message, options = { isdefault: false }) {
        const msg_out = {
            CommandHeader: {
                Command: type,
                IsDefault: options.isdefault,
            },
            [type]: message
        };

        console.debug ("sendMessage", msg_out);
        this.socketSend (JSON.stringify (msg_out));
    }

    async sendHttpMessage (url, type, message, localOptions = {isdefault: false}, options = {}) {

        const formatMessage = {
            CommandHeader: {
                Command: type,
                isdefault: localOptions.isdefault,
            },
            [type]: message
        }

        let requestOptions = {
            method: options.method || 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        if (requestOptions.method.toUpperCase () === 'POST') {
            requestOptions = {
                ...requestOptions,
                body: JSON.stringify (formatMessage),
            }
        }

        console.log ("requestOptions", requestOptions);
        try {
            const response = await fetch (url, requestOptions);
            if (response.ok) {
                return await response.json ();
            }
            else {
                throw new Error (`Request failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error ('Error sending message:', error);
            throw error;
        }
    }

    onLoadComplete (fn) {
        if (this.isLoadComplete) {
            fn ();
        }
        else {
            this.addEventListener ('loadcomplete', () => fn());
        }
    }

    subscribeDataCache (type, callback) {
        this.onLoadComplete (() => this.data_cache.subscribe (type, callback));
    }
}