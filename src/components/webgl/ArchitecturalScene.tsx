import { useMemo, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  Line,
  MathUtils,
  BufferGeometry,
  Vector3,
} from "three";
import { scrollState } from "../../lib/motion";
export function ArchitecturalScene({
  onFirstFrame,
}: {
  onFirstFrame: () => void;
}) {
  const first = useRef(true);
  const objects = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const box = new BoxGeometry(3.7, 5, 0.03);
        const edges = new EdgesGeometry(box);
        box.dispose();
        const points: Vector3[] = [];
        points.push(new Vector3(-1.85, -2.5, 0), new Vector3(-1.85, 0.3, 0));
        for (let n = 0; n <= 40; n++) {
          const a = Math.PI - (n * Math.PI) / 40;
          points.push(
            new Vector3(Math.cos(a) * 1.85, 0.3 + Math.sin(a) * 1.85, 0),
          );
        }
        points.push(new Vector3(1.85, -2.5, 0));
        return {
          edges,
          arch: new BufferGeometry().setFromPoints(points),
          material: new LineBasicMaterial({
            color: i % 2 ? "#b66d50" : "#c8b999",
            transparent: true,
            opacity: 0.18 + i * 0.02,
          }),
        };
      }),
    [],
  );
  useEffect(
    () => () => {
      objects.forEach((o) => {
        o.edges.dispose();
        o.arch.dispose();
        o.material.dispose();
      });
    },
    [objects],
  );
  useFrame(({ camera, pointer }, delta) => {
    camera.position.x = MathUtils.damp(
      camera.position.x,
      pointer.x * 0.4,
      2,
      delta,
    );
    camera.position.y = MathUtils.damp(
      camera.position.y,
      pointer.y * 0.25,
      2,
      delta,
    );
    camera.position.z = MathUtils.damp(
      camera.position.z,
      9 - scrollState.progress * 2,
      2,
      delta,
    );
    camera.lookAt(1, 0, -7);
    if (first.current) {
      first.current = false;
      onFirstFrame();
    }
  });
  return (
    <group position={[2, 0, 0]}>
      <fog attach="fog" args={["#151714", 8, 24]} />
      {objects.map((o, i) => (
        <group key={i} position={[0, 0, -i * 2]}>
          <lineSegments geometry={o.edges} material={o.material} />
          <primitive object={new Line(o.arch, o.material)} />
        </group>
      ))}
      <mesh position={[2, 0, -5]} rotation={[0, 0, 0.35]}>
        <planeGeometry args={[0.7, 12]} />
        <meshBasicMaterial
          color="#c8b999"
          transparent
          opacity={0.03}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
