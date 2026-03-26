import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[1200px] mx-auto px-swiss-5 py-swiss-10">
      <h1 className="text-[2rem] font-bold mb-swiss-2">404</h1>
      <p className="text-[0.875rem] text-swiss-gray-600 mb-swiss-5">Page not found.</p>
      <Link href="/" className="mono text-[0.75rem] text-swiss-black hover:text-swiss-red">&larr; Back</Link>
    </div>
  );
}
