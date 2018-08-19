import Container from './lib/Container';
import Collidable from './lib/Collidable';
import Rectangle from './lib/Rectangle';
import { inGridTiles, inPixels } from './utils';
import { config } from './config';
import eventBus from './lib/EventBus';

export default class ControlBoard extends Collidable(Container) {
    constructor() {
        super();

        this.width = inGridTiles(2);
        this.height = inGridTiles(2);

        this.steppedOn = false;

        this.plate = new Rectangle()
            .set({
                width: inGridTiles(1),
                height: inGridTiles(0.5),
                y: this.height,
            })
            .setStyle({
                color: '#f00'
            })
            .alignWith(this.innerBox)
            .centerVertically();

        this.lamp = new Rectangle()
            .set({
                x: inPixels(3),
                y: inPixels(3),
                width: inPixels(2),
                height: inPixels(2),
            })
            .setStyle({
                color: '#666'
            });

        this.addChild(this.plate);
        this.addChild(this.lamp);
    }

    stepOn() {
        if (this.steppedOn) {
            return;
        }

        this.steppedOn = true;
        this.plate.setStyle({color: '#0f0'});
        this.checkCorrect();
    }

    stepOff() {
        if (! this.steppedOn) {
            return;
        }

        this.steppedOn = false;
        this.plate.setStyle({color: '#f00'});
        this.lamp.setStyle({color: '#666'});

        eventBus.emit('fusebox.deactivateAll');
    }

    checkCorrect() {
        let correct = true;

        if (correct) {
            this.lamp.setStyle({color: '#0f0'});
        } else {
            this.lamp.setStyle({color: '#f00'});
        }
    }

    draw(ctx) {
        ctx.fillStyle = config.palettes.controlBoard['1'];
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = config.palettes.controlBoard['2'];
        ctx.fillRect(this.x, this.y + inGridTiles(1), this.width, inPixels(1));

        super.draw(ctx);
    }

    get center() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height,
        };
    }
}
