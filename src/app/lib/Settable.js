export default function Settable(baseClass) {
    if (! baseClass) {
        baseClass = class {};
    }

    class Settable extends baseClass {
        set(properties) {
            return Object.assign(this, properties);
        }
    };

    return Settable;
}
