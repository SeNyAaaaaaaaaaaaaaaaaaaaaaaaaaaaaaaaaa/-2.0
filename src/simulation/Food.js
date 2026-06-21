export default class Entity {
    static nextId = 1;

    constructor(x, y) {
        this.id = Entity.nextId++;
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