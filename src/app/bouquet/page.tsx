'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import type {
  BouquetMode,
  BuilderStep,
  FlowerId,
  FlowerSelection,
  Letter,
} from '@/lib/types';
import { FLOWERS, bushImageUrl, flowerImageUrl, logoUrl } from '@/lib/flowers';

const PRIMARY =
  'text-xs md:text-sm uppercase bg-black text-white px-8 py-3 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30';
const SECONDARY =
  'text-xs md:text-sm uppercase border border-black text-black px-8 py-3 hover:bg-black hover:text-white';

const ARRANGEMENT = [
  { x: 47, y: 9, size: 116, rotate: -12 },
  { x: 32, y: 20, size: 98, rotate: 15 },
  { x: 60, y: 21, size: 104, rotate: 8 },
  { x: 43, y: 31, size: 132, rotate: -4 },
  { x: 24, y: 36, size: 96, rotate: -18 },
  { x: 68, y: 38, size: 96, rotate: 21 },
  { x: 35, y: 49, size: 108, rotate: 10 },
  { x: 55, y: 50, size: 112, rotate: -16 },
  { x: 46, y: 61, size: 96, rotate: 6 },
  { x: 72, y: 59, size: 88, rotate: -9 },
  { x: 21, y: 58, size: 90, rotate: 14 },
  { x: 58, y: 69, size: 82, rotate: -22 },
  { x: 34, y: 70, size: 82, rotate: 24 },
  { x: 48, y: 42, size: 118, rotate: 0 },
];

const DONATIONS = [12, 8, 4];

function flowerName(id: FlowerId) {
  return id.replace('-', ' ').toUpperCase();
}

function expandFlowers(flowers: FlowerSelection[]): FlowerId[] {
  return flowers.flatMap((flower) =>
    Array.from({ length: flower.count }, () => flower.id),
  );
}

function shuffledIndexes(length: number, shift = 1) {
  const indexes = Array.from({ length }, (_, index) => index);
  return indexes.sort((a, b) => ((a * 7 + shift) % length) - ((b * 7 + shift) % length));
}

function FlowerPicture({
  id,
  mode,
  size,
  className,
  priority = false,
}: {
  id: FlowerId;
  mode: BouquetMode;
  size: number;
  className?: string;
  priority?: boolean;
}) {
  const src = flowerImageUrl(id, mode);
  return (
    <picture>
      <source srcSet={src} type="image/webp" />
      <Image
        src={src}
        alt={`${id} flower`}
        width={size}
        height={size}
        className={className}
        priority={priority}
      />
    </picture>
  );
}

function StepHeader({ step }: { step: BuilderStep }) {
  const steps: BuilderStep[] = ['pick-flowers', 'customize', 'write-card', 'support'];
  return (
    <div className="mb-8 flex justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-black/45">
      {steps.map((item, index) => (
        <span key={item} className={item === step ? 'text-black' : ''}>
          {index + 1}
        </span>
      ))}
    </div>
  );
}

function PickFlowers({
  mode,
  flowers,
  onChange,
  onNext,
}: {
  mode: BouquetMode;
  flowers: FlowerSelection[];
  onChange: (flowers: FlowerSelection[]) => void;
  onNext: () => void;
}) {
  const uniqueCount = flowers.length;
  const selectedCount = (id: FlowerId) => flowers.find((flower) => flower.id === id)?.count ?? 0;

  function increment(id: FlowerId) {
    const current = selectedCount(id);
    if (current === 0 && uniqueCount >= 10) return;
    if (current >= 9) return;
    if (current === 0) {
      onChange([...flowers, { id, count: 1 }]);
      return;
    }
    onChange(
      flowers.map((flower) =>
        flower.id === id ? { ...flower, count: flower.count + 1 } : flower,
      ),
    );
  }

  function remove(id: FlowerId) {
    onChange(flowers.filter((flower) => flower.id !== id));
  }

  return (
    <section className="text-center">
      <h1 className="text-xl md:text-3xl uppercase tracking-tight">Pick 6 to 10 BLOOMS</h1>
      <p className="mt-3 text-xs md:text-sm uppercase text-black/65">
        Click on a flower&apos;s name to deselect it.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
        {FLOWERS.map((flower) => {
          const count = selectedCount(flower.id);
          return (
            <div key={flower.id} className="group relative flex flex-col items-center">
              <button
                type="button"
                onClick={() => increment(flower.id)}
                className="relative flex h-28 w-full items-center justify-center border border-black/20 bg-[#F5F5DC]/60 transition hover:-translate-y-1 hover:border-black"
                aria-label={`add ${flower.id}`}
              >
                <FlowerPicture
                  id={flower.id}
                  mode={mode}
                  size={80}
                  className="h-20 w-20 object-contain"
                  priority={flower.id === 'orchid'}
                />
                {count > 0 && (
                  <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs text-white">
                    {count}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => (count > 0 ? remove(flower.id) : increment(flower.id))}
                className="mt-3 text-xs uppercase underline-offset-4 hover:underline"
              >
                {flowerName(flower.id)}
              </button>
              <div className="pointer-events-none absolute -top-14 z-20 hidden w-48 border border-black bg-white px-3 py-2 text-[10px] uppercase shadow-sm group-hover:block">
                <p>{flower.description}</p>
                <p className="mt-1 text-black/55">Birth month: {flower.birthMonth}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-9 min-h-16 border-y border-black py-4">
        {flowers.length === 0 ? (
          <p className="text-xs uppercase text-black/45">Your selected blooms will appear here.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {flowers.map((flower) => (
              <button
                key={flower.id}
                type="button"
                onClick={() => remove(flower.id)}
                className="border border-black bg-[#F9F9EE] px-3 py-2 text-xs uppercase hover:bg-black hover:text-white"
              >
                {flowerName(flower.id)} x{flower.count}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <button type="button" onClick={onNext} disabled={uniqueCount < 6} className={PRIMARY}>
          Next
        </button>
      </div>
      <p className="mt-4 text-[10px] uppercase text-black/45">
        {uniqueCount}/10 flower types selected · minimum 6
      </p>
    </section>
  );
}

function BouquetPreview({
  mode,
  flowers,
  greenery,
  order,
}: {
  mode: BouquetMode;
  flowers: FlowerSelection[];
  greenery: string;
  order: number[];
}) {
  const expanded = expandFlowers(flowers);
  const visibleOrder = order.length === expanded.length ? order : expanded.map((_, index) => index);

  return (
    <div className="mx-auto mt-9 flex max-w-2xl justify-center rounded-full bg-[#F5F5DC] px-2 py-8 md:px-8">
      <div className="relative h-[360px] w-full max-w-[600px] overflow-visible md:h-[500px]">
        <Image
          src={bushImageUrl(greenery, mode)}
          alt="bush background"
          width={600}
          height={500}
          className="absolute inset-0 z-0 h-full w-full object-contain"
          priority
        />
        <div className="absolute inset-[7%_10%_18%_10%] z-10">
          {visibleOrder.map((flowerIndex, position) => {
            const id = expanded[flowerIndex];
            if (!id) return null;
            const style = ARRANGEMENT[position % ARRANGEMENT.length];
            return (
              <div
                key={`${id}-${flowerIndex}-${position}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${style.x}%`,
                  top: `${style.y}%`,
                  zIndex: position + 1,
                  transform: `translate(-50%, -50%) rotate(${style.rotate}deg)`,
                }}
              >
                <FlowerPicture
                  id={id}
                  mode={mode}
                  size={style.size}
                  className="object-contain drop-shadow-sm"
                />
              </div>
            );
          })}
        </div>
        <Image
          src={bushImageUrl(`${greenery}-top`, mode)}
          alt="bush top overlay"
          width={600}
          height={500}
          className="absolute inset-0 z-30 h-full w-full object-contain"
          priority
        />
      </div>
    </div>
  );
}

function Customize({
  mode,
  flowers,
  greenery,
  flowerOrder,
  onGreenery,
  onOrder,
  onBack,
  onNext,
}: {
  mode: BouquetMode;
  flowers: FlowerSelection[];
  greenery: string;
  flowerOrder: number[];
  onGreenery: (greenery: string) => void;
  onOrder: (order: number[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const expanded = useMemo(() => expandFlowers(flowers), [flowers]);
  const order = flowerOrder.length === expanded.length ? flowerOrder : expanded.map((_, index) => index);

  function reshuffle() {
    const shift = order.reduce((total, value, index) => total + value + index, 1) + 1;
    onOrder(shuffledIndexes(expanded.length, shift));
  }

  function changeGreenery() {
    const current = Number(greenery.replace('bush-', '')) || 1;
    const next = current === 3 ? 1 : current + 1;
    onGreenery(`bush-${next}`);
  }

  return (
    <section className="text-center">
      <h1 className="text-xl md:text-3xl uppercase tracking-tight">Customize Your Bouquet</h1>
      <BouquetPreview mode={mode} flowers={flowers} greenery={greenery} order={order} />
      <div className="mt-8 flex flex-col items-center justify-center gap-3 md:flex-row">
        <button type="button" onClick={reshuffle} className={SECONDARY}>
          Try a new Arrangement
        </button>
        <button type="button" onClick={changeGreenery} className={SECONDARY}>
          Change Greenery
        </button>
      </div>
      <p className="mt-4 text-xs uppercase text-black/55">Current greenery: {greenery}</p>
      <div className="mt-9 flex justify-center gap-3">
        <button type="button" onClick={onBack} className={SECONDARY}>
          Back
        </button>
        <button type="button" onClick={onNext} className={PRIMARY}>
          Next
        </button>
      </div>
    </section>
  );
}

function WriteCard({
  mode,
  letter,
  onLetter,
  onBack,
  onNext,
}: {
  mode: BouquetMode;
  letter: Letter;
  onLetter: (letter: Letter) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const decorative: FlowerId[] = ['rose', 'peony', 'daisy'];
  return (
    <section className="text-center">
      <h1 className="text-xl md:text-3xl uppercase tracking-tight">WRITE THE CARD</h1>
      <div className="mt-8 flex justify-center gap-4">
        {decorative.map((id, index) => (
          <div
            key={id}
            className={`flex h-24 w-20 items-center justify-center border border-black bg-white ${
              index === 1 ? 'rotate-2' : '-rotate-2'
            }`}
          >
            <FlowerPicture id={id} mode={mode} size={58} className="object-contain" />
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-md -rotate-1 border-2 border-black bg-white p-7 text-left shadow-[8px_8px_0_#000]">
        <label className="text-xs uppercase" htmlFor="dear">
          Dear
        </label>
        <input
          id="dear"
          value={letter.dear}
          onChange={(event) => onLetter({ ...letter, dear: event.target.value })}
          placeholder="Beloved,"
          className="mt-2 w-full border-b border-black bg-transparent px-1 py-2 text-sm uppercase outline-none placeholder:text-black/35"
        />
        <textarea
          value={letter.message}
          onChange={(event) => onLetter({ ...letter, message: event.target.value })}
          placeholder="I have so much to tell you, but only this much space on this card! Still, you must know..."
          className="mt-7 min-h-36 w-full resize-none border border-black bg-transparent p-3 text-sm uppercase outline-none placeholder:text-black/35"
        />
        <label className="mt-7 block text-xs uppercase" htmlFor="sincerely">
          Sincerely,
        </label>
        <input
          id="sincerely"
          value={letter.sincerely}
          onChange={(event) => onLetter({ ...letter, sincerely: event.target.value })}
          placeholder="Secret Admirer"
          className="mt-2 w-full border-b border-black bg-transparent px-1 py-2 text-sm uppercase outline-none placeholder:text-black/35"
        />
      </div>
      <div className="mt-10 flex justify-center gap-3">
        <button type="button" onClick={onBack} className={SECONDARY}>
          Back
        </button>
        <button type="button" onClick={onNext} className={PRIMARY}>
          Next
        </button>
      </div>
    </section>
  );
}

function Support({
  mode,
  donation,
  isSubmitting,
  thanks,
  onDonation,
  onDonate,
  onBack,
  onContinue,
}: {
  mode: BouquetMode;
  donation: number;
  isSubmitting: boolean;
  thanks: boolean;
  onDonation: (amount: number) => void;
  onDonate: () => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="relative text-center">
      <div className="pointer-events-none absolute -left-2 top-24 hidden -rotate-12 md:block">
        <FlowerPicture id="sunflower" mode={mode} size={92} className="object-contain" />
      </div>
      <div className="pointer-events-none absolute -right-2 top-20 hidden rotate-12 md:block">
        <FlowerPicture id="lily" mode={mode} size={92} className="object-contain" />
      </div>
      <h1 className="text-xl md:text-3xl uppercase tracking-tight">SUPPORT THE PROJECT</h1>
      <div className="mx-auto mt-9 max-w-lg space-y-5 text-sm uppercase leading-7">
        <p>
          hey! this site is run by{' '}
          <a href="https://pauwee.com" className="underline" target="_blank" rel="noreferrer">
            Pauline
          </a>
          , a solo designer + developer...
        </p>
        <p>if digibouquet brought you any joy today, please consider pitching in!</p>
      </div>
      <p className="mt-8 text-xs uppercase">pay what you can:</p>
      <div className="mt-4 flex justify-center gap-3">
        {DONATIONS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onDonation(amount)}
            className={`border border-black px-6 py-3 text-sm uppercase ${
              donation === amount ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-black hover:text-white'
            }`}
          >
            ${amount}
          </button>
        ))}
      </div>
      <button type="button" onClick={onDonate} className={`${PRIMARY} mt-6`}>
        Donate ${donation}
      </button>
      {thanks && <p className="mt-4 text-xs uppercase">Thank you for supporting digibouquet!</p>}
      <div className="mt-10 flex flex-col justify-center gap-3 md:flex-row">
        <button type="button" onClick={onBack} className={SECONDARY}>
          Back
        </button>
        <button type="button" onClick={onContinue} disabled={isSubmitting} className={PRIMARY}>
          {isSubmitting ? 'Creating...' : 'Continue to Bouquet'}
        </button>
      </div>
    </section>
  );
}

function BouquetBuilder() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modeParam = searchParams.get('mode');
  const mode: BouquetMode = modeParam === 'mono' ? 'mono' : 'color';

  const [step, setStep] = useState<BuilderStep>('pick-flowers');
  const [flowers, setFlowers] = useState<FlowerSelection[]>([]);
  const [greenery, setGreenery] = useState('bush-1');
  const [flowerOrder, setFlowerOrder] = useState<number[]>([]);
  const [letter, setLetter] = useState<Letter>({ dear: '', message: '', sincerely: '' });
  const [donation, setDonation] = useState(8);
  const [thanks, setThanks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function goCustomize() {
    const expanded = expandFlowers(flowers);
    setFlowerOrder(expanded.map((_, index) => index));
    setStep('customize');
  }

  async function createBouquet() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const expanded = expandFlowers(flowers);
    const order = flowerOrder.length === expanded.length ? flowerOrder : expanded.map((_, index) => index);
    const response = await fetch('/api/bouquets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, flowers, greenery, flowerOrder: order, letter }),
    });

    if (!response.ok) {
      setIsSubmitting(false);
      return;
    }

    const data: unknown = await response.json();
    if (
      typeof data === 'object' &&
      data !== null &&
      'short_id' in data &&
      typeof (data as Record<'short_id', unknown>).short_id === 'string'
    ) {
      const short_id = (data as Record<'short_id', string>).short_id;
      // Store bouquet data in sessionStorage so the view page can find it
      // even when serverless instances don't share in-memory state
      try {
        sessionStorage.setItem(
          `bouquet_${short_id}`,
          JSON.stringify({
            short_id,
            mode,
            flowers,
            greenery,
            flowerOrder: order,
            letter,
            timestamp: Date.now(),
          }),
        );
      } catch {
        // sessionStorage may be full or unavailable — proceed anyway
      }
      router.push(`/bouquet/${short_id}`);
      return;
    }

    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#F9F9EE] px-5 py-8 uppercase text-black md:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mx-auto mb-8 block w-fit">
          <Image
            src={logoUrl()}
            alt="digibouquet"
            width={220}
            height={90}
            className="h-auto w-44 object-contain md:w-56"
            priority
          />
        </Link>
        <StepHeader step={step} />
        {step === 'pick-flowers' && (
          <PickFlowers mode={mode} flowers={flowers} onChange={setFlowers} onNext={goCustomize} />
        )}
        {step === 'customize' && (
          <Customize
            mode={mode}
            flowers={flowers}
            greenery={greenery}
            flowerOrder={flowerOrder}
            onGreenery={setGreenery}
            onOrder={setFlowerOrder}
            onBack={() => setStep('pick-flowers')}
            onNext={() => setStep('write-card')}
          />
        )}
        {step === 'write-card' && (
          <WriteCard
            mode={mode}
            letter={letter}
            onLetter={setLetter}
            onBack={() => setStep('customize')}
            onNext={() => setStep('support')}
          />
        )}
        {step === 'support' && (
          <Support
            mode={mode}
            donation={donation}
            isSubmitting={isSubmitting}
            thanks={thanks}
            onDonation={setDonation}
            onDonate={() => setThanks(true)}
            onBack={() => setStep('write-card')}
            onContinue={createBouquet}
          />
        )}
      </div>
    </main>
  );
}

export default function BouquetBuilderPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F9F9EE]" />}>
      <BouquetBuilder />
    </Suspense>
  );
}
