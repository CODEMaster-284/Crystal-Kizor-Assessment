export type Pathway =
  | "Design & Build"
  | "Education & Opportunity"
  | "Ideas & Influence"
  | "Faith & Purpose";
export type ContentStatus = "verified" | "placeholder" | "todo";
export interface Media {
  src: string;
  alt: string;
  srcset: string;
  width: number;
  height: number;
  status: ContentStatus;
}
export interface Initiative {
  id: string;
  slug: string;
  name: string;
  pathway: Pathway;
  summary: string;
  image: Media;
  logo?: string;
  href?: string;
  cta: string;
  status: ContentStatus;
}
export interface Project {
  gallery?: Media[];
  id: string;
  title: string;
  category: string;
  summary: string;
  image: Media;
  href?: string;
  status: ContentStatus;
}
export interface EnquiryRoute {
  id: string;
  label: string;
  detail: string;
  href?: string;
}
