import Drawable from './lib/Drawable';
import state from './State';
import { inPixels, lerp, randomBetween } from './utils';

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.size = inPixels(1);
        this.speed = randomBetween(120, 240);
    }

    update(dt) {
        this.y += dt * this.speed;
    }
}

export default class Storm extends Drawable {
    constructor() {
        super();

        this.width = 0;
        this.height = 0;

        this.level = 0;
        this.targetLevel = false;

        this.minParticles = 10;
        this.maxParticles = 2000;
        this.numParticles = this.minParticles;

        this.particles = [];

        this.sideSpeed = 360;
    }

    init() {
        let i = this.numParticles;

        while (i--) {
            this.addParticle();
        }

        return this;
    }

    setLevel(level) {
        this.level = level;

        this.numParticles = lerp(this.minParticles, this.maxParticles, this.level);

        return this;
    }

    levelUpTo(targetLevel) {
        this.targetLevel = targetLevel;
    }


    draw(ctx) {
        if (this.targetLevel !== false) {
            let newLevel = this.level + 0.005;
            if (newLevel >= this.targetLevel) {
                this.targetLevel = false;
                setTimeout(() => state.events.emit('storm.target.reached'), 250);
            }
            this.setLevel(newLevel);
        }

        while (this.particles.length < this.numParticles) {
            this.addParticle();
        }

        ctx.fillStyle = '#fad170';
        ctx.globalAlpha = this.level;

        ctx.globalCompositeOperation = 'color';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = '#876701';
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';

        let i = this.particles.length;

        while (i--) {
            const particle = this.particles[i];

            if (particle.y >= this.height) {
                particle.y = -particle.size + (particle.y % this.height);
                particle.x = randomBetween(0, this.width, true);
            } else if (particle.y < -2 * particle.size) {
                particle.y = this.height + (particle.y % this.height);
            }

            if (particle.x < -1 * particle.size) {
                particle.x += this.width + particle.size;
            } else if (particle.x > this.width) {
                particle.x -= this.width + particle.size;
            }

            ctx.fillRect(particle.x, particle.y, particle.size, particle.size);

            particle.update(state.loop.dt);

            particle.x += state.level.view.lastMove.x + state.loop.dt * this.sideSpeed;
            particle.y += state.level.view.lastMove.y;
        }
    }

    addParticle() {
        const x = randomBetween(0, this.width, true);
        const y = randomBetween(0, this.height, true);

        this.particles.push(new Particle(x, y));
    }
}
