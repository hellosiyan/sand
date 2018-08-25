import Pixmap from './Pixmap';

export default class PngReader {
    read(url) {
        return new Promise(resolve => {
            this.load(url)
                .then(image => this.drawOnCanvas(image))
                .then(canvas => this.readCanvas(canvas))
                .then(pixmapDefinition => resolve(pixmapDefinition));
        });
    }

    readAsDrawable(url) {
        return new Promise(resolve => {
            this.read(url)
                .then(pixdef => this.createPixmap(pixdef))
                .then(drawable => resolve(drawable));
        });
    }

    readAsLiteral(url) {
        return new Promise(resolve => {
            this.read(url)
                .then(pixdef => this.createLiteral(pixdef))
                .then(drawable => resolve(drawable));
        });
    }

    createPixmap(pixmapDefinition) {
        return Pixmap.load(pixmapDefinition.literal, pixmapDefinition.palette).toDrawable();
    }

    createLiteral(pixmapDefinition) {
        let string = `Pixmap.load(\`\n${pixmapDefinition.literal}\`, {`;

        let paletteLines = [];
        for(let key in pixmapDefinition.palette) {
            paletteLines.push(`\t'${key}': '${pixmapDefinition.palette[key]}'`);
        }

        string += '\n' + paletteLines.join(',\n') + '\n}).toDrawable().cache()';

        return string;
    }

    load(url) {
        return new Promise(resolve => {
            let img = new Image();
            img.addEventListener('load', () => resolve(img), false);
            img.src = url;
        });
    }

    drawOnCanvas(image) {
        const canvas = document.createElement('canvas');
        const w = image.width;
        const h = image.height;

        canvas.width = w;
        canvas.height = h;

        canvas.getContext('2d').drawImage(
            image,
            0, 0,
            w, h,
            0, 0,
            w, h
        );

        return Promise.resolve(canvas);
    }

    readCanvas(canvas) {
        const colorLetters = '0123456789abcefghijklmnopqrstuvwxyz'.split('').reverse();
        const pixmapDefinition = {
            literal: '',
            palette: {},
        };

        const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        const n = pixels.length;

        let colors = {};
        for (let i = 0; i < n; i += 4) {
            if ((i / 4) % canvas.width == 0 && i != 0) {
                pixmapDefinition.literal += '\n';
            }

            const color = `rgba(${pixels[i]},${pixels[i+1]},${pixels[i+2]},${pixels[i+3]})`;

            if (typeof colors[color] == 'undefined') {
                const newColorLetter = colorLetters.pop();
                colors[color] = newColorLetter;
                pixmapDefinition.palette[newColorLetter] = color;
            }

            pixmapDefinition.literal += colors[color];
        }

        return pixmapDefinition;
    }
};
