export default class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distanceTo(other) {
        return Math.hypot(this.x - other.x, this.y - other.y);
    }
}
