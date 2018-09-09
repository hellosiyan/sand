import Container from './lib/Container';
import { inGridTiles, inPixels } from './utils';
import { config } from './config';
import state from './State';

export default class Timer extends Container {
    constructor() {
        super();

        this.width = inPixels(30);
        this.height = inPixels(5);
        this.padding = inPixels(1);

        this.isRunning = false;
        this.timePassed = 0;
        this.timeLimit = 0;
    }

    draw(ctx) {
        const timeCoeff = this.passedTimeCoeff();

        ctx.fillStyle = config.palettes.timer['0'];
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = config.palettes.timer['1'];
        ctx.fillRect(this.x + this.padding, this.y + this.padding, this.width - this.padding * 2, this.height - this.padding * 2);

        ctx.fillStyle = config.palettes.timer['2'];
        ctx.fillRect(
            this.x + this.padding,
            this.y + this.padding,
            Math.floor((this.width - this.padding*2) * Math.round(timeCoeff * 100) / 100 / inPixels(1)) * inPixels(1),
            this.height - this.padding * 2
        );

        super.draw(ctx);
    }

    start() {
        this.isRunning = true;
        return this;
    }

    pause() {
        this.isRunning = false;
        return this;
    }

    stop() {
        this.isRunning = false;
        this.timePassed = 0;
        return this;
    }

    tick(dt) {
        if (! this.isRunning) {
            return;
        }

        this.timePassed += dt;

        if (this.timePassed >= this.timeLimit) {
            this.pause();
            state.events.emit('timer.timeout');
        }
    }

    passedTimeCoeff() {
        return this.timePassed/this.timeLimit;
    }

    setTimeLimit(seconds) {
        this.timeLimit = seconds;
        return this;
    }
}
