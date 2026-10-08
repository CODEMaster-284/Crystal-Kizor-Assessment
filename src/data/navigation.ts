export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Selected Work" },
  { id: "ecosystem", label: "The Ecosystem" },
  { id: "perspectives", label: "Perspectives" },
  { id: "speaking", label: "Speaking" },
  { id: "purpose", label: "Purpose" },
  { id: "contact", label: "Contact" },
];
export const sectionNumber = (id: string) =>
  String(sections.findIndex((s) => s.id === id)).padStart(2, "0");
