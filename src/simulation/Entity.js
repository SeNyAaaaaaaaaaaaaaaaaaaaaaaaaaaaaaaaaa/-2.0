export default class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
    }

    distanceTo(e) {
        const dx = this.x - e.x;
        const dy = this.y - e.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}