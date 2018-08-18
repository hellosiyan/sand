export default function Collidable(baseClass) {
    if (! baseClass) {
        baseClass = class {};
    }

    class Collidable extends baseClass {
        constructor() {
            super();

            this.collidable = true;
        }
    };

    return Collidable;
}
