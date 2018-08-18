import Settable from './lib/Settable';
import Listenable from './lib/Listenable';
import Container from './lib/Container';
import AutoScrollView from './lib/AutoScrollView';
import Player from './Player';
import Mom from './Mom';
import Store from './Store';
import game from './Game';
import story from './Story';
import { inGridTiles } from './utils';

export default class Level extends Listenable(Settable()) {
    constructor(number) {
        super();

        this.number = number;
        this.startedAt = 0;
        this.totalSecondsPlayed = 0;

        this.story = story(this.number);

        this.store = new Store(this.number);
        this.player = new Player();
        this.mom = new Mom();

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

        this.totalSecondsPlayed = Math.ceil(((new Date()).getTime() - this.startedAt) / 1000);

        this.emit('stop');
    }

    loopHandler(dt) {
        this.player.move(dt);

        this.detectCollisions();

        if (this.player.distanceTo(this.mom) < inGridTiles(0.5)) {
            return this.stop();
        }

        game.canvas.draw();
    }

    prepareScene() {
        this.store.placePeople(this.player, this.mom);
        this.store.drawable.addChild([this.player, this.mom]);

        this.drawable.set({
            x: Math.round(game.canvas.width / 2 - this.drawable.width / 2),
            y: Math.round(game.canvas.height / 2 - this.drawable.height / 2),
            width: inGridTiles(this.store.width),
            height: inGridTiles(this.store.height),
        });

        this.drawable.addChild(this.store.drawable);


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
        const aisles = this.store.drawable.children;

        aisles.forEach(aisle => {
            if (! aisle.collidable || ! this.player.intersects(aisle)) {
                return;
            }

            let cri = this.player.collisionResponseImpulse(aisle);

            this.player.x += cri.x;
            this.player.y += cri.y;
        });
    }
}
