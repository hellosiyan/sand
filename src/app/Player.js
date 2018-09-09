import Container from './lib/Container';
import Movable from './lib/Movable';
import PlayerElement from './elements/Player';
import io from './lib/IO';
import state from './State';
import { config } from './config';
import { inPixels, fromPixels } from './utils';

export default class Player extends Movable(Container) {
    constructor() {
        super();

        this.element = new PlayerElement();
        this.addChild(this.element);

        this.width = this.element.width;
        this.height = inPixels(3);

        this.element.alignWith(this.innerBox).bottomEdges();

        const hoverHeight = inPixels(1);
        this.element.y -= hoverHeight;
    }

    draw(ctx) {
        this.element.setDirection(this.direction);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';

        const shrink = this.element.levitationY > 9 ? 3: this.element.levitationY / 3;
        const padding = inPixels(1);
        ctx.fillRect(this.x + padding + shrink * 3, this.y - padding * 2 + shrink, this.width - padding * 2 - shrink * 2 * 3, this.height + padding * 4 - shrink * 2);
        ctx.fillRect(this.x + shrink * 3, this.y - padding + shrink, this.width - shrink * 2 * 3, this.height + padding * 2 - shrink * 2);
        ctx.fillRect(this.x - padding + shrink * 3, this.y + shrink, this.width + padding * 2 - shrink * 2 * 3, this.height - shrink * 2);

        super.draw(ctx);
    }

    move(dt) {
        if (state.movementDisabled) {
            return
        }

        if (! (io.left || io.right || io.up || io.down)) {
            this.speed *= Math.pow(0.6, (dt * 60));
            this.speed = this.speed < 0.1 ? 0 : this.speed;
        } else {
            this.speed += config.speed.acceleration * dt;
            this.speed = Math.min(this.speed, config.speed.max);
        }

        if (io.left) {
            this.direction.x = 'left';
        } else if (io.right) {
            this.direction.x = 'right';
        } else if (io.up || io.down) {
            this.direction.x = '';
        }

        if (io.up) {
            this.direction.y = 'up';
        } else if (io.down) {
            this.direction.y = 'down';
        } else if (io.left || io.right) {
            this.direction.y = '';
        }

        super.move(dt);
    }
}
