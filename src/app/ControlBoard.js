import Container from './lib/Container';
import Collidable from './lib/Collidable';
import Rectangle from './lib/Rectangle';
import eventBus from './lib/EventBus';
import game from './Game';
import { inGridTiles, inPixels } from './utils';
import { config } from './config';

export default class ControlBoard extends Collidable(Container) {
    constructor() {
        super();

        this.width = inGridTiles(2);
        this.height = inGridTiles(2);

        this.steppedOn = false;

        this.plate = new Rectangle()
            .set({
                width: inGridTiles(1),
                height: inGridTiles(0.5),
                y: this.height,
            })
            .setStyle({
                color: '#183c66'
            })
            .alignWith(this.innerBox)
            .centerHorizontally();

        this.lamp = new Rectangle()
            .set({
                x: inPixels(4),
                y: inPixels(4),
                width: inPixels(52),
                height: inPixels(22),
            })
            .setStyle({
                color: '#666'
            });

        this.addChild(this.plate);
        this.addChild(this.lamp);

        this.lettersEntered = '';
        eventBus.on('fusebox.activated', letter => {
            this.lettersEntered += letter;
        });
    }

    stepOn() {
        if (this.steppedOn) {
            return;
        }

        this.steppedOn = true;
        this.plate.setStyle({color: '#04b7e9'});
        this.checkCorrect();
    }

    stepOff() {
        if (! this.steppedOn) {
            return;
        }

        this.steppedOn = false;
        this.plate.setStyle({color: '#183c66'});
        this.lamp.setStyle({color: '#666'});

        this.lettersEntered = '';

        eventBus.emit('fusebox.deactivateAll');
    }

    checkCorrect() {
        let correct = this.lettersEntered == game.level.desert.messagePort.getLetters();

        if (correct) {
            eventBus.emit('controlboard.correct');
            this.lamp.setStyle({color: '#0f0'});
        } else {
            eventBus.emit('controlboard.incorrect');
            this.lamp.setStyle({color: '#f00'});
        }
    }

    draw(ctx) {
        ctx.fillStyle = config.palettes.controlBoard['1'];
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = config.palettes.controlBoard['2'];
        ctx.fillRect(this.x, this.y + inGridTiles(1), this.width, inPixels(1));

        super.draw(ctx);
    }

    get center() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height,
        };
    }
}
