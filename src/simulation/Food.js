import Entity from "./Entity";

export default class Food extends Entity {
    constructor(x, y) {
        super(x, y);
        this.energy = 40;
        this.radius = 3;
        this.color = "#22c55e";
    }
}