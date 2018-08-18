import Container from '../lib/Container';
import Collidable from '../lib/Collidable';
import Rectangle from '../lib/Rectangle';
import Shelf from './Shelf';
import { config } from '../config';
import { inPixels } from '../utils';

export default class Aisle extends Collidable(Container) {
    assemble() {
        const shelfSpacing = inPixels(8);
        const sideWidth = inPixels(1);

        for (var shelfRow = 0; shelfRow < 4; shelfRow++) {
            const shelf = new Shelf();

            shelf.set({
                x: sideWidth,
                y: this.height - shelf.height - shelfSpacing * shelfRow,
                width: this.width - sideWidth * 2,
                hasItems: shelfRow < 3,
            }).assemble();

            this.addChild(shelf);
        }

        let topShelf = this.children[this.children.length - 1];
        let topShelfEdge = Math.min(0, topShelf.y);

        // Sides
        this.addChild((new Rectangle()).set({
            x: 0,
            y: topShelfEdge,
            width: sideWidth,
            height: this.height + Math.abs(topShelfEdge),
        }).setStyle({
            color: config.palette['9'],
        }));

        this.addChild((new Rectangle()).set({
            x: this.width - sideWidth,
            y: topShelfEdge,
            width: sideWidth,
            height: this.height + Math.abs(topShelfEdge),
        }).setStyle({
            color: config.palette['9'],
        }));

        this.cache();

        return this;
    }
}
