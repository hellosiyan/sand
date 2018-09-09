import Drawable from './lib/Drawable';
import state from './State';
import { inPixels } from './utils';

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.r = randomBetween(10, 30);
        this.a = randomBetween(0, Math.PI);
        this.aStep = 1.8;

        this.size = inPixels(1);
        this.speed = randomBetween(120, 240);
    }

    update() {
        this.x += state.loop.dt * Math.cos(this.a) * this.r;
        this.a += state.loop.dt * this.aStep;

        this.y += state.loop.dt * this.speed;
    }
}

function randomBetween(min, max, round) {
    let num = Math.random() * (max - min + 1) + min;

    if (round) {
        num = Math.floor(num);
    }

    return num;
}

export default class Storm extends Drawable {
    constructor(width, height) {
        super();

        this.width = width;
        this.height = height;
        this.maxParticles = 100;
        this.particles = [];
        this.sideSpeed = 360;
    }

    init() {
        let i = this.maxParticles;

        while (i--) {
            let x = randomBetween(0, this.width, true);
            let y = randomBetween(0, this.height, true);

            this.particles.push(new Particle(x, y));
        }
    }

    draw(ctx) {
        let i = this.particles.length;

        ctx.fillStyle = '#fbc02d';
        ctx.globalAlpha = 0.1;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = '#876701';
        ctx.globalAlpha = 1;

        while (i--) {
            let particle = this.particles[i];

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

            particle.update();

            particle.x += state.level.view.lastMove.x + state.loop.dt * this.sideSpeed;
            particle.y += state.level.view.lastMove.y;
        }
    }
}
