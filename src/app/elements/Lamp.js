import Drawable from '../lib/Drawable';
import Pixmap from '../Pixmap';
import { config } from '../config';
import state from '../State';

const literal = `
0110
1221
1331
1111
1441
1551
0110`;

const pixmaps = {
    inactive: Pixmap.load(literal, {
        '0': 'rgba(0,0,0,0)',
        '1': 'rgba(38,50,56,255)',
        '2': 'rgba(33,33,33,255)',
        '3': 'rgba(0,0,0,255)',
        '4': 'rgba(33,33,33,255)',
        '5': 'rgba(0,0,0,255)'
    }).toDrawable().cache(),
    red: Pixmap.load(literal, {
        '0': 'rgba(0,0,0,0)',
        '1': 'rgba(38,50,56,255)',
        '2': 'rgba(33,33,33,255)',
        '3': 'rgba(0,0,0,255)',
        '4': 'rgba(216,67,21,255)',
        '5': 'rgba(191,54,12,255)'
    }).toDrawable().cache(),
    green: Pixmap.load(literal, {
        '0': 'rgba(0,0,0,0)',
        '1': 'rgba(38,50,56,255)',
        '2': 'rgba(10,126,7,255)',
        '3': 'rgba(13,83,7,255)',
        '4': 'rgba(33,33,33,255)',
        '5': 'rgba(0,0,0,255)'
    }).toDrawable().cache(),
};

export default class Lamp extends Drawable {
    constructor() {
        super();

        this.pixmap = pixmaps.inactive;

        this.width = this.pixmap.width;
        this.height = this.pixmap.height;
    }

    turn(state) {
        switch(state) {
            case 'red': this.pixmap = pixmaps.red; break;
            case 'green': this.pixmap = pixmaps.green; break;
            default: this.pixmap = pixmaps.inactive; break;
        }

        return this;
    }

    draw(ctx) {
        const drawable = this.pixmap;
        drawable.x = this.x;
        drawable.y = this.y;
        drawable.draw(ctx);
    }
}
