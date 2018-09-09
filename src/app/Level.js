import Settable from './lib/Settable';
import Listenable from './lib/Listenable';
import Container from './lib/Container';
import AutoScrollView from './lib/AutoScrollView';
import Rectangle from './lib/Rectangle';
import Player from './Player';
import Desert from './Desert';
import Timer from './Timer';
import { inGridTiles } from './utils';
import state from './State';

export default class Level extends Listenable(Settable()) {
    constructor() {
        super();

        this.level = 1;
        this.startedAt = 0;

        this.desert = new Desert();
        this.player = new Player();
        state.timer = this.timer = new Timer();

        this.rootDrawable = new Container();
        this.view = new AutoScrollView();
        this.floatDrawable = new Container();
        this.fixedDrawable = new Container();
    }

    start() {
        this.prepareScene();

        state.canvas.setScene(this.rootDrawable);
        state.loop.start(dt => this.loopHandler(dt));

        this.startedAt = (new Date()).getTime();

        this.bindEvents();

        this.timer.setTimeLimit(120).start();

        return this;
    }

    stop() {
        state.canvas.draw();
        state.loop.stop();

        this.emit('stop');
    }

    bindEvents() {
        state.events.on('fusebox.deactivateAll', () => {
            this.desert.fuseboxes.forEach(fusebox => fusebox.dectivate())
        });

        state.events.on('controlboard.correct', () => {
            const levels = ['a', 'ba', 'cab'];

            this.level ++;
        });

        state.events.on('timer.timeout', () => {
            this.stop();
        });
    }

    loopHandler(dt) {
        this.timer.tick(dt);

        this.player.move(dt);

        this.detectCollisions();
        this.detectActivatedPressurePlates();

        state.canvas.draw();
    }

    prepareScene() {
        this.view.set({
                width: state.canvas.width,
                height: state.canvas.height,
                target: this.player,
            })
            .addTo(this.rootDrawable);

        this.floatDrawable.set({
                x: Math.round(state.canvas.width / 2 - this.floatDrawable.width / 2),
                y: Math.round(state.canvas.height / 2 - this.floatDrawable.height / 2),
                width: state.canvas.width,
                height: state.canvas.height,
            })
            .addChild(this.desert.drawable)
            .addTo(this.view);

        this.fixedDrawable.set({
                x: 0,
                y: 0,
                width: state.canvas.width,
                height: state.canvas.height,
            })
            .addTo(this.rootDrawable);

        this.timer.set({
            x: Math.round(state.canvas.width / 2 - this.timer.width / 2),
            y: state.canvas.height - this.timer.height - inGridTiles(1),
        }).addTo(this.fixedDrawable);

        Object.assign(this.view.boundries, {
            left: Math.round(this.view.width * 0.2),
            right: Math.round(this.view.width * 0.8),
            top: Math.round(this.view.height * 0.5),
            bottom: Math.round(this.view.height * 0.8),
        });

        this.desert.placeActors(this.player);
    }

    detectCollisions() {
        const obstacles = this.desert.drawable.children;

        obstacles.forEach(obstacle => {
            if (! obstacle.collidable || ! this.player.intersects(obstacle)) {
                return;
            }

            let cri = this.player.collisionResponseImpulse(obstacle);

            this.player.x += cri.x;
            this.player.y += cri.y;
        });
    }

    detectActivatedPressurePlates() {
        state.fuseboxPlates.forEach((fusebox, index) => {
            if (this.player.intersects(fusebox)) {
                state.fuseboxes[index].activate();
            }
        });

        if (this.player.intersects(state.controlBoardPlate)) {
            state.controlBoardPlate.stepOn();
        } else {
            state.controlBoardPlate.stepOff();
        }
    }
}
