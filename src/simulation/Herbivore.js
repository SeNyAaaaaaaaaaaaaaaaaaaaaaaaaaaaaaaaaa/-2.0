import Organism from "./Organism";
import Genome from "./Genome";

export default class Herbivore extends Organism {

    constructor(x, y, genome = new Genome()) {
        super(x, y, genome);

        this.color = "#3b82f6";
        this.radius = 5 + genome.speed * 0.3;
    }

    update(world) {

        if (!this.alive) return;

        this.updateBase();

        const food = this.findClosest(world.foods);

        this.target = food;

        if (food) {

            this.seek(food);

            if (this.distanceTo(food) < 6) {

                this.energy = Math.min(
                    this.maxEnergy,
                    this.energy + food.energy
                );

                world.removeFood(food);
            }

        } else {
            this.direction += (Math.random() - 0.5) * 0.2;
        }

        this.move(world);

        if (this.energy > this.genome.fertility) {

            this.energy *= 0.5;

            const child = new Herbivore(
                this.x,
                this.y,
                this.genome.mutate()
            );

            child.generation = this.generation + 1;

            world.addOrganism(child);
        }
    }
}