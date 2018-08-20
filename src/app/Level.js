import Settable from './lib/Settable';
import Listenable from './lib/Listenable';
import Container from './lib/Container';
import AutoScrollView from './lib/AutoScrollView';
import Player from './Player';
import Desert from './Desert';
import { inGridTiles } from './utils';
import state from './State';

export default class Level extends Listenable(Settable()) {
    constructor() {
        super();

        this.level = 1;
        this.startedAt = 0;

        this.desert = new Desert();
        this.player = new Player();

        this.drawable = new Container();

        this.view = new AutoScrollView();
    }

    start() {
        this.prepareScene();

        state.canvas.setScene(this.view);
        state.loop.start(dt => this.loopHandler(dt));

        this.startedAt = (new Date()).getTime();

        this.bindEvents();

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

            state.messagePort.setLetters(levels[this.level - 1]);
        });
    }

    loopHandler(dt) {
        this.player.move(dt);

        this.detectCollisions();
        this.detectActivatedPressurePlates();

        state.canvas.draw();
    }

    prepareScene() {
        this.desert.placeActors(this.player);

        this.drawable.set({
            x: Math.round(state.canvas.width / 2 - this.drawable.width / 2),
            y: Math.round(state.canvas.height / 2 - this.drawable.height / 2),
            width: state.canvas.width,
            height: state.canvas.height,
        });

        this.drawable.addChild(this.desert.drawable);

        this.drawable.addTo(this.view);

        this.view.set({
            width: state.canvas.width,
            height: state.canvas.height,
            target: this.player,
        });

        Object.assign(this.view.boundries, {
            left: Math.round(this.view.width * 0.2),
            right: Math.round(this.view.width * 0.8),
            top: Math.round(this.view.height * 0.5),
            bottom: Math.round(this.view.height * 0.8),
        });
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
        state.fuseboxes.forEach(fusebox => {
            if (this.player.intersects(fusebox)) {
                fusebox.activate();
            }
        });

        if (this.player.intersects(state.controlBoardPlate)) {
            state.controlBoardPlate.stepOn();
        } else {
            state.controlBoardPlate.stepOff();
        }

        if (this.player.intersects(state.messagePortPlate)) {
            state.messagePortPlate.stepOn();
        } else {
            state.messagePortPlate.stepOff();
        }
    }
}
