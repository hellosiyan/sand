import { config } from './config';
import { inPixels } from './utils';

import Text from './Text';
import NumberSequence from './lib/NumberSequence';
import Loop from './lib/Loop';
import Canvas from './lib/Canvas';
import Container from './lib/Container';
import Rectangle from './lib/Rectangle';
import Pixmap from './Pixmap';
import TextPopup from './TextPopup';
import Storm from './Storm';
import Transition from './Transition';

import Level from './Level';
import state from './State';

class Game {
    constructor() {
        this.prngs = {};
        this.canvas = null;
        this.scene = null;
        this.level = null;

        state.game = this;
    }

    init() {
        this.initPrngs();
        this.initCanvas();
        this.initLoop();

        return this;
    }

    start() {
        this.showIntro()
            .then(() => this.playLevel(1));
    }

    showIntro() {
        const rootDrawable = new Container();
        const background = (new Rectangle())
            .set({
                width: this.canvas.width,
                height: this.canvas.height,
            })
            .setStyle({ color: '#fff' })
            .addTo(rootDrawable);

        // set up fake level
        state.level = {
            fixedDrawable: rootDrawable,
            view: {
                lastMove: {
                    x: 0,
                    y: 0,
                }
            }
        };

        // Storm
        (new Storm())
            .set({
                width: this.canvas.width,
                height: this.canvas.height,
                numParticles: 100,
            })
            .init()
            .addTo(rootDrawable);

        // Title
        const title = (new Text())
            .setFontSize(inPixels(6))
            .setText('SAND')
            .setStyle({ color: config.palettes.sand['0'] })
            .addTo(rootDrawable)
            .alignWith(background).center();

        // Subtitle
        (new Text())
            .setFontSize(inPixels(1))
            .setText('a js13kGames entry by @hellosiyan')
            .setStyle({ color: config.palettes.sand['0'] })
            .addTo(rootDrawable)
            .alignWith(background).center()
            .set({y: title.y + title.height + inPixels(10)});

        // Boot it up
        this.canvas.setScene(rootDrawable);

        this.loop.start(dt => {
            this.canvas.draw();
        });

        return new Promise(resolve => {
            TextPopup.display('Press [space] to start')
                .on('hide', popup => {
                    popup.off('hide');

                    rootDrawable.addChild(
                        Transition.out()
                            .then(transition => {
                                this.loop.stop();
                                setTimeout(() => resolve(), 10);
                            })
                    );
                });

            Transition.in().setSpeed(0.5).addTo(rootDrawable).then(transition => transition.remove());
        });
    }

    showOutro() {
        const rootDrawable = new Container();
        const background = (new Rectangle())
            .set({
                width: this.canvas.width,
                height: this.canvas.height,
            })
            .setStyle({ color: '#fff' })
            .addTo(rootDrawable);

        // set up fake level
        state.level = {
            fixedDrawable: rootDrawable,
            view: {
                lastMove: {
                    x: 0,
                    y: 0,
                }
            }
        };

        // Storm
        (new Storm())
            .set({
                width: this.canvas.width,
                height: this.canvas.height,
                numParticles: 100,
            })
            .init()
            .addTo(rootDrawable);

        // Title
        const title = (new Text())
            .setFontSize(inPixels(6))
            .setText('SAND')
            .setStyle({ color: config.palettes.sand['0'] })
            .addTo(rootDrawable)
            .alignWith(background).center();

        title.y = Math.round(title.y + inPixels(20));

        [
            [1, 'a js13kGames entry by @hellosiyan', title.height + inPixels(10)],
            [1, 'signal is back', inPixels(-50)],
            [2, 'The storm has passed', inPixels(-40)],
            [1, 'Thanks for playing', inPixels(-11)]
        ].forEach(opts => {
            (new Text())
                .setFontSize(inPixels(opts[0]))
                .setText(opts[1])
                .setStyle({ color: config.palettes.sand['0'] })
                .addTo(rootDrawable)
                .alignWith(background).center()
                .set({y: title.y + opts[2]});
        });

        // Boot it up
        this.canvas.setScene(rootDrawable);

        Transition.in().setSpeed(0.5).addTo(rootDrawable).then(transition => transition.remove());

        this.loop.start(dt => {
            this.canvas.draw();
        });
    }

    playLevel(levelNumber) {
        if (this.level) {
            this.level.stop();
        }

        TextPopup.closeAll();
        state.events.offAll();

        if (levelNumber >= 4) {
            this.showOutro();
            return;
        }

        setTimeout(() => {
            this.level = new Level(levelNumber);
            state.level = this.level;

            setTimeout(() => this.level.start(), 10);
        }, 10);
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
        const seed = 822505;

        this.prngs.pcg = new NumberSequence(seed);

        state.pcg = this.prngs.pcg;
    }
}

const game = new Game();

export default game;
