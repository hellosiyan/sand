import Container from '../lib/Container';
import Collidable from '../lib/Collidable';
import Rectangle from '../lib/Rectangle';
import Color from '../lib/Color';
import VerticalShelf from './VerticalShelf';
import { config } from '../config';
import { inPixels, fromPixels } from '../utils';

export default class Aisle extends Collidable(Container) {
    assemble() {
        const shelfHeight = this.height - inPixels(13);
        const shelfSpacing = inPixels(8);

        for (var shelfRow = 0; shelfRow < 4; shelfRow++) {
            const leftShelf = new VerticalShelf();

            leftShelf.set({ height: shelfHeight })
                .alignWith(this.innerBox).bottomEdges()
                .set({ y: leftShelf.y - shelfSpacing * shelfRow })
                .assemble();

            this.addChild(leftShelf);

            const rightShelf = new VerticalShelf();

            rightShelf.set({ height: shelfHeight })
                .alignWith(this.innerBox).do('rightEdges', 'bottomEdges')
                .set({ y: rightShelf.y - shelfSpacing * shelfRow })
                .assemble();

            this.addChild(rightShelf);
        }

        const topShelf = this.children[this.children.length - 1];
        const topShelfEdge = Math.min(0, topShelf.y);
        const middleHeight = this.height + Math.abs(topShelfEdge) + shelfSpacing;
        const middleWidth = this.width - VerticalShelf.shelfWidth * 2;

        // Middle
        this.addChild((new Rectangle())
            .set({
                width: middleWidth,
                height: middleHeight,
            })
            .alignWith(this.innerBox).do('centerVertically', 'bottomEdges')
            .setStyle({
                color: config.palette['9'],
            }));

        // Middle Front
        this.addChild((new Rectangle())
            .set({
                width: middleWidth,
                height: middleHeight - shelfHeight,
            })
            .alignWith(this.innerBox).do('centerVertically', 'bottomEdges')
            .setStyle({
                color: Color.fromHex(config.palette['9']).darken(0.3),
            }));

        this.cache();

        return this;
    }
}
