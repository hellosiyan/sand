export default function Listenable(baseClass) {
    if (! baseClass) {
        baseClass = class {};
    }

    class Listenable extends baseClass {
        constructor() {
            super();

            this.eventHandlers = {};
        }

        on(event, handler) {
            if (! (event in this.eventHandlers)) {
                this.eventHandlers[event] = [];
            }

            this.eventHandlers[event].push(handler);
        }

        off(event, handler) {
            if (! (event in this.eventHandlers)) {
                return;
            }

            if (!handler) {
                this.eventHandlers[event].splice(0, this.eventHandlers[event].length);
                return;
            }

            const index = this.eventHandlers[event].indexOf(handler);

            if (index < 0) {
                return;
            }

            this.eventHandlers[event].splice(index, 1);
        }

        offAll() {
            for(let event in this.eventHandlers) {
                this.eventHandlers[event].splice(0, this.eventHandlers[event].length);
            }
        }

        emit(event, data) {
            if (! (event in this.eventHandlers)) {
                return;
            }

            this.eventHandlers[event].map(handler => handler(data));
        }
    };

    return Listenable;
}
