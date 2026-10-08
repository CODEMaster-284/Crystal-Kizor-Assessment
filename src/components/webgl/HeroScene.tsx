import {
  lazy,
  Suspense,
  useEffect,
  useState,
  Component,
  type ReactNode,
} from "react";
import { motionAllowed } from "../../lib/motion";
import { SceneFallback } from "./SceneFallback";
const SceneCanvas = lazy(() => import("./SceneCanvas"));
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children;
  }
}
export function HeroScene() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (
        !active ||
        !motionAllowed() ||
        innerWidth < 1200 ||
        (navigator.hardwareConcurrency || 0) < 4 ||
        (navigator as Navigator & { connection?: { saveData: boolean } })
          .connection?.saveData
      )
        return;
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        if (gl) {
          gl.getExtension("WEBGL_lose_context")?.loseContext();
          setEnabled(true);
        }
      } catch {
        /* static scene remains */
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="hero-scene">
      <SceneFallback />
      {enabled && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <SceneCanvas />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
