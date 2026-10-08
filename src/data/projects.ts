import type { Project, Media } from "../types/content";
import supplied from "./suppliedAssets.json";
import inventory from "./assetInventory.json";
const assets = supplied as Record<string, Media>;
const gallery = (group: string) =>
  inventory
    .filter((item) => "group" in item && item.group === group)
    .map((item) => assets[item.id]);
// Titles are supplied folder names. Narratives describe visible imagery; no location, completion, award or commission claims.
// TODO(client): supply approved project credits, dates, locations and extended narratives.
export const projects: Project[] = [
  {
    id: "nature-home",
    title: "Nature Home",
    category: "Studio COKA / Architecture & interiors",
    summary:
      "A home seen through its garden, shaded exterior and interior spaces. This supplied series brings the relationship between architecture, planting and everyday living into view.",
    image: assets["nature-home-front-view-with-tree-shade"],
    gallery: gallery("nature-home"),
    status: "verified",
  },
  {
    id: "community-centre",
    title: "Community Centre",
    category: "Architecture / Supplied design imagery",
    summary:
      "The supplied community centre views explore shared space, a curved form and sheltered gathering areas. See the exterior and interior design imagery in the project gallery.",
    image: assets["community-centre-img-2102-2"],
    gallery: gallery("community-centre"),
    status: "verified",
  },
  {
    id: "nature-home-2",
    title: "Nature Home 2",
    category: "Architecture / Supplied design imagery",
    summary:
      "A second supplied home study brings warm materials, planting and open living spaces together. Explore the full series of design views, with light and landscape as recurring elements.",
    image: assets["nature-home-2-1"],
    gallery: gallery("nature-home-2"),
    status: "verified",
  },
];
