export const siteContent = {
  name: "Crystal Kizor",
  concept: "Beyond Form. Into Meaning.",
  headline: "Building Beyond Buildings.",
  eyebrow: "Architect, designer, entrepreneur, speaker, researcher & creator",
  intro:
    "Creating spaces, ideas and opportunities that shape how people live, learn and thrive.",
  bio: "Crystal Kizor works across architecture, design, entrepreneurship, speaking and research. Her connected initiatives bring together the built environment, education, ideas, faith and wider purpose.",
  statement: "Design is more than what we build. It is what we make possible.",
  aboutDetail:
    "From thoughtful, climate-responsive architecture to furniture rooted in African context, the work extends beyond form — towards people, opportunity and purpose.",
  themes: [
    "Architecture",
    "Climate-responsive design",
    "African cities",
    "Design & entrepreneurship",
    "The built environment",
  ],
  contactTitle: "What could we build together?",
  // TODO(client): supply verified enquiry addresses, social links and canonical site URL.
  routes: [
    {
      id: "architecture",
      label: "Architecture & design",
      detail: "Spaces, interiors and objects",
      href: undefined,
    },
    {
      id: "partnerships",
      label: "Collaborations & partnerships",
      detail: "Shared ideas. Wider possibilities.",
      href: undefined,
    },
    {
      id: "speaking",
      label: "Speaking enquiries",
      detail: "Talks, panels and conversations",
      href: undefined,
    },
    {
      id: "other",
      label: "Something else",
      detail: "Start a different conversation",
      href: undefined,
    },
  ] as EnquiryRoute[],
};
import type { EnquiryRoute } from "../types/content";
