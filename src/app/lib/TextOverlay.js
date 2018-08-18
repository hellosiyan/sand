import Listenable from './Listenable';
import io from './IO';

export default class TextOverlay extends Listenable() {
    constructor() {
        super();

        this.node = document.createElement('div');
        this.node.classList.add('text-overlay');
        this.node.innerHTML = '{{placeholder}}';

        this.nextKeys = [io.KEY_SPACE, io.KEY_ESC, io.KEY_ENTER];
    }

    setText(text) {
        this.node.innerHTML = text + '<p class="right"><button>&raquo;</button></p>';

        return this;
    }

    withHowTo() {
        let howtoNode = document.createElement('p');
        howtoNode.classList.add('right');
        howtoNode.innerHTML = '<small>Press <strong>esc</strong>, <strong>space</strong>, or <strong>enter</strong> to continue</small>';

        this.node.appendChild(howtoNode);

        return this;
    }

    show() {
        document.body.appendChild(this.node);

        this._bindHideEvents();

        return this;
    }

    hide() {
        this.node.parentNode.removeChild(this.node);
        this.emit('hide');
    }

    _bindHideEvents() {
        let onHide = () => {
            io.off(this.nextKeys, onHide);
            this.hide();
        };

        io.on(this.nextKeys, onHide);

        this.node.querySelector('button')
            .addEventListener('click', onHide);
    }

    static display(text) {
        return new TextOverlay()
            .setText(text)
            .show();
    }
}
