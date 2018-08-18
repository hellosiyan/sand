import Color from './Color';

const prngs = {};

export default class NumberSequence {
    constructor(seed) {
        this.m_w  = seed;
        this.m_z  = 987654321 - seed;
        this.mask = 0xffffffff;

        this.next();
    }

    next () {
        this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
        this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;

        let result = ((this.m_z << 16) + this.m_w) & this.mask;
        result /= 4294967296;

        return result + 0.5;
    }

    pick(candidates) {
        if (! Array.isArray(candidates)) {
            return this.pick(Object.keys(candidates));
        }

        let index = Math.floor(this.next() * candidates.length);
        return candidates[index];
    }

    bool () {
        return this.next() > 0.5;
    }

    color() {
        return Color.fromRGB(Math.floor(this.next() * 256), Math.floor(this.next() * 256), Math.floor(this.next() * 256));
    }

    static set(key, seed) {
        if (prngs.hasOwnProperty(key)) {
            delete prngs[key];
        }

        prngs[key] = new NumberSequence(seed);
    }

    static get(key) {
        return prngs[key];
    }
}
