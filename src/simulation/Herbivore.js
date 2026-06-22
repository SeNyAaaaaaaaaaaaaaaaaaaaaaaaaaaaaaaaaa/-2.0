import Organism from "./Organism";
import Genome from "./Genome";

export default class Herbivore extends Organism {

    constructor(x, y, genome = new Genome()) {
        super(x, y, genome);

        this.color = "#3b82f6";
        this.baseRadius = 5;
        this.radius = this.baseRadius + genome.speed * 0.3;
        this.stamina = 1;
    }

    update(world) {

        if (!this.alive) return;

        this.updateBase();

        const predator = this.findClosest(
            world.organisms.filter(o =>
                o instanceof Organism &&
                o !== this &&
                o.alive &&
                o.constructor.name === "Carnivore"
            )
        );

        const food = this.findClosest(world.foods);

        this.target = food || predator;

        if (predator && this.distanceTo(predator) < predator.genome.vision * 0.55) {
            this.stamina = Math.max(0, this.stamina - 0.04);
            this.staminaTimer = 18;
            this.seek({
                x: this.x - (predator.x - this.x),
                y: this.y - (predator.y - this.y)
            });
        } else {
            this.stamina = Math.min(1, this.stamina + 0.01);
            this.staminaTimer = Math.max(0, this.staminaTimer - 1);

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
        }

        this.move(world);

        if (this.canReproduce()) {
            const mate = this.findClosest(
                world.organisms.filter(o =>
                    o instanceof Herbivore && o !== this && o.alive && this.distanceTo(o) < 18
                )
            );

            if (mate && Math.abs(this.radius - mate.radius) < 2.5) {
                this.energy *= 0.68;
                mate.energy *= 0.68;
                this.reproductionCooldown = this.getReproductionDelay() * 1.8;

                const childGenome = this.genome.combineWith(mate.genome);
                const child = new Herbivore(
                    this.x,
                    this.y,
                    childGenome
                );

                child.generation = Math.max(this.generation, mate.generation) + 1;
                world.addOrganism(child);
            }
        }
    }
}