import Drawable from '../lib/Drawable';
import Pixmap from '../Pixmap';
import { config } from '../config';

const literals = {
    '0': `
000000000
000000000
000000000
000222000
000212000
000222000
000000000
000000000
000000000`,
    't': `
022222220
021111120
022212220
021111120
022212220
000212000
000212000
000212000
000222000`,
    'l': `
002220000
002120000
222122000
211112200
222121220
002122122
002122212
002120212
002220222`,
    'i': `
000002220
000222120
000211120
022222120
021221220
021212220
021122120
021222120
022202220`,
    'y': `
000022220
000221120
002212120
002122120
002221120
002212120
022122120
021222120
022202220`,
    'a': `
000222000
002212200
222111222
211212112
221212122
022212220
002121200
002212200
000222000`,
    'p': `
022222200
021111220
022122120
021111220
022122200
002120000
002120000
002120000
002220000`,
    'n': `
000002220
000222120
000211120
022222120
021222220
021122220
021212120
021221120
022222220`
};

const pixmaps = {
    'normal': {
        '0': Pixmap.load(literals['0'], config.palettes.runes).toDrawable().cache(),
        't': Pixmap.load(literals['t'], config.palettes.runes).toDrawable().cache(),
        'l': Pixmap.load(literals['l'], config.palettes.runes).toDrawable().cache(),
        'i': Pixmap.load(literals['i'], config.palettes.runes).toDrawable().cache(),
        'y': Pixmap.load(literals['y'], config.palettes.runes).toDrawable().cache(),
        'a': Pixmap.load(literals['a'], config.palettes.runes).toDrawable().cache(),
        'p': Pixmap.load(literals['p'], config.palettes.runes).toDrawable().cache(),
        'n': Pixmap.load(literals['n'], config.palettes.runes).toDrawable().cache(),
    },
    'glowing': {
        '0': Pixmap.load(literals['0'], config.palettes.glowingRunes).toDrawable().cache(),
        't': Pixmap.load(literals['t'], config.palettes.glowingRunes).toDrawable().cache(),
        'l': Pixmap.load(literals['l'], config.palettes.glowingRunes).toDrawable().cache(),
        'i': Pixmap.load(literals['i'], config.palettes.glowingRunes).toDrawable().cache(),
        'y': Pixmap.load(literals['y'], config.palettes.glowingRunes).toDrawable().cache(),
        'a': Pixmap.load(literals['a'], config.palettes.glowingRunes).toDrawable().cache(),
        'p': Pixmap.load(literals['p'], config.palettes.glowingRunes).toDrawable().cache(),
        'n': Pixmap.load(literals['n'], config.palettes.glowingRunes).toDrawable().cache(),
    },
    'correct': {
        '0': Pixmap.load(literals['0'], config.palettes.glowingRunesCorrect).toDrawable().cache(),
        't': Pixmap.load(literals['t'], config.palettes.glowingRunesCorrect).toDrawable().cache(),
        'l': Pixmap.load(literals['l'], config.palettes.glowingRunesCorrect).toDrawable().cache(),
        'i': Pixmap.load(literals['i'], config.palettes.glowingRunesCorrect).toDrawable().cache(),
        'y': Pixmap.load(literals['y'], config.palettes.glowingRunesCorrect).toDrawable().cache(),
        'a': Pixmap.load(literals['a'], config.palettes.glowingRunesCorrect).toDrawable().cache(),
        'p': Pixmap.load(literals['p'], config.palettes.glowingRunesCorrect).toDrawable().cache(),
        'n': Pixmap.load(literals['n'], config.palettes.glowingRunesCorrect).toDrawable().cache(),
    },
    'incorrect': {
        '0': Pixmap.load(literals['0'], config.palettes.glowingRunesIncorrect).toDrawable().cache(),
        't': Pixmap.load(literals['t'], config.palettes.glowingRunesIncorrect).toDrawable().cache(),
        'l': Pixmap.load(literals['l'], config.palettes.glowingRunesIncorrect).toDrawable().cache(),
        'i': Pixmap.load(literals['i'], config.palettes.glowingRunesIncorrect).toDrawable().cache(),
        'y': Pixmap.load(literals['y'], config.palettes.glowingRunesIncorrect).toDrawable().cache(),
        'a': Pixmap.load(literals['a'], config.palettes.glowingRunesIncorrect).toDrawable().cache(),
        'p': Pixmap.load(literals['p'], config.palettes.glowingRunesIncorrect).toDrawable().cache(),
        'n': Pixmap.load(literals['n'], config.palettes.glowingRunesIncorrect).toDrawable().cache(),
    }
}

export default class Rune extends Drawable {
    constructor() {
        super();

        this.letter = '0';
        this.format = 'normal';
        this.width = pixmaps[this.format][this.letter].width;
        this.height = pixmaps[this.format][this.letter].height;
    }

    draw(ctx) {
        const drawable = pixmaps[this.format][this.letter];
        drawable.x = this.x;
        drawable.y = this.y;

        ctx.globalAlpha = this.style.opacity;

        drawable.draw(ctx);
    }
}
