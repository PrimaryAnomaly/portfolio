import Image from "next/image";

export function Gallery({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-swiss-4 my-swiss-6">
      {images.map((img) => (
        <div key={img.src} className="relative aspect-video bg-swiss-gray-50 border border-swiss-gray-200">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  );
}
