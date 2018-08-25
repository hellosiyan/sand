import Rectangle from './lib/Rectangle';
import state from './State';
import { inGridTiles, inPixels } from './utils';
import { config } from './config';

export default class ControlBoardPlate extends Rectangle {
    constructor() {
        super();

        this.height = inPixels(10);

        this.steppedOn = false;
    }

    draw(ctx) {}

    stepOn() {
        if (this.steppedOn) {
            return;
        }

        this.steppedOn = true;

        state.events.emit('controlBoardPlate.stepOn');
    }

    stepOff() {
        if (! this.steppedOn) {
            return;
        }

        this.steppedOn = false;

        state.events.emit('controlBoardPlate.stepOff');
    }
}
