import Settable from './lib/Settable';
import Listenable from './lib/Listenable';
import Container from './lib/Container';
import AutoScrollView from './lib/AutoScrollView';
import Rectangle from './lib/Rectangle';
import TextPopup from './TextPopup';
import Player from './Player';
import Desert from './Desert';
import Storm from './Storm';
import Timer from './Timer';
import Transition from './Transition';
import { inGridTiles, inPixels, fromPixels } from './utils';
import state from './State';

const stonePlacements = {
    't': {
        x: 9,
        y: 28
    },
    'l': {
        x: 26,
        y: 24
    },
    'i': {
        x: 16,
        y: 29
    },
    'y': {
        x: 4,
        y: 2
    },
    'a': {
        x: 25,
        y: 6
    },
    'p': {
        x: 2,
        y: 20
    },
    'n': {
        x: 11,
        y: 8
    }
};

const levelPreset = {
    '1': {
        targetLetters: 'til',
        timeout: 60,
        stormMinLevel: 0,
        stormMaxLevel: 0.3,
        stones: stonePlacements
    },
    '2': {
        targetLetters: 'napy',
        timeout: 60,
        stormMinLevel: 0.3,
        stormMaxLevel: 0.6,
        stones: stonePlacements
    },
    '3': {
        targetLetters: 'linyt',
        timeout: 60,
        stormMinLevel: 0.6,
        stormMaxLevel: 0.9,
        stones: stonePlacements
    }
}

export default class Level extends Listenable(Settable()) {
    constructor(levelNumber) {
        super();

        this.level = levelNumber;

        this.desert = new Desert();
        this.player = new Player();
        state.timer = this.timer = new Timer();
        state.storm = this.storm = new Storm();

        this.rootDrawable = new Container();
        this.view = new AutoScrollView();
        this.floatDrawable = new Container();
        this.fixedDrawable = new Container();

        this.stormMinLevel = 0;
        this.stormMaxLevel = 1;

        this.connectedLoop = false;
    }

    loadLevelState() {
        const preset = levelPreset[this.level];

        this.stormMinLevel = preset.stormMinLevel;
        this.stormMaxLevel = preset.stormMaxLevel;

        this.storm.setLevel(this.stormMinLevel)

        this.timer.setTimeLimit(preset.timeout);

        this.desert.placeStones(preset.stones);

        state.movementDisabled = true;
        state.headingHome = false;
        state.activatedLetters = '';
        state.isStoneActivating = false;
        state.targetLetters = preset.targetLetters;
    }

    start() {
        this.prepareScene();

        this.loadLevelState();

        this.connectedLoop = state.loop;

        state.canvas.setScene(this.rootDrawable);
        this.connectedLoop.start(dt => this.loopHandler(dt));

        Transition.in().addTo(this.fixedDrawable).then(transition => transition.remove());

        this.bindEvents();

        const msg = {
            '1': ['the signal is down. We need it back asap.', 'Be quick. a storm is coming your way.'],
            '2': ['The storm is interfering with our signal!', 'the storm is getting worse. so be quick.'],
            '3': ['The signal is failing.', 'Be careful.'],
        }[this.level];

        TextPopup.display(msg[0])
            .on('hide', popup => {
                popup.off('hide');
                popup
                    .setText('activate these ' + state.targetLetters.length + ' stones in the right order:')
                    .setRunes(state.targetLetters.split(''))
                    .show()
                    .on('hide', popup => {
                        popup.off('hide');
                        popup
                            .setText(msg[1])
                            .setRunes(false)
                            .show()
                            .on('hide.instant', popup => {
                                popup.off('hide');
                                state.movementDisabled = false;
                                this.timer.start();
                                if (this.level == '1') {
                                    TextPopup.display('(Move with arrow keys or wasd)', true);
                                }
                            });
                    });
            });

        return this;
    }

    stop() {
        this.stopped = true;
        this.connectedLoop.stop();

        this.emit('stop');
    }

