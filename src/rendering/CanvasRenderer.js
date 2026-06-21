export default class CanvasRenderer {

    constructor(canvas, world) {
        this.ctx = canvas.getContext("2d");
        this.world = world;
    }

    draw() {

        const ctx = this.ctx;

        ctx.clearRect(0, 0, 1200, 800);

        this.drawFood();
        this.drawOrganisms();
        this.drawStats();
    }

    drawFood() {

        for (const f of this.world.foods) {
            this.ctx.fillStyle = f.color;
            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawOrganisms() {

        for (const o of this.world.organisms) {

            this.ctx.fillStyle = o.color;
            this.ctx.beginPath();
            this.ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // energy bar
            this.ctx.fillStyle = "#22c55e";
            this.ctx.fillRect(o.x - 10, o.y - 12, 20 * (o.energy / o.maxEnergy), 3);

            // age bar
            this.ctx.fillStyle = "#f59e0b";
            this.ctx.fillRect(o.x - 10, o.y - 8, 20 * (o.age / o.maxAge), 3);

            // vision
            this.ctx.strokeStyle = "rgba(255,255,255,0.05)";
            this.ctx.beginPath();
            this.ctx.arc(o.x, o.y, o.genome.vision, 0, Math.PI * 2);
            this.ctx.stroke();

            // target line
            if (o.target) {
                this.ctx.strokeStyle = "rgba(255,255,255,0.15)";
                this.ctx.beginPath();
                this.ctx.moveTo(o.x, o.y);
                this.ctx.lineTo(o.target.x, o.target.y);
                this.ctx.stroke();
            }
        }
    }

    drawStats() {

        const s = this.world.getStats();

        this.ctx.fillStyle = "white";
        this.ctx.font = "14px Arial";

        this.ctx.fillText(`Herbivores: ${s.herbivores}`, 10, 20);
        this.ctx.fillText(`Carnivores: ${s.carnivores}`, 10, 40);
        this.ctx.fillText(`Food: ${s.foods}`, 10, 60);
        this.ctx.fillText(`Total: ${s.total}`, 10, 80);
    }
}