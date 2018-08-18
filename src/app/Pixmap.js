import BasePixmap from './lib/Pixmap';
import { inPixels } from './utils';

export default class Pixmap extends BasePixmap {
    inPixels(value) {
        return inPixels(value);
    }
}
