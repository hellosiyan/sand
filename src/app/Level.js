import Settable from './lib/Settable';
import Listenable from './lib/Listenable';
import Container from './lib/Container';
import AutoScrollView from './lib/AutoScrollView';
import Player from './Player';
import Desert from './Desert';
import game from './Game';

export default class Level extends Listenable(Settable()) {
    constructor() {
        super();

        this.startedAt = 0;

        this.desert = new Desert();
        this.player = new Player();

        this.drawable = new Container();

        this.view = new AutoScrollView();
    }

    start() {
        this.prepareScene();

        game.canvas.setScene(this.view);
        game.loop.start(dt => this.loopHandler(dt));

        this.startedAt = (new Date()).getTime();

        return this;
    }

    stop() {
        game.canvas.draw();
        game.loop.stop();

        this.emit('stop');
    }

    loopHandler(dt) {
        this.player.move(dt);

        this.detectCollisions();

        game.canvas.draw();
    }

    prepareScene() {
        this.desert.placeActors(this.player);

        this.drawable.set({
            x: Math.round(game.canvas.width / 2 - this.drawable.width / 2),
            y: Math.round(game.canvas.height / 2 - this.drawable.height / 2),
            width: game.canvas.width,
            height: game.canvas.height,
        });

        this.drawable.addChild(this.desert.drawable);

        this.drawable.addTo(this.view);

        this.view.set({
            width: game.canvas.width,
            height: game.canvas.height,
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
}
