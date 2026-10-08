export const ease = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power3.out",
  smooth: "power2.inOut",
};
export const dur = {
  micro: 0.25,
  ui: 0.5,
  reveal: 0.9,
  hero: 1.2,
  wipe: 0.9,
  intro: 1.8,
};
export const stagger = { line: 0.09, word: 0.04, char: 0.018, item: 0.07 };
export const scrollStart = { section: "top 82%", image: "top 88%" };
export const scrollState = { progress: 0 };
export function motionAllowed() {
  return (
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    new URLSearchParams(location.search).get("motion") !== "off"
  );
}
