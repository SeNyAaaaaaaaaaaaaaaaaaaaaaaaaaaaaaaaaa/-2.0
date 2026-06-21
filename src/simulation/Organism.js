import Entity from "./Entity";

export default class Organism extends Entity {

    constructor(x, y, genome) {
        super(x, y);

        this.genome = genome;

        this.energy = 100;
        this.maxEnergy = 250;

        this.age = 0;
        this.maxAge = 2500;

        this.alive = true;

        this.direction = Math.random() * Math.PI * 2;

        this.target = null;

        this.generation = 1;
    }

    kill() {
        this.alive = false;
    }

    updateBase() {

        this.age++;

        this.energy -= 0.02 * this.genome.efficiency;

        if (this.energy <= 0 || this.age > this.maxAge) {
            this.kill();
        }
    }

    move(world) {

        this.x += Math.cos(this.direction) * this.genome.speed;
        this.y += Math.sin(this.direction) * this.genome.speed;

        if (this.x < 0) this.direction = Math.PI - this.direction;
        if (this.x > world.width) this.direction = Math.PI - this.direction;

        if (this.y < 0) this.direction = -this.direction;
        if (this.y > world.height) this.direction = -this.direction;
    }

    seek(target) {
        this.direction = Math.atan2(
            target.y - this.y,
            target.x - this.x
        );
    }

    findClosest(list) {

        let best = null;
        let bestDist = Infinity;

        for (const item of list) {

            const d = this.distanceTo(item);

            if (d < this.genome.vision && d < bestDist) {
                best = item;
                bestDist = d;
            }
        }

        return best;
    }
}