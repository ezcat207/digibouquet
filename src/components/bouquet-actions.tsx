'use client';

export function BouquetActions() {
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // clipboard not available
    }
  }

  async function share() {
    try {
      await navigator.share({
        title: 'digibouquet',
        url: window.location.href,
      });
    } catch {
      // share not supported or cancelled
    }
  }

  return (
    <div className="py-10 pt-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={copyLink}
          className="text-xs md:text-sm uppercase bg-black text-white px-5 py-2.5 transition-all duration-150 hover:opacity-80 hover:scale-[1.02] active:scale-[0.98]"
        >
          copy link
        </button>
        <button
          type="button"
          onClick={share}
          className="text-xs md:text-sm uppercase border border-black text-black px-5 py-2.5 bg-transparent hover:bg-black hover:text-white transition-colors"
        >
          share
        </button>
      </div>
    </div>
  );
}
