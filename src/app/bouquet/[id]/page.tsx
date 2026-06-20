'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Bouquet, FlowerSelection } from '@/lib/types';
import { CDN_BASE } from '@/lib/flowers';
import { BouquetActions } from '@/components/bouquet-actions';

const CDN = CDN_BASE;

const FLOWER_STYLES = [
  { width: 120, height: 120, rotate: -1.2751 },
  { width: 80, height: 80, rotate: 2.398 },
  { width: 160, height: 160, rotate: -1.4299 },
  { width: 120, height: 120, rotate: 4.7609 },
  { width: 120, height: 120, rotate: -0.3652 },
  { width: 160, height: 160, rotate: -1.1723 },
  { width: 80, height: 80, rotate: 2.986 },
  { width: 120, height: 120, rotate: 2.4373 },
  { width: 120, height: 120, rotate: 4.368 },
  { width: 120, height: 120, rotate: -3.853 },
  { width: 100, height: 100, rotate: 1.5 },
  { width: 100, height: 100, rotate: -2.1 },
  { width: 90, height: 90, rotate: 3.2 },
  { width: 110, height: 110, rotate: -0.8 },
];

function expandFlowers(flowers: FlowerSelection[]): string[] {
  const result: string[] = [];
  for (const f of flowers) {
    for (let i = 0; i < f.count; i++) {
      result.push(f.id);
    }
  }
  return result;
}

export default function BouquetPage() {
  const params = useParams();
  const id = params.id as string;

  const [bouquet, setBouquet] = useState<Bouquet | null | 'loading'>('loading');

  useEffect(() => {
    // 1. Try sessionStorage first — data was stored here by the builder
    //    before navigating, so it works across serverless instances.
    try {
      const stored = sessionStorage.getItem(`bouquet_${id}`);
      if (stored) {
        const parsed: Bouquet = JSON.parse(stored);
        setBouquet(parsed);
        return;
      }
    } catch {
      // corrupted or inaccessible — fall through
    }

    // 2. Fallback: fetch from API
    fetch(`/api/bouquets/${id}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Bouquet | null) => setBouquet(data))
      .catch(() => setBouquet(null));
  }, [id]);

  if (bouquet === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9EE]">
        <p className="text-sm uppercase text-black/45">Loading bouquet...</p>
      </div>
    );
  }

  if (!bouquet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F9F9EE] font-mono text-center">
        <h1 className="text-lg uppercase mb-4">Bouquet Not Found</h1>
        <p className="text-sm mb-8">This bouquet doesn&apos;t exist or has wilted away.</p>
        <Link
          href="/"
          className="text-xs md:text-sm uppercase bg-black text-white px-8 py-3 hover:opacity-80"
        >
          Make a new one
        </Link>
      </div>
    );
  }

  const mode = bouquet.mode;
  const expanded = expandFlowers(bouquet.flowers);
  const order =
    bouquet.flowerOrder.length > 0 ? bouquet.flowerOrder : expanded.map((_, i) => i);
  const { dear, message, sincerely } = bouquet.letter;

  return (
    <div className="min-h-screen text-center p-6 pb-24 bg-[#F9F9EE]">
      <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150 [animation-fill-mode:both]">
        <Link href="/">
          <Image
            src={`${CDN}/other/digibouquet.png`}
            alt="digibouquet"
            width={200}
            height={80}
            className="object-cover mx-auto my-10"
            priority
          />
        </Link>

        <h2 className="text-lg mb-14">Hi, I made this bouquet for you!</h2>

        <div className="text-center">
          <div className="flex flex-col max-w-lg mx-auto bg-[#F5F5DC] rounded-full">
            <div className="flex relative justify-center items-center py-4 my-4">
              <div className="relative w-[500px] min-h-[410px]">
                <Image
                  src={`${CDN}/${mode}/bush/${bouquet.greenery}.png`}
                  alt="bush background"
                  width={600}
                  height={500}
                  className="absolute top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2"
                  priority
                />

                <div className="flex flex-wrap reverse w-[300px] justify-center items-center -space-x-4 -space-y-20 relative m-auto">
                  {order.map((idx, pos) => {
                    const flowerId = expanded[idx];
                    if (!flowerId) return null;
                    const style = FLOWER_STYLES[pos % FLOWER_STYLES.length];
                    return (
                      <div
                        key={`${flowerId}-${pos}`}
                        className="flex relative justify-center items-center pt-4"
                      >
                        <picture>
                          <source
                            srcSet={`${CDN}/${mode}/flowers/${flowerId}.webp`}
                            type="image/webp"
                          />
                          <Image
                            src={`${CDN}/${mode}/flowers/${flowerId}.webp`}
                            alt={flowerId}
                            width={style.width}
                            height={style.height}
                            className="relative z-10 transition-transform hover:scale-105"
                            style={{
                              transform: `rotate(${style.rotate}deg)`,
                            }}
                            loading="lazy"
                          />
                        </picture>
                      </div>
                    );
                  })}
                </div>

                <Image
                  src={`${CDN}/${mode}/bush/${bouquet.greenery}-top.png`}
                  alt="bush top"
                  width={600}
                  height={500}
                  className="absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-sm text-sm text-center">
          <div>
            <div className="bg-white border-[1.5px] border-black p-8 mx-auto -translate-y-[50px] -rotate-2 hover:-rotate-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex flex-row gap-2 items-left justify-left">
                  <p className="bg-transparent border-none focus:outline-none focus:ring-0">
                    Dear {dear}
                  </p>
                </div>
                <div className="text-left">
                  <p>{message}</p>
                </div>
                <div className="flex flex-col gap-2 justify-end items-end">
                  <p className="bg-transparent border-none focus:outline-none focus:ring-0">
                    Sincerely,
                  </p>
                  <p className="bg-transparent border-none focus:outline-none focus:ring-0">
                    {sincerely}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BouquetActions />

      <p className="text-sm text-black">
        made with digibouquet, a tool by{' '}
        <a
          className="text-sm underline text-black mt-2"
          href="https://x.com/pau_wee_"
        >
          @pau_wee_
        </a>
      </p>
      <Link className="text-sm underline text-black mt-2" href="/">
        make a bouquet now!
      </Link>
    </div>
  );
}
