import { config } from './config';

import NumberSequence from './lib/NumberSequence';
import Loop from './lib/Loop';
import Canvas from './lib/Canvas';
import Container from './lib/Container';
import TextOverlay from './lib/TextOverlay';

import Level from './Level';
import state from './State';

class Game {
    constructor() {
        this.prngs = {};
        this.canvas = null;
        this.scene = null;
        this.level = null;
    }

    init() {
        this.initPrngs();
        this.initCanvas();
        this.initLoop();

        return this;
    }

    start() {
        return TextOverlay.display('<h2 class="center">js13kGames 2018</h2>')
            .withHowTo()
            .on('hide', () => this.playLevel());
    }

    playLevel() {
        this.level = new Level();
        this.level.start();

        state.level = this.level;
    }

    initCanvas() {
        this.canvas = new Canvas();
        this.canvas.setSize(800, 600);

        this.scene = new Container().set({
            width: this.canvas.width,
            height: this.canvas.height,
        });

        this.canvas.setScene(this.scene);
        this.canvas.appendTo(document.body);

        state.canvas = this.canvas;
    }

    initLoop() {
        this.loop = new Loop();
        this.loop.stats(true);

        state.loop = this.loop;
    }

    initPrngs() {
        const seed = 822505;//Math.round(Math.random()*10000);

        this.prngs.pcg = new NumberSequence(seed);
    }
}

const game = new Game();

export default game;
