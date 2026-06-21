import Food from "./Food";
import Herbivore from "./Herbivore";
import Carnivore from "./Carnivore";

export default class World {

    constructor(width = 1000, height = 700) {
        this.width = width;
        this.height = height;

        this.organisms = [];
        this.foods = [];

        this.tick = 0;
        this.time = 0;
    }

    initialize() {

        for (let i = 0; i < 90; i++) {
            this.foods.push(new Food(
                Math.random() * this.width,
                Math.random() * this.height
            ));
        }

        for (let i = 0; i < 25; i++) {
            this.organisms.push(new Herbivore(
                Math.random() * this.width,
                Math.random() * this.height
            ));
        }

        for (let i = 0; i < 6; i++) {
            this.organisms.push(new Carnivore(
                Math.random() * this.width,
                Math.random() * this.height
            ));
        }
    }

    addOrganism(o) {
        this.organisms.push(o);
    }

    removeFood(food) {
        this.foods = this.foods.filter(f => f !== food);
    }

    spawnFood() {
        const amount = this.foods.length < 120 ? 2 : 1;

        for (let i = 0; i < amount; i++) {
            this.foods.push(new Food(
                Math.random() * this.width,
                Math.random() * this.height
            ));
        }
    }

    update() {

        this.tick++;
        this.time++;

        this.spawnFood();

        for (const o of this.organisms) {
            o.update(this);
        }

        this.organisms = this.organisms.filter(o => o.alive);
    }

    getStats() {
        return {
            herbivores: this.organisms.filter(o => o instanceof Herbivore).length,
            carnivores: this.organisms.filter(o => o instanceof Carnivore).length,
            foods: this.foods.length,
            total: this.organisms.length,
            time: this.time
        };
    }
}