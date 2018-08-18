class IO {
    constructor () {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;

        this.listeners = [];

        this.bindings = {
            up: [38, 90, 87],
            down: [40, 83],
            left: [37, 65, 81],
            right: [39, 68],
        };

        this.bindEvents();
    }

    on(keys, callback) {
        this.listeners.unshift({
            keys,
            callback,
        });
    }

    off(keys, callback = null) {
        this.listeners = this.listeners.filter((listener) => {
            if (listener.keys.sort().toString() != keys.sort().toString()) {
                return true;
            }

            if (callback && listener.callback !== callback) {
                return true;
            }

            return false;
        });
    }

    setKeyState (keyCode, state) {
        for (let prop in this.bindings) {
            if (this.bindings[prop].includes(keyCode)) {
                this[prop] = state;
                break;
            }
        }

        if (state) {
            this.triggerListeners(keyCode);
        }
    }

    triggerListeners(keyCode) {
        if (! this.listeners.length) {
            return;
        }

        let matchedCallbacks = [];

        this.listeners = this.listeners.filter((listener) => {
            if (! listener.keys.includes(keyCode)) {
                return true;
            }

            matchedCallbacks.push(listener.callback);

            return false;
        });

        matchedCallbacks.forEach(callback => callback.call());
    }

    bindEvents() {
        window.addEventListener('keydown', e => this.setKeyState(e.keyCode, true));
        window.addEventListener('keyup', e => this.setKeyState(e.keyCode, false));
        window.addEventListener('blur', e => this.up = this.down = this.left = this.right = false);
    }
}

const io = new IO();

io.KEY_SPACE = 32;
io.KEY_ESC = 27;
io.KEY_ENTER = 13;

export default io;
