import Container from './lib/Container';
import Collidable from './lib/Collidable';
import Rectangle from './lib/Rectangle';
import ControlBoardPlate from './ControlBoardPlate';
import ControlBoardElement from './elements/ControlBoard';
import LampElement from './elements/Lamp';
import state from './State';
import { inGridTiles, inPixels } from './utils';
import { config } from './config';

export default class ControlBoard extends Collidable(Container) {
    constructor() {
        super();

        this.element = (new ControlBoardElement()).addTo(this);

        this.width = this.element.width;
        this.height = inGridTiles(1);

        this.element.alignWith(this).bottomEdges();

        this.lamps = [];
        for (let i = 0; i < 5; i++) {
            this.lamps.push(
                (new LampElement()).set({
                    x: inPixels(18 + i * 6 + (i==4?1:0)),
                    y: inPixels(78),
                }).addTo(this.element)
            );
        }

        this.lettersEntered = '';

        state.events.on('fusebox.activated', letter => {
            this.lettersEntered += letter;
        });

        state.events.on('controlBoardPlate.stepOn', () => {
            this.checkCorrect();
        });

        state.events.on('controlBoardPlate.stepOff', () => {
            this.lamps[state.level.level - 1].turn('inactive');
            this.lettersEntered = '';
            state.events.emit('fusebox.deactivateAll');
        });

        state.events.on('timer.timeout', () => {
            this.lamps[state.level.level - 1].turn('red');
        });
    }

    checkCorrect() {
        let correct = true;

        if (correct) {
            this.lamps[state.level.level - 1].turn('green');
            state.events.emit('controlboard.correct');
        } else {
            this.lamps[state.level.level - 1].turn('red');
            state.events.emit('controlboard.incorrect');
        }
    }
}
