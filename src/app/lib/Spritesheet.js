import Settable from './Settable';

export default class Spritesheet extends Settable() {
    constructor() {
        super();

        this.sprites = {};
    }

    get(spriteName) {
        const sprite = this.sprites[spriteName];

        return {
            width: sprite.width,
            height: sprite.height,
            name: spriteName
        }
    }

    drawToHeight(spriteName, ctx, x, y, destHeight) {
        let sprite = this.sprites[spriteName];
        let destWidth = destHeight / sprite.height * sprite.width;

        this.draw(spriteName, ctx, x, y, destWidth, destHeight);
    }

    drawToFit(spriteName, ctx, x, y, destWidth, destHeight) {
        let sprite = this.sprites[spriteName];
        let width = destWidth;
        let height = width / sprite.width * sprite.height;

        if (height > destHeight) {
            height = destHeight;
            width = height / sprite.height * sprite.width;
        }

        this.draw(spriteName, ctx, x, y, width, height);
    }

    draw(spriteName, ctx, x, y, destWidth, destHeight) {
        let sprite = this.sprites[spriteName];

        if (! sprite) {
            return;
        }

        ctx.drawImage(
            sprite.canvas,
            0,
            0,
            sprite.width,
            sprite.height,
            x,
            y,
            destWidth,
            destHeight
        );
    }
}
