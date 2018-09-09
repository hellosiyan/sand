import Drawable from './lib/Drawable';
import state from './State';
import { inPixels, lerp, randomBetween } from './utils';
import { config } from './config';

export default class Transition extends Drawable {
    constructor() {
        super();

        this.width = 0;
        this.height = 0;

        this.direction = 'in'; // ['in', 'out']
        this.callback = () => {};
        this.speed = 1.5;
    }

    setDirection(direction) {
        this.direction = direction;

        if (this.direction == 'out') {
            this.style.opacity = 0;
        } else {
            this.style.opacity = 1;
        }

        return this;
    }

    done() {
        setTimeout(() => this.callback(this), 1);
    }

    remove() {
        this.parent.removeChild(this);

        return this;
    }

    draw(ctx) {
        if (this.direction == 'out') {
            if (this.style.opacity < 1) {
                this.style.opacity = Math.min(1, this.style.opacity + state.loop.dt * this.speed);

                if (this.style.opacity >= 1) {
                    this.done();
                }
            }
        } else {
            if (this.style.opacity > 0) {
                this.style.opacity = Math.max(0, this.style.opacity - state.loop.dt * this.speed);

                if (this.style.opacity <= 0) {
                    this.done();
                }
            }
        }

        ctx.fillStyle = config.palettes.sand['0'];
        ctx.globalAlpha = this.style.opacity;
        ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    }

    then(callback) {
        this.callback = callback;

        return this;
    }

    setSpeed(speed) {
        this.speed = speed;

        return this;
    }

    static out() {
        return (new Transition())
            .setDirection('out');
    }

    static in() {
        return (new Transition())
            .setDirection('in');
    }
}
