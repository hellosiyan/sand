import Container from './lib/Container';
import Collidable from './lib/Collidable';
import Rectangle from './lib/Rectangle';
import ControlBoardPlate from './ControlBoardPlate';
import state from './State';
import { inGridTiles, inPixels } from './utils';
import { config } from './config';

export default class ControlBoard extends Collidable(Container) {
    constructor() {
        super();

        this.width = inGridTiles(2);
        this.height = inGridTiles(2);

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

        this.addChild(this.lamp);

        this.lettersEntered = '';

        state.events.on('fusebox.activated', letter => {
            this.lettersEntered += letter;
        });

        state.events.on('controlBoardPlate.stepOn', () => {
            this.checkCorrect();
        });

        state.events.on('controlBoardPlate.stepOff', () => {
            this.lamp.setStyle({color: '#666'});
            this.lettersEntered = '';
            state.events.emit('fusebox.deactivateAll');
        });
    }

    checkCorrect() {
        let correct = this.lettersEntered == state.messagePort.getLetters();

        if (correct) {
            state.events.emit('controlboard.correct');
            this.lamp.setStyle({color: '#0f0'});
        } else {
            state.events.emit('controlboard.incorrect');
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
}
