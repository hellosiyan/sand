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
    'a': `
022222220
021111120
022212220
021111120
022212220
000212000
000212000
000212000
000222000`,
    'b': `
002220000
002120000
222122000
211112200
222121220
002122122
002122212
002120212
002220222`,
    'c': `
000002220
000222120
000211120
022222120
021221220
021212220
021122120
021222120
022202220`
};

const pixmaps = {
    'normal': {
        '0': Pixmap.load(literals['0'], config.palettes.runes).toDrawable().cache(),
        'a': Pixmap.load(literals['a'], config.palettes.runes).toDrawable().cache(),
        'b': Pixmap.load(literals['b'], config.palettes.runes).toDrawable().cache(),
        'c': Pixmap.load(literals['c'], config.palettes.runes).toDrawable().cache(),
    },
    'outlined': {
        '0': Pixmap.load(literals['0'], config.palettes.outlinedRunes).toDrawable().cache(),
        'a': Pixmap.load(literals['a'], config.palettes.outlinedRunes).toDrawable().cache(),
        'b': Pixmap.load(literals['b'], config.palettes.outlinedRunes).toDrawable().cache(),
        'c': Pixmap.load(literals['c'], config.palettes.outlinedRunes).toDrawable().cache(),
    },
    'glowing': {
        '0': Pixmap.load(literals['0'], config.palettes.glowingRunes).toDrawable().cache(),
        'a': Pixmap.load(literals['a'], config.palettes.glowingRunes).toDrawable().cache(),
        'b': Pixmap.load(literals['b'], config.palettes.glowingRunes).toDrawable().cache(),
        'c': Pixmap.load(literals['c'], config.palettes.glowingRunes).toDrawable().cache(),
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
