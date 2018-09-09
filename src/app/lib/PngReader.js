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

    readAsDrawable(url, trim = false) {
        return new Promise(resolve => {
            this.read(url)
                .then(pixdef => {
                    if (trim) {
                        this.trimPixdef(pixdef);
                    }

                    return pixdef;
                })
                .then(pixdef => this.createPixmap(pixdef))
                .then(drawable => resolve(drawable));
        });
    }

    readAsLiteral(url, trim = false) {
        return new Promise(resolve => {
            this.read(url)
                .then(pixdef => {
                    if (trim) {
                        this.trimPixdef(pixdef);
                    }

                    return pixdef;
                })
                .then(pixdef => this.createLiteral(pixdef))
                .then(literal => resolve(literal));
        });
    }

    trimPixdef(pixdef) {
        let transparentCode = false;

        for (let code in pixdef.palette) {
            if (pixdef.palette[code] == 'rgba(0,0,0,0)') {
                transparentCode = code;
                break;
            }
        }

        let data = [[]];
        let row = 0;
        for (let char of pixdef.literal) {
            if(char == '\n') continue;

            if (data[row].length >= pixdef.width) {
                row ++;
                data[row] = [];
            }

            data[row].push(char);
        }

        if (data.length != pixdef.height || data[0].length != pixdef.width) {
            console.warning('TrimPixbuf Error: literal read incorrectly');
        }

        let emptyArea = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }
        // Trim top
        for (var ic = 0; ic < data.length; ic++) {
            let isEmpty = true;

            for (var ir = 0; ir < data[ic].length; ir++) {
                if (data[ic][ir] !== transparentCode) {
                    isEmpty = false;
                    break;
                }
            }

            if (isEmpty) {
                emptyArea.top ++;
            } else {
                break;
            }
        }

        // Trim bottom
        for (var ic = data.length - 1; ic >= 0; ic--) {
            let isEmpty = true;

            for (var ir = 0; ir < data[ic].length; ir++) {
                if (data[ic][ir] !== transparentCode) {
                    isEmpty = false;
                    break;
                }
            }

            if (isEmpty) {
                emptyArea.bottom ++;
            } else {
                break;
            }
        }

        // Trim left
        for (var ir = 0; ir < pixdef.width; ir++) {
            let isEmpty = true;

            for (var ic = 0; ic < pixdef.height; ic++) {
                if (data[ic][ir] !== transparentCode) {
                    isEmpty = false;
                    break;
                }
            }

            if (isEmpty) {
                emptyArea.left ++;
            } else {
                break;
            }
        }

        // Trim right
        for (var ir = pixdef.width - 1; ir >= 0; ir--) {
            let isEmpty = true;

            for (var ic = pixdef.height - 1; ic >= 0; ic--) {
                if (data[ic][ir] !== transparentCode) {
                    isEmpty = false;
                    break;
                }
            }

            if (isEmpty) {
                emptyArea.right ++;
            } else {
                break;
            }
        }

        // New literal

        let newLiteral = '';

        for (var ic = 0; ic < data.length; ic++) {
            if (ic < emptyArea.top || ic >= pixdef.height - emptyArea.bottom) {
                continue;
            }

            for (var ir = 0; ir < data[ic].length; ir++) {
                if (ir < emptyArea.left || ir >= pixdef.width - emptyArea.right) {
                    continue;
                }

                newLiteral += data[ic][ir];
            }

            newLiteral += '\n';
        }

        pixdef.literal = newLiteral;
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
            width: canvas.width,
            height: canvas.height
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
