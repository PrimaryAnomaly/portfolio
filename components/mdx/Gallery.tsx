import Image from "next/image";

type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

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
    <div className={`grid ${gridClass} gap-swiss-4 my-swiss-6`}>
      {images.map((img, i) => (
        <figure key={`${img.src}-${i}`} className="m-0">
          <div className="relative aspect-[4/3] bg-swiss-gray-50 border border-swiss-gray-200 overflow-hidden">
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
          </div>
          {img.caption && (
            <figcaption className="mono text-[0.6875rem] text-swiss-gray-400 mt-swiss-2 leading-[1.4]">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
