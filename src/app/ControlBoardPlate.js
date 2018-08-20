import Rectangle from './lib/Rectangle';
import state from './State';
import { inGridTiles, inPixels } from './utils';
import { config } from './config';

export default class ControlBoardPlate extends Rectangle {
    constructor() {
        super();

        this.width = inGridTiles(1);
        this.height = inGridTiles(0.5);

        this.steppedOn = false;

        this.colors = {
            inactive: '#183c66',
            active: '#04b7e9',
        }

        this.style.color = this.colors.inactive;
    }

    stepOn() {
        if (this.steppedOn) {
            return;
        }

        this.steppedOn = true;
        this.style.color = this.colors.active;

        state.events.emit('controlBoardPlate.stepOn');
    }

    stepOff() {
        if (! this.steppedOn) {
            return;
        }

        this.steppedOn = false;
        this.style.color = this.colors.inactive;

        state.events.emit('controlBoardPlate.stepOff');
    }
}
