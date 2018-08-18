import Settable from './Settable';

export default class Color extends Settable() {

    constructor() {
        super();

        this.h = 0;
        this.s = 0;
        this.l = 0;
        this.a = 1;
    }

    toString() {
        return 'hsla(' + this.h + ',' + this.s + '%,' + this.l + '%,' + this.a + ')';
    }

    toRGB() {
        let rgb = this.getRGB();
        return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
    }

    lighten(percent) {
        this.l = Math.min(100, this.l + this.l * percent);
        return this;
    }

    darken(percent) {
        this.l = Math.max(0, this.l - this.l * percent);
        return this;
    }

    setHue(value) {
        this.h = Math.min(255, Math.max(0, value));
        return this;
    }

    shiftHue(value) {
        this.h += value;
        if (this.h < 0) {
            this.h += 360;
        } else if (this.h > 360) {
            this.h -= 360;
        }

        return this;
    }

    setSaturation(value) {
        this.s = Math.min(100, Math.max(0, value));
        return this;
    }

    setLightness(value) {
        this.l = Math.min(100, Math.max(0, value));
        return this;
    }

    setAlpha(value) {
        this.a = Math.min(1, Math.max(0, value));
        return this;
    }

    copy() {
        return new Color().set({
            h: this.h,
            s: this.s,
            l: this.l,
            a: this.a,
        });
    }

    setRGB(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        this.h = parseInt((h * 360).toFixed(0), 10);
        this.s = parseInt((s * 100).toFixed(6), 10);
        this.l = parseInt((l * 100).toFixed(6), 10);

        return this;
    }

    getRGB() {
        let r = 0, g = 0, b = 0;
        let h = this.h / 360;
        let l = this.l / 100;
        let s = this.s / 100;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [r * 255, g * 255, b * 255];
    }

    static fromHSLA(h, s, l, a) {
        return new Color().set({ h, s, l, a });
    }

    static fromRGB(r, g, b) {
        return new Color().setRGB(r, g, b);
    }

    static fromHex(hex) {
        let regexp = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
        let bits = hex.match(regexp);

        let r = parseInt(bits[1], 16);
        let g = parseInt(bits[2], 16);
        let b = parseInt(bits[3], 16);

        return Color.fromRGB(r, g, b);
    }
}
