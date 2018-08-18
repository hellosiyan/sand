import Pixmap from '../Pixmap';

const colorKeys = {
    default: {
        // '.': '#0f0',
        '.': 'rgba(0,0,0,0)',
        0: '#000',
        1: '#111',
        2: '#222',
        3: '#333',
        4: '#444',
        5: '#555',
        6: '#666',
        7: '#777',
        8: '#888',
        9: '#999',
        a: '#aaa',
        b: '#bbb',
        c: '#ccc',
        d: '#ddd',
        e: '#eee',
        f: '#fff',
    },
    package: {
        '.': 'rgba(0,0,0,0)',
        0: '#737373',
        1: '#808080',
        2: '#595959',
        3: '#ffffff',
        4: '#e6e6e6',
        5: '#999999',
        6: '#cccccc',
        7: '#b8b8b8',
        8: '#404040',
        9: '#333333',
        a: '#e65c45',
    },
    pouch: {
        '.': 'rgba(0,0,0,0)',
        0: '#535353',
        1: '#606060',
        2: '#4a4a4a',
        3: '#616161',
        4: '#808080',
        5: '#a5a5a5',
        '%': '#d6d6d6',
    },
};

const pixmaps = {
    can: Pixmap.load(`
..666..
.6ccc6.
6bcccb6
46bbb64
4866684
4888884
4888884
48c8884
.48884.
..444..`, colorKeys.default),
    bottle: Pixmap.load(`
..111..
..131..
..131..
.13321.
1333321
1373331
49a9994
4ff9f94
49a9994
1373331
1333221
.11111.`, colorKeys.default),
    package: Pixmap.load(`
.0110.
033340
155111
133330
139532
033342
256772
289992`, colorKeys.package),
    pouch: Pixmap.load(`
.....100.
..1115%0.
.1%%%5%1.
..1%4%0..
...232...
.114%411.
1%4%%5%%1
0%5%%%5%0
05%%%5550
.1000000.`, colorKeys.pouch),
};

export default class Item {
    static types() {
        return Object.entries(pixmaps).map(entry => ({
            name: entry[0],
            size: entry[1].getRenderSize(),
        }));
    }

    static create(type) {
        return pixmaps[type].toDrawable().set({type});
    }
}
