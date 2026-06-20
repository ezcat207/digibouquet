import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-screen font-mono uppercase">
      <div className="p-16 mx-auto max-w-3xl text-center">
        <Image
          src="https://assets.pauwee.com/color/flowers/peony.webp"
          alt="peony flower"
          width={100}
          height={100}
          className="object-cover mx-auto mb-6"
          priority
        />
        <Image
          src="https://assets.pauwee.com/other/digibouquet.png"
          alt="digibouquet"
          width={600}
          height={400}
          className="object-cover mx-auto"
          priority
        />
        <p className="my-6 text-sm md:mb-6 md:-mt-6">
          beautiful flowers <br /> delivered digitally
        </p>
        <div className="flex flex-col justify-center items-center">
          <Link
            className="text-sm px-8 py-4 bg-[#000000] text-[#F5F5DC] hover:bg-[#0A0000]/90 m-2"
            href="/bouquet?mode=color"
          >
            BUILD A BOUQUET
          </Link>
          <Link
            className="text-sm px-8 py-4 border border-black text-[#000000] hover:bg-[#F5F5AC]/90 m-2"
            href="/bouquet?mode=mono"
          >
            BUILD IT IN BLACK AND WHITE
          </Link>
          <Link
            className="text-sm px-8 py-4 underline text-[#000000] m-2"
            href="/garden"
          >
            VIEW GARDEN
          </Link>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-xs px-4 py-1.5 border border-black/20 rounded-full text-black/60 hover:text-black hover:border-black/40 transition-colors"
          >
            powered by ▲ vercel
          </a>
        </div>
        <p className="mt-10 text-sm text-gray-500">
          made by{" "}
          <a
            className="mt-2 text-sm text-gray-500 underline"
            href="https://x.com/pau_wee_"
          >
            @pau_wee_
          </a>
        </p>
      </div>
    </div>
  );
}
