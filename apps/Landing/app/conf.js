import app from "./app.js";


export default {
    app_layout: {
        name: 'app_layout',
        padding: 4,
        panels: [
            {type: 'top', size: '40px', overflow: 'auto', hidden: false, resizable: false},
            {type: 'left', size: '180px', minSize: 100, resizable: true, hidden: false,},
            {type: 'main', overflow: 'hidden', html: '<h1>Coming soon. Important alerts</h1>' },
            {type: 'right', size: '400px', minSize: 100, resizable: true, hidden: true,},
            {type: 'preview', size: '200px', overflow: 'hidden', hidden: true, resizable: true},
            {type: 'bottom', size: '120px', resizable: true, hidden: true}
        ]
    },
    app_tb: {
        name: 'app_tb',
        items: [
            {id: 'Home', type: 'button', text: 'Home', icon: 'icon-home'},
            {type: 'break'},
            {id: 'Rotor', type: 'button', text: 'Rotor', icon: 'icon-home', disabled: true},
            {type: 'break'},
            {id: 'Hypercron', type: 'button', text: 'Hypercron', icon: 'icon-home', disabled: true}, //todo placeholder
            {type: 'break'},
            {id: 'FixTrader', type: 'button', text: 'FixTrader', icon: 'icon-home', disabled: true},
            {type: 'break'},
            {id: 'spacer1', type: 'spacer'},
            {
                id: "loginForm",
                type: "html",
                html: `
                  <form style="display: inline-flex;">
                    <input type="text" id="username" placeholder="Username" style="margin-right: 5px; height: 20px;" />
                    <input type="password" id="password" placeholder="Password" style="margin-right: 5px; height: 20px;" />
                  </form>
                `,
            },
            {id: 'loginButton', type: 'button', text: 'Login', icon: 'icon-play'},
        ],
        onClick (event) {
            event.done (() => {
                if (event.detail.item.id === 'Home') {
                    window.location.href = window.location.origin;;
                } else if (event.detail.item.id === 'FixTrader') {
                    window.location.href = 'http://localhost:9185/fixtrader.html';
                } else if (event.detail.item.id === 'Hypercron') {
                    console.log(window.location);
                    console.warn("This is only a place holder.");
                } else if (event.detail.item.id === 'Rotor') {
                    window.location.href = window.location.origin + "/rotor.html";
                }
                else if (event.detail.item.id === 'loginButton') {
                    const username = document.getElementById("username").value;
                    const password = document.getElementById("password").value;
                    const url = window.location.origin + "/authentication";
                    const message = { Username: username, Password: password };

                    app.sendHttpMessage(url, "Login", message)
                        .then((response) => {
                            app.prefs.set("Token", response.ServerLogin.Token)

                            this.enable('FixTrader');
                            this.enable('Hypercron');
                            this.enable('Rotor');
                            this.remove("loginForm");
                            this.remove("loginButton");

                            console.log("Local Saved Token", app.prefs.get("Token"))
                        })
                        .catch((error) => console.error('Error sending message:', error));
                }
            })
        },
    },
}