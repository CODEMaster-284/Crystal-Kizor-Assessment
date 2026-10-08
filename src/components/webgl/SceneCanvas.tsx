import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { ArchitecturalScene } from "./ArchitecturalScene";
export default function SceneCanvas() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let intersecting = true;
    const update = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver((entries) => {
      intersecting = entries[0].isIntersecting;
      update();
    });
    const hero = document.getElementById("home");
    if (hero) observer.observe(hero);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div className={`scene-canvas ${ready ? "scene-ready" : ""}`}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 9], fov: 48 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <ArchitecturalScene onFirstFrame={() => setReady(true)} />
      </Canvas>
    </div>
  );
}
