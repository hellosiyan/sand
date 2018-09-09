import Drawable from './lib/Drawable';
import { inPixels } from './utils';

const charData = {
'a': 9938118,     'b': 7642407,     'c': 6587686,     'd': 7644455,
'e': 7375911,     'f': 1084455,     'g': 14988334,    'h': 9747753,
'i': 1082401,     'j': 2265223,     'k': 5409957,     'l': 7373857,
'm': 18405233,    'n': 9745769,     'o': 6595878,     'p': 1088807,
'q': 12789030,    'r': 9739559,     's': 7608366,     't': 2164807,
'u': 6595881,     'v': 2270505,     'w': 10835633,    'x': 5408933,
'y': 2164901,     'z': 15763599,    '0': 2266274,     '1': 2164834,
'2': 7380099,     '3': 7478407,     '4': 4332705,     '5': 3284007,
'6': 7511079,     '7': 2164871,     '8': 7511207,     '9': 7478439,
'!': 1049633,     '?': 2099331,     '.': 1048576,     '+': 72768,
'-': 7168,        '/': 1083524,     '*': 5189,        '%': 26808627,
'$': 7674030,     ':': 32800,       '#': 11512810,    '(': 2130978,
')': 1116225,     ' ': 0,           '<': 4260932,     '>': 1118273,
'[': 3179555,     ']': 3213379,     '@': 31123020,    '\'': 1
};

export default class Text extends Drawable {
    constructor() {
        super();

        this.fontSize = Math.round(inPixels(0.66));

        this.text = 'a';
        this.style.color = '#000';
    }

    setFontSize(fontSize) {
        this.fontSize = Math.max(1, fontSize);
        this.width = this.getTextWidth();
        this.height = this.fontSize * 5;

        return this;
    }

    setText(text) {
        this.text = text;
        this.width = this.getTextWidth();
        this.height = this.fontSize * 5;

        return this;
    }

    draw(ctx) {
        ctx.fillStyle = this.style.color;
        ctx.globalAlpha = this.style.opacity;

        const bw = this.fontSize;
        const bh = this.fontSize;
        let cursor = Math.ceil(this.x);

        for(let k=0; k<this.text.length; k++) {
            const data = charData[this.text.charAt(k).toLowerCase()];
            if( data == undefined ) continue;

            for(let i=0; i<5; i++) {
                for(let j=0; j<5; j++) {
                    if( data&(1<<(5*i+j)) ) {
                        ctx.fillRect(cursor + j*bw, this.y + i*bh, bw, bh);
                    }
                }
            }
            cursor += bw*6;

            let mask = 17318416;
            while(((~data)&mask) == mask && (mask > 1082401)) {
                cursor -= bw;
                mask = mask >>> 1;
            }
        }

        return this;
    }

    getTextWidth() {
        const bw = this.fontSize;
        let width = 0;

        for(let k=0; k<this.text.length; k++) {
            const data = charData[this.text.charAt(k).toLowerCase()];
            if( data == undefined ) continue;

            width += bw*6;

            let mask = 17318416;
            while(((~data)&mask) == mask && (mask > 1082401)) {
                width -= bw;
                mask = mask >>> 1;
            }
        }

        return width - this.fontSize;
    }
}
