import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { projects } from "../../data/projects";
import type { Project } from "../../types/content";
import styles from "./ProjectGalleries.module.css";
function Gallery({ project }: { project: Project }) {
  const images = project.gallery || [project.image];
  const [index, setIndex] = useState(0);
  const image = images[index];
  const select = (value: number) =>
    setIndex((value + images.length) % images.length);
  return (
    <details
      id={`project-${project.id}`}
      data-project-gallery
      className={styles.gallery}
    >
      <summary>
        <span>{project.category}</span>
        <h3>{project.title}</h3>
        <span>{images.length} views</span>
        <Plus aria-hidden="true" />
      </summary>
      <div className={styles.content}>
        <p>{project.summary}</p>
        <figure className={styles.stage}>
          <img
            src={image.src}
            srcSet={image.srcset}
            sizes="(max-width:767px) 100vw, 90vw"
            width={image.width}
            height={image.height}
            alt={image.alt}
            loading="lazy"
          />
        </figure>
        <div className={styles.controls}>
          <button
            type="button"
            onClick={() => select(index - 1)}
            aria-label={`Previous image in ${project.title}`}
          >
            <ArrowLeft size={18} />
          </button>
          <span aria-live="polite">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => select(index + 1)}
            aria-label={`Next image in ${project.title}`}
          >
            <ArrowRight size={18} />
          </button>
        </div>
        <ul
          className={styles.thumbnails}
          aria-label={`${project.title} image selection`}
        >
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => select(i)}
                aria-label={`Show ${project.title} image ${i + 1}`}
                aria-pressed={i === index}
              >
                <img
                  src={img.src}
                  srcSet={img.srcset}
                  sizes="(max-width:767px) 35vw, 180px"
                  width={img.width}
                  height={img.height}
                  alt={img.alt}
                  loading="lazy"
                />
              </button>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          Supplied project imagery. Further project details and credits to
          follow.
        </p>
      </div>
    </details>
  );
}
export function ProjectGalleries() {
  return (
    <div className={styles.galleries}>
      <div className={styles.intro}>
        <span>A closer look</span>
        <h2>Inside the work.</h2>
        <p>Explore all the supplied exterior, interior and design views.</p>
      </div>
      {projects.map((p) => (
        <Gallery key={p.id} project={p} />
      ))}
    </div>
  );
}
