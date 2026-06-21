import Organism from "./Organism";
import Genome from "./Genome";
import Herbivore from "./Herbivore";

export default class Carnivore extends Organism {

    constructor(x, y, genome = new Genome({
        speed: 3,
        vision: 120,
        fertility: 200,
        efficiency: 1.2
    })) {
        super(x, y, genome);

        this.color = "#ef4444";
        this.radius = 6 + genome.speed * 0.3;
    }

    update(world) {

        if (!this.alive) return;

        this.updateBase();

        const prey = this.findClosest(
            world.organisms.filter(o => o instanceof Herbivore && o.alive)
        );

        this.target = prey;

        if (prey) {

            this.seek(prey);

            if (this.distanceTo(prey) < 8) {

                prey.kill();

                this.energy = Math.min(
                    this.maxEnergy,
                    this.energy + 80
                );
            }
        } else {
            this.direction += (Math.random() - 0.5) * 0.25;
        }

        this.move(world);

        if (this.energy > this.genome.fertility) {

            this.energy *= 0.5;

            const child = new Carnivore(
                this.x,
                this.y,
                this.genome.mutate()
            );

            child.generation = this.generation + 1;

            world.addOrganism(child);
        }
    }
}