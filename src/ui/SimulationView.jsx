import { useEffect, useRef } from "react";
import World from "../simulation/World";
import CanvasRenderer from "../rendering/CanvasRenderer";

export default function SimulationView() {

    const ref = useRef(null);

    useEffect(() => {

        const world = new World();
        world.initialize();

        const renderer = new CanvasRenderer(ref.current, world);

        const loop = () => {
            world.update();
            renderer.draw();
            requestAnimationFrame(loop);
        };

        loop();

    }, []);

    return <canvas ref={ref} width={1000} height={700} />;
}