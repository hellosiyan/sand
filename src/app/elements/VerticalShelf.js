import Container from '../lib/Container';
import Color from '../lib/Color';
import Item from './Item';
import game from '../Game';
import { config } from '../config';
import { inPixels, inGridTiles } from '../utils';

export default class VerticalShelf extends Container {

    constructor() {
        super();

        this.hasItems = true;
        this.spaceBetweenItems = inPixels(7);
        this.spaceUsed = this.spaceBetweenItems;

        this.width = VerticalShelf.shelfWidth;
        this.style.color = config.palette['c'];
    }

    draw(ctx) {
        // Edge all around
        ctx.fillStyle = config.palette['9'];
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Middle section to cut over edges
        ctx.fillStyle = this.style.color;
        ctx.fillRect(this.x + inPixels(1), this.y + inPixels(1), this.width - inPixels(2), this.height - inPixels(2));

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(this.x + inPixels(1), this.y + this.height, this.width - inPixels(2), inPixels(1));

        super.draw(ctx);
    }

    assemble() {
        if (this.hasItems) {
            let item = this._createItem();

            while (this.hasSpaceFor(item)) {
                this.addChild(item);
                item = this._createItem();
            }
        }

        this.cache();

        return this;
    }

    hasSpaceFor(child) {
        return this.spaceUsed + this.spaceBetweenItems < this.height;
    }

    addChild(child) {
        if (Array.isArray(child)) {
            return super.addChild(child);
        }

        this.spaceUsed += this.spaceBetweenItems;
        child.y = this.spaceUsed - child.height;

        return super.addChild(child);
    }

    removeChild(child) {
        this.spaceUsed -= this.spaceBetweenItems;

        return super.removeChild(child);
    }

    _createItem() {
        const type = game.prngs.pcg.pick(Item.types()).name;

        const item = Item.create(type)
            .alignWith(this.innerBox).centerVertically();

        return item;
    }

    static get shelfWidth() {
        return Math.round(inGridTiles(0.5));
    }
}
