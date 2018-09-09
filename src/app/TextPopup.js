import Listenable from './lib/Listenable';
import Container from './lib/Container';
import Rectangle from './lib/Rectangle';
import io from './lib/IO';
import Rune from './elements/Rune';
import Text from './Text';
import state from './State';
import { inPixels } from './utils';
import { config } from './config';

let popupStack = [];

export default class TextPopup extends Listenable(Container) {
    constructor() {
        super();

        this.padding = {
            horizontal: inPixels(5),
            vertical: inPixels(3),
        }

        this.margin = {
            horizontal: inPixels(7),
            vertical: inPixels(15),
        }

        this.background = (new Rectangle())
            .set({
                x: -1 * this.padding.horizontal,
                y: -1 * this.padding.vertical
            })
            .setStyle({
                color: '#fff',
            });
        this.addChild(this.background);

        this.text = new Text();
        this.addChild(this.text);

        this.howto = (new Text()).setFontSize(inPixels(.56)).setText('[space] to continue').setStyle({ color: '#999' });
        this.addChild(this.howto);

        this.runes = false;

        this.nextKeys = [io.KEY_SPACE];

        this.autoclearTimeout = false
    }

    setAutoclear(autoclear) {
        this.autoclear = autoclear;

        return this;
    }

    setText(text) {
        this.text.setText(text);

        return this;
    }

    setRunes(letters) {
        if (! letters) {
            if (this.runes) {
                this.runes.forEach(rune => this.removeChild(rune))
                this.runes = false;
            }

            return this;
        }

        this.runes = [];
        letters.forEach(letter => {
            const rune = new Rune();
            rune.letter = letter;

            this.runes.push(rune);
            this.addChild(rune);
        });

        return this;
    }

    alignElements() {
        const maxTextWidth = Math.max(this.text.width, this.howto.width);
        const backgroundHeight = this.text.height + this.padding.vertical + this.howto.height + (this.runes ? this.runes[0].height + this.padding.vertical : 0);

        this.set({
            x: Math.round(state.canvas.width - this.margin.horizontal - this.padding.horizontal - maxTextWidth),
            y: Math.round(state.canvas.height - this.margin.vertical - this.padding.vertical - backgroundHeight)
        });

        this.background.set({
            width: maxTextWidth + this.padding.horizontal * 2,
            height: backgroundHeight + this.padding.vertical * 2
        });

        let yCursor = this.text.height + this.padding.vertical;

        if (this.runes) {
            for (var i = 0; i < this.runes.length; i++) {
                this.runes[i].set({y: yCursor});
                this.runes[i].x += inPixels(1) * i + this.runes[i].width * i;
            }

            yCursor += this.runes[0].height + this.padding.vertical
        }

        this.howto.set({y: yCursor});
    }

    show() {
        this.alignElements();

        state.level.fixedDrawable.addChild(this);

        this._bindHideEvents();

        let runningY = Math.round(state.canvas.height - this.margin.vertical - this.background.height);
        popupStack.forEach(popup => {
            popup.y = Math.round(runningY - popup.background.height);
            runningY -= popup.background.height + this.padding.vertical;
        });

        popupStack.unshift(this);

        return this;
    }

    hide() {
        state.level.fixedDrawable.removeChild(this);

        popupStack.splice(popupStack.indexOf(this), 1);

        this.emit('hide.instant', this);

        setTimeout(() => {
            this.emit('hide', this);
        }, 250);
    }

    _bindHideEvents() {
        let onHide = () => {
            io.off(this.nextKeys, onHide);
            clearTimeout(this.autoclearTimeout)
            this.hide();
        };

        io.on(this.nextKeys, onHide);

        if (this.autoclear) {
            this.autoclearTimeout = setTimeout(onHide, 5000);
        }
    }

    static display(text, autoclear = false) {
        return (new TextPopup()).setText(text).setAutoclear(autoclear).show();
    }

    static closeAll() {
        popupStack.forEach(popup => popup.hide());
    }
}
