import { useRef, useState } from "react";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { Hero } from "../sections/Hero";
import { About } from "../sections/About";
import { SelectedWork } from "../sections/SelectedWork";
import { Ecosystem } from "../sections/Ecosystem";
import { Perspectives } from "../sections/Perspectives";
import { Speaking } from "../sections/Speaking";
import { Purpose } from "../sections/Purpose";
import { Contact } from "../sections/Contact";
import { MotionProvider } from "../components/motion/SmoothScroll";
import { IntroSequence } from "../components/motion/IntroSequence";
import { Cursor } from "../components/ui/Cursor";
export default function App() {
  const main = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <MotionProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader mainRef={main} open={menuOpen} setOpen={setMenuOpen} />
      <main ref={main} id="main" tabIndex={-1}>
        <Hero />
        <About />
        <SelectedWork />
        <Ecosystem />
        <Perspectives />
        <Speaking />
        <Purpose />
        <Contact />
      </main>
      <SiteFooter />
      <IntroSequence />
      <Cursor />
    </MotionProvider>
  );
}
