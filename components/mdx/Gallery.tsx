import fs from "fs";
import path from "path";
import Image from "next/image";
import { illustrations } from "@/components/illustrations";
import { DiagramFrame } from "@/components/diagrams/DiagramFrame";

type GalleryImage = {
  src: string;
  /** Key into components/illustrations, used until a real photo exists */
  art?: string;
  alt: string;
  caption?: string;
};

function isAvailable(src: string) {
  if (src.includes("placeholder")) return false;
  if (!src.startsWith("/")) return true;
  return fs.existsSync(path.join(process.cwd(), "public", src));
}

export function Gallery(props: {
  images?: GalleryImage[] | string;
  columns?: 1 | 2 | 3;
}) {
  const columns = props.columns ?? 2;

  let images: GalleryImage[];
  if (!props.images) return null;
  if (typeof props.images === "string") {
    try {
      images = JSON.parse(props.images);
    } catch {
      return null;
    }
  } else if (Array.isArray(props.images)) {
    images = props.images;
  } else {
    return null;
  }

  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2";

  return (
    <div className={`my-10 grid ${gridClass} gap-x-5 gap-y-8`}>
      {images.map((img, i) => (
        <figure key={`${img.src}-${i}`} className="m-0" data-reveal style={{ "--i": i } as React.CSSProperties}>
          <div className="relative aspect-[4/3] overflow-hidden border border-rule bg-plate">
            {isAvailable(img.src) ? (
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes={
                  columns === 1
                    ? "100vw"
                    : columns === 3
                      ? "(max-width: 640px) 100vw, 33vw"
                      : "(max-width: 640px) 100vw, 50vw"
                }
              />
            ) : img.art && illustrations[img.art] ? (
              <Illustration Art={illustrations[img.art]} />
            ) : (
              <PendingPlate label={img.alt} />
            )}
          </div>
          {img.caption && (
            <figcaption className="mt-3 flex gap-3 text-[0.875rem] leading-[1.45] text-ink-3">
              <span className="mono tnum shrink-0 text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              <span>{img.caption}</span>
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

/* Drawn stand-in, clearly marked, until the real photo or screenshot lands */
function Illustration({ Art }: { Art: React.ComponentType }) {
  return (
    <>
      <DiagramFrame className="absolute inset-0 text-ink-3">
        <Art />
      </DiagramFrame>
      <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-rule bg-plate/90 px-2 py-0.5 text-[0.6875rem] text-ink-3">
        Illustration
      </span>
    </>
  );
}

/* Drafting-sheet stand-in for photos that haven't been added yet */
function PendingPlate({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center text-ink-3" role="img" aria-label={`${label} (image pending)`}>
      <svg className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <pattern id="pending-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--rule)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pending-hatch)" />
      </svg>
      <span className="relative flex flex-col items-center gap-2 bg-plate px-4 py-3 text-center">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <rect x="1.5" y="3.5" width="15" height="11" stroke="currentColor" />
          <circle cx="9" cy="9" r="3" stroke="currentColor" />
          <path d="M5.5 3.5 L7 1.5 H11 L12.5 3.5" stroke="currentColor" />
        </svg>
        <span className="text-[0.8125rem] text-ink-2">{label}</span>
        <span className="text-[0.75rem]">Photo to come</span>
      </span>
    </div>
  );
}
