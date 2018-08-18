import { config } from './config';

import NumberSequence from './lib/NumberSequence';
import Loop from './lib/Loop';
import IO from './lib/IO';
import Canvas from './lib/Canvas';
import Container from './lib/Container';
import Color from './lib/Color';
import TextOverlay from './lib/TextOverlay';

import Level from './Level';

class Game {
    constructor() {
        this.prngs = {};
        this.canvas = null;
        this.scene = null;

        this.levelNumber = 1;
        this.level = null;
        this.howtoShown = false;
    }

    init() {
        this.initCanvas();
        this.initPrngs();
        this.initLoop();
    }

    start() {
        return TextOverlay.display('<h2 class="center">Ghost Goes Lost</h2>')
            .withHowTo()
            .on('hide', () => this.playLevel(this.levelNumber));
    }

    nextLevel() {
        this.playLevel(this.levelNumber + 1);
    }

    playLevel(levelNumber) {
        this.levelNumber = levelNumber;
        this.level = new Level(this.levelNumber);

        TextOverlay.display(this.level.story)
            .on('hide', () => {
            this.level.start()
                .on('stop', () => {
                    TextOverlay.display('<p>Charlie was lost for <strong>' + this.level.totalSecondsPlayed + ' seconds</strong></p>')
                        .on('hide', () => this.nextLevel());
                });
        });
    }

    initCanvas() {
        this.canvas = new Canvas();
        this.canvas.setSize(400, 300);

        this.scene = new Container().set({
            width: this.canvas.width,
            height: this.canvas.height,
        });

        let bgColor = Color.fromHex(config.palette['b']).darken(0.7).toString();
        this.canvas.node.style.backgroundColor = bgColor;
        document.body.style.backgroundColor = bgColor;

        this.canvas.setScene(this.scene);
        this.canvas.appendTo(document.body);
    }

    initLoop() {
        this.loop = new Loop();
        this.loop.stats(true);
    }

    initPrngs() {
        const seed = 822505;//Math.round(Math.random()*10000);

        this.prngs.pcg = new NumberSequence(seed);
    }
}

const game = new Game();

export default game;
