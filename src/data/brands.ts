import type { Initiative, Pathway } from "../types/content";
import { assetManifest as assets } from "./assetManifest";
export const pathways: Pathway[] = [
  "Design & Build",
  "Education & Opportunity",
  "Ideas & Influence",
  "Faith & Purpose",
];
// TODO(client): supply six initiative logos and verified external destination URLs.
export const brands: Initiative[] = [
  {
    id: "coka",
    slug: "studio-coka",
    name: "Studio COKA",
    pathway: "Design & Build",
    summary:
      "Architecture, interior design and construction. Thoughtful, climate-responsive design.",
    image: assets.pavilion,
    href: "#project-nature-home",
    cta: "Explore Studio COKA",
    status: "verified",
  },
  {
    id: "elevated",
    slug: "elevated",
    name: "ELEvated",
    pathway: "Design & Build",
    summary:
      "Contemporary furniture and product design rooted in African context, materials and ideas.",
    image: assets.objects,
    cta: "Discover ELEvated",
    status: "verified",
  },
  {
    id: "tea",
    slug: "the-effective-architect",
    name: "The Effective Architect",
    pathway: "Education & Opportunity",
    summary:
      "Architecture education and media helping architects and built-environment professionals learn, grow and build better careers.",
    image: assets.speaking,
    cta: "Explore TEA",
    status: "verified",
  },
  {
    id: "ako",
    slug: "ako-alliance",
    name: "AKO Alliance",
    pathway: "Education & Opportunity",
    summary:
      "Expanding access to education and creating opportunities for children and young people.",
    image: assets.communityPlaceholder,
    cta: "Discover AKO Alliance",
    status: "verified",
  },
  {
    id: "crystal",
    slug: "crystal-kizor",
    name: "Crystal Kizor",
    pathway: "Ideas & Influence",
    summary:
      "Architecture, research, writing, media, ideas and other work under the personal brand.",
    image: assets.editorial,
    logo: assets["logo-horizontal-dark"].src,
    href: "#perspectives",
    cta: "Explore the ideas",
    status: "verified",
  },
  {
    id: "speaking",
    slug: "speaking-engagements",
    name: "Speaking Engagements",
    pathway: "Ideas & Influence",
    summary:
      "Talks and conversations on architecture, climate-responsive design, African cities, design, entrepreneurship and the built environment.",
    image: assets.speaking,
    href: "#speaking",
    cta: "Enquire about speaking",
    status: "verified",
  },
  {
    id: "alive",
    slug: "alive-and-free",
    name: "Alive and Free",
    pathway: "Faith & Purpose",
    summary:
      "A Christian youth movement helping young people walk in truth, healing, freedom, identity, purpose and life in Christ.",
    image: assets.communityPlaceholder,
    cta: "Discover Alive and Free",
    status: "verified",
  },
];
