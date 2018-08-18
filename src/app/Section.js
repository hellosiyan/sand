import Settable from './lib/Settable';
import TileGrid from './lib/TileGrid';
import game from './Game';

export default class Section extends Settable() {
    constructor() {
        super();

        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.color = '#dad';
    }

    get area() {
        return this.w * this.h;
    }

    get xMax () {
        return this.x + this.w;
    }

    get yMax () {
        return this.y + this.h;
    }

    getTileGrid () {
        if (this.hasOwnProperty('tileGrid')) {
            return this.tileGrid;
        }

        this.tileGrid = new TileGrid();
        this.tileGrid.resize(this.w, this.h);

        let vertical = this.w > this.h;
        let padding = Math.round(game.prngs.pcg.next());
        let step = Math.round(game.prngs.pcg.next()) + 2;

        // Disallow horizontal aisles with height > 1
        if (! vertical && this.w > 2) {
            step = 2;
        }

        // Remove random padding for odd lengths
        if (vertical && ((this.w % 2) == 1)) {
            padding = 0;
        } else if (! vertical && ((this.h % 2) == 1)) {
            padding = 0;
        }

        for (let x = this.x; x < this.xMax; x++) {
            for (let y = this.y; y < this.yMax; y++) {
                let draw = vertical ? (this.xMax - x + padding) % step : (this.yMax - y + padding) % step;

                if (draw) {
                    this.tileGrid.set(x - this.x, y - this.y, 1);
                }
            }
        }

        return this.tileGrid;
    }

    divide () {
        if (this.area < 24) return false;

        const [position, size] = this.w >= this.h ? ['x', 'w'] : ['y', 'h'];
        const cutRatio = (0.5 + (game.prngs.pcg.next() - 0.5) * 0.2);
        const cutSize = Math.round(this[size] * cutRatio);
        const cutExtraGap = 1; // Extra gap to the default 1 unit gap

        const sibling = new Section().set({
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
        });

        sibling[position] += cutSize + cutExtraGap;
        sibling[size] -= cutSize + cutExtraGap;

        this[size] = cutSize - cutExtraGap;

        return sibling;
    }
}
