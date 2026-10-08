import type { Media } from "../types/content";
import supplied from "./suppliedAssets.json";
const assets = supplied as Record<string, Media>;
const placeholder = (name: string, alt: string): Media => ({
  src: `/assets/placeholders/${name}.svg`,
  srcset: `/assets/placeholders/${name}.svg 1600w`,
  width: 1600,
  height: 1100,
  alt,
  status: "placeholder",
});
export const assetManifest: Record<string, Media> = {
  ...assets,
  portrait: assets["hero-portrait"],
  about: assets["about-portrait"],
  editorial: assets["editorial-portrait"],
  speaking: assets["speaking-portrait"],
  research: assets["research-portrait"],
  practice: assets["practice-portrait"],
  pavilion: assets["nature-home-front-view-with-tree-shade"],
  // TODO(client): supply specific ELEvated product imagery and AKO/Alive and Free community images.
  objects: placeholder(
    "objects",
    "Placeholder: abstract furniture study; official ELEvated product imagery awaiting supply",
  ),
  communityPlaceholder: placeholder(
    "portrait",
    "Placeholder: architectural drawing; community imagery awaiting supply",
  ),
};
