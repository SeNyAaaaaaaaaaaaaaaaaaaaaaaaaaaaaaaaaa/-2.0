export default class CanvasRenderer {
    constructor(canvas, world) {
        this.ctx = canvas.getContext("2d");
        this.world = world;
        this.frame = 0;
    }

    draw() {
        this.frame++;
        const ctx = this.ctx;
        const w = this.world.width;
        const h = this.world.height;

        // Очистка
        ctx.clearRect(0, 0, w, h);

        // Фон с сеткой
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, w, h);
        this.drawGrid(w, h);

        this.drawFood();
        this.drawParticles();
        this.drawOrganisms();
        this.drawStats();
    }

    drawGrid(w, h) {
        const ctx = this.ctx;
        ctx.strokeStyle = "rgba(255,255,255,0.03)";
        ctx.lineWidth = 1;
        const step = 50;
        for (let x = 0; x < w; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }

    drawFood() {
        const ctx = this.ctx;
        const pulse = 1 + Math.sin(this.frame * 0.1) * 0.15;
        for (const f of this.world.foods) {
            ctx.fillStyle = f.color;
            ctx.shadowColor = "#22c55e";
            ctx.shadowBlur = 8 * pulse;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.radius * pulse, 0, Math.PI * 2);
            ctx.fill();
            // маленький блик
            ctx.shadowBlur = 0;
            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.beginPath();
            ctx.arc(f.x - 1, f.y - 1, f.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    }

    drawParticles() {
        const ctx = this.ctx;
        for (const p of this.world.particles) {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5 * p.life, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }

    drawOrganisms() {
        const ctx = this.ctx;
        for (const o of this.world.organisms) {
            const radius = o.radius;
            // Внешнее свечение
            ctx.shadowColor = o.color;
            ctx.shadowBlur = 12;
            ctx.fillStyle = o.color;
            ctx.beginPath();
            ctx.arc(o.x, o.y, radius, 0, Math.PI * 2);
            ctx.fill();

            // Внутренняя тень (более светлый центр)
            ctx.shadowBlur = 0;
            const gradient = ctx.createRadialGradient(o.x - 2, o.y - 2, radius * 0.2, o.x, o.y, radius);
            gradient.addColorStop(0, "rgba(255,255,255,0.5)");
            gradient.addColorStop(1, "rgba(0,0,0,0.2)");
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(o.x, o.y, radius, 0, Math.PI * 2);
            ctx.fill();

            // Глаз
            ctx.fillStyle = "white";
            const eyeX = o.x + Math.cos(o.direction) * radius * 0.65;
            const eyeY = o.y + Math.sin(o.direction) * radius * 0.65;
            ctx.beginPath();
            ctx.arc(eyeX, eyeY, radius * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#111";
            ctx.beginPath();
            ctx.arc(
                eyeX + Math.cos(o.direction) * radius * 0.15,
                eyeY + Math.sin(o.direction) * radius * 0.15,
                radius * 0.16,
                0, Math.PI * 2
            );
            ctx.fill();

            // Полоски над головой
            const barY = o.y - radius - 6;
            ctx.fillStyle = "#4ade80";
            ctx.fillRect(o.x - 8, barY, 16 * (o.energy / o.maxEnergy), 2);
            ctx.fillStyle = "#facc15";
            ctx.fillRect(o.x - 8, barY + 3, 16 * (o.age / o.maxAge), 2);

            // Зона зрения
            ctx.strokeStyle = "rgba(255,255,255,0.04)";
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.genome.vision, 0, Math.PI * 2);
            ctx.stroke();

            // Линия к цели
            if (o.target) {
                ctx.strokeStyle = "rgba(255,255,255,0.15)";
                ctx.beginPath();
                ctx.moveTo(o.x, o.y);
                ctx.lineTo(o.target.x, o.target.y);
                ctx.stroke();
            }
        }
    }

    drawStats() {
        const s = this.world.getStats();
        const ctx = this.ctx;
        const x = 14, y = 24; // оставлено место для заголовка, который теперь справа
        const panelW = 195, panelH = 130;
        // Стеклянная панель
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x - 8, y - 18, panelW, panelH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "12px 'Segoe UI', system-ui, sans-serif";
        ctx.fillText(`🐑 Травоядные: ${s.herbivores}`, x, y);
        ctx.fillText(`🐯 Хищники: ${s.carnivores}`, x, y + 20);
        ctx.fillText(`🌿 Еда: ${s.foods}`, x, y + 40);
        ctx.fillText(`Всего: ${s.total}`, x, y + 60);
        ctx.fillText(`Время: ${s.time}`, x, y + 80);
        ctx.fillText(`Скорость: ${this.world.speed}x`, x, y + 100);
        if (this.world.paused) {
            ctx.fillStyle = "#f59e0b";
            ctx.fillText("⏸ ПАУЗА", x, y + 120);
        }
    }
}

// Полифилл roundRect для Canvas, если нет
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
        this.beginPath();
        this.moveTo(x + r.tl, y);
        this.lineTo(x + w - r.tr, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
        this.lineTo(x + w, y + h - r.br);
        this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
        this.lineTo(x + r.bl, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
        this.lineTo(x, y + r.tl);
        this.quadraticCurveTo(x, y, x + r.tl, y);
        this.closePath();
    };
}