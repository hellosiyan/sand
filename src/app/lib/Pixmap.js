import Settable from './Settable';
import Drawable from './Drawable';
import Canvas from './Canvas';

export default class Pixmap extends Settable() {

    constructor() {
        super();

        this.width = 0;
        this.height = 0;
        this.map = [];
    }

    getRenderSize() {
        let width = this.inPixels(this.width);
        let height = this.inPixels(this.height);

        return { width, height };
    }

    toDrawable() {
        let { width, height } = this.getRenderSize();

        let drawable = new Drawable().set({ width, height });

        drawable.draw = (ctx) => {
            this.map.forEach((color, index) => {
                ctx.fillStyle = color;
                ctx.fillRect(
                    drawable.x + this.inPixels(Math.floor(index % this.width)),
                    drawable.y + this.inPixels(Math.floor(index / this.width)),
                    this.inPixels(1),
                    this.inPixels(1)
                );
            });
        };

        return drawable;
    }

    toCanvas() {
        const drawable = this.toDrawable();

        const offscreenCanvas = new Canvas();
        offscreenCanvas.setSize(drawable.width, drawable.height, false);

        drawable.draw(offscreenCanvas.ctx);

        return offscreenCanvas;
    }

    toPattern(repetition) {
        const canvas = this.toCanvas();

        return canvas.ctx.createPattern(canvas.node, repetition);
    }

    toPatternedDrawable(options, repetition) {
        const pixmapCanvas = this.toCanvas();

        // Bootstrap drawable
        const drawable = new Drawable();
        drawable.set({
            width: pixmapCanvas.width,
            height: pixmapCanvas.height,
        });

        if (options.width) {
            drawable.set({ width: options.width });
        }

        if (options.height) {
            drawable.set({ height: options.height });
        }

        // Botstrap pattern
        const offscreenCanvas = new Canvas().setSize(drawable.width, drawable.height, false);
        const pattern = offscreenCanvas.ctx.createPattern(pixmapCanvas.node, repetition);

        offscreenCanvas.ctx.fillStyle = pattern;
        offscreenCanvas.ctx.fillRect(0, 0, drawable.width, drawable.height);

        // Override draw
        drawable.draw = function (ctx) {
            ctx.drawImage(offscreenCanvas.node, this.x, this.y);
        };

        return drawable;
    }

    inPixels(value) {
        return value;
    }

    static load(literal, colorKey, width = 0) {
        const colors = [];

        literal = literal.trim();

        if (width === 0) {
            let firstNewlinePosition = literal.indexOf('\n');
            width = firstNewlinePosition > 0 ? firstNewlinePosition : literal.length;
        }

        for (let char of literal) {
            if (char === '\n') {
                continue;
            }

            if (! colorKey.hasOwnProperty(char)) {
                console.warn(`Key "${char}" not defined in the color list.`);
                colorKey[char] = '#0f0';
            }

            colors.push(colorKey[char]);
        }

        return new this().set({
            map: colors,
            width: width,
            height: Math.ceil(colors.length / width),
        });
    }
}