    bindEvents() {
        state.events.on('fusebox.deactivateAll', () => {
            this.desert.fuseboxes.forEach(fusebox => fusebox.dectivate())
        });

        state.events.on('fusebox.activated', e => {
            const targetLetter = state.targetLetters[state.activatedLetters.length];

            if (typeof targetLetter == 'undefined') {
                return;
            }

            state.isStoneActivating = true;
            let popup = TextPopup.display('Activating...');

            setTimeout(() => {
                popup.hide();
                setTimeout(() => {
                    state.isStoneActivating = false;

                    if (e.letter != targetLetter) {
                        TextPopup.display('This does not seem right.', true);
                        e.fusebox.setStatus('incorrect');
                        return;
                    }

                    state.activatedLetters += e.letter;
                    e.fusebox.setStatus('correct');

                    if (state.activatedLetters.length === state.targetLetters.length) {
                        state.headingHome = true;
                        TextPopup.display('signal is back online. head back to safety.', true);
                    } else {
                        TextPopup.display('Stone activated.', true);
                    }
                }, 1)
            }, 2000);
        })

        state.events.on('timer.timeout', () => {
            state.movementDisabled = true;
            state.timer.isVisible = false;

            state.events.on('storm.target.reached', () => {
                state.events.off('storm.target.reached');

                TextPopup.closeAll();
                TextPopup.display('The sand came so quickly ...')
                    .on('hide', popup => {
                        popup.off('hide');

                        Transition.out().addTo(this.fixedDrawable).then(transition => {
                            this.stop();
                            setTimeout(() => state.game.playLevel(this.level), 10);
                        });
                    });
            });

            state.storm.levelUpTo(1);
        });
    }

    loopHandler(dt) {
        if (this.stopped) {
            return;
        }

        if (this.timer.isRunning) {
            this.timer.tick(dt);
            this.storm.setLevel(this.stormMinLevel + this.timer.passedTimeCoeff() * (this.stormMaxLevel - this.stormMinLevel))
        }

        this.player.move(dt);

        this.detectCollisions();
        this.detectActivatedPressurePlates();
        this.detectBackHome();

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

        this.storm.set({
                width: state.canvas.width,
                height: state.canvas.height,
            })
            .init()
            .addTo(this.fixedDrawable);

        this.timer.set({
            x: Math.round(state.canvas.width - this.timer.width - inPixels(7)),
            y: state.canvas.height - this.timer.height - inPixels(7),
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

            if (obstacle.isWall && ! state.hasShownOutOfBoundsMessage) {
                state.hasShownOutOfBoundsMessage = true;
                TextPopup.display('Do not go too far.', true);
            }

            let cri = this.player.collisionResponseImpulse(obstacle);

            this.player.x += cri.x;
            this.player.y += cri.y;
        });
    }

    detectActivatedPressurePlates() {
        if (state.headingHome || state.isStoneActivating) {
            return;
        }

        const activationDistance = inPixels(25);
        state.fuseboxPlates.forEach((fuseboxPlate, index) => {
            if (this.player.distanceTo(fuseboxPlate) < activationDistance) {
                state.fuseboxes[index].activate();
            } else if (state.fuseboxes[index].status === 'incorrect') {
                state.fuseboxes[index].deactivate();
            }
        });
    }

    detectBackHome() {
        if (! state.headingHome) {
            return;
        }

        const activationDistance = inPixels(25);

        if (this.player.distanceTo(state.hut) < activationDistance) {
            state.headingHome = false;
            state.movementDisabled = true;
            state.timer.stop();

            state.storm.levelUpTo(1);

            TextPopup.closeAll();
            TextPopup.display('Good job! await further instructions.')
                .on('hide', popup => {
                    popup.off('hide');

                    Transition.out().addTo(this.fixedDrawable).then(transition => {
                        this.stop();
                        setTimeout(() => state.game.playLevel(this.level + 1), 10);
                    });
                });
        }
    }
}
