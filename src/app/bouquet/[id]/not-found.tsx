import Link from 'next/link';

export default function BouquetNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F9F9EE] font-mono text-center">
      <h1 className="text-lg uppercase mb-4">Bouquet Not Found</h1>
      <p className="text-sm mb-8">
        This bouquet doesn&apos;t exist or has wilted away.
      </p>
      <Link
        href="/"
        className="text-xs md:text-sm uppercase bg-black text-white px-8 py-3 hover:opacity-80"
      >
        Make a new one
      </Link>
    </div>
  );
}
