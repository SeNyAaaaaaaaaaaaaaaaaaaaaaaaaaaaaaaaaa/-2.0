import { useEffect, useRef } from "react";

import World from "../simulation/World";
import CanvasRenderer from "../rendering/CanvasRenderer";

export default function SimulationView() {

    const canvasRef = useRef(null);

    useEffect(() => {

        const world = new World(1000, 700);
        world.initialize();

        const renderer = new CanvasRenderer(
            canvasRef.current,
            world
        );

        const loop = () => {

            world.update();
            renderer.draw();

            requestAnimationFrame(loop);
        };

        loop();

    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={1000}
            height={700}
            style={{ border: "1px solid #333" }}
        />
    );
}