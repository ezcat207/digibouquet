# Digibouquet — Design Plan

## Overview
Replicate the full digibouquet bouquet builder flow locally: a 4-step multi-step form that lets users pick flowers, customize arrangement, write a card, and get a shareable bouquet URL.

## Routes

| Route | Type | Purpose |
|---|---|---|
| `/` | Server page (static) | Landing page ✅ (done) |
| `/bouquet` | Client page (dynamic) | Multi-step builder (new) — reads `?mode=color\|mono` |
| `/bouquet/[id]` | Server page (dynamic) | View a bouquet ✅ (needs URL data) |
| `/api/bouquets` | POST | Create a bouquet, returns `{ short_id }` (new) |
| `/api/bouquets/[id]` | GET | Get bouquet data by short_id (new) |

## Data Model

```typescript
interface Bouquet {
  short_id: string;       // crypto.randomUUID()
  mode: 'color' | 'mono';
  flowers: FlowerSelection[];
  greenery: string;       // 'bush-1' etc.
  flowerOrder: number[];  // indices into flowers, shuffled
  letter: {
    dear: string;
    message: string;
    sincerely: string;
  };
  timestamp: number;
}

interface FlowerSelection {
  id: FlowerId;  // orchid | tulip | dahlia | anemone | carnation | zinnia | ranunculus | sunflower | lily | daisy | peony | rose
  count: number;
}
```

## Builder Flow (4 Steps)

### Step 1: Pick 6-10 BLOOMS
- Logo at top
- "Pick 6 to 10 BLOOMS" heading
- Subtitle: "Click on a flower's name to deselect it."
- 12 flower buttons in a grid, each showing flower image + name
- Clicking selects (shows count badge "1"), clicking again increments count
- Selected flowers appear in a tray below with "FLOWER xN" labels
- "NEXT" button activates when ≥6 unique flowers selected
- Each flower button shows a tooltip on hover (name, description, birth month)

### Step 2: Customize Your Bouquet
- "Customize Your Bouquet" heading
- Bouquet preview: bush background + flowers arranged + bush top overlay
- "Try a new Arrangement" button — reshuffles flower positions
- "Change Greenery" button — cycles bush variants
- "BACK" and "NEXT" buttons

### Step 3: WRITE THE CARD
- "WRITE THE CARD" heading
- Card image previews (3 decorative card fronts in a row)
- "Dear" text input (placeholder: "Beloved,")
- Message textarea (placeholder: "I have so much to tell you...")
- "Sincerely," text input (placeholder: "Secret Admirer")
- "BACK" and "NEXT" buttons

### Step 4: SUPPORT THE PROJECT (pre-creation interstitial)
- "SUPPORT THE PROJECT" heading
- Decorative flowers around content
- Blurb about the creator (Pauline)
- Donation buttons: $12, $8, $4
- "DONATE $X" primary button (selects amount)
- "CONTINUE TO BOUQUET" — creates the bouquet via API, navigates to `/bouquet/[id]`
- "BACK" button returns to card step

## Storage Strategy
- **Phase 1 (now)**: In-memory `Map<string, Bouquet>` on the API server. Ephemeral but sufficient for a demo.
- **Phase 2 (future)**: Supabase `bouquets` table if persistence across deploys is needed.

## Component Tree
```
src/
  app/
    page.tsx                    → Landing (done)
    layout.tsx                  → Root layout with Martian Mono font (done)
    globals.css                 → Tailwind v4 styles (done)
    bouquet/
      page.tsx                  → Client component: multi-step builder (new)
      [id]/
        page.tsx                → Dynamic bouquet view (update to fetch from API)
    api/
      bouquets/
        route.ts                → POST: create bouquet (new)
        [id]/
          route.ts              → GET: get bouquet (new)
  lib/
    types.ts                    → Shared TypeScript types (new)
    store.ts                    → In-memory bouquet store (new)
    flowers.ts                  → Flower data definitions (new)
```

## CDN Resources
All flower images and assets come from `https://assets.pauwee.com/`:
- `/color/flowers/{name}.webp` — colored flower images
- `/mono/flowers/{name}.webp` — monochrome flower images
- `/color/bush/bush-{n}.png` — bush backgrounds
- `/color/bush/bush-{n}-top.png` — bush top overlays
- `/other/digibouquet.png` — logo
- `/other/metapreview.png` — OG image

## Flower Data
```typescript
const FLOWERS = [
  { id: 'orchid', description: 'Exotic Beauty', birthMonth: 'January' },
  { id: 'tulip', description: 'Perfect Love', birthMonth: 'April' },
  { id: 'dahlia', description: 'Elegance & Dignity', birthMonth: 'August' },
  { id: 'anemone', description: 'Anticipation', birthMonth: 'March' },
  { id: 'carnation', description: 'Fascination', birthMonth: 'January' },
  { id: 'zinnia', description: 'Enduring Friendship', birthMonth: 'April' },
  { id: 'ranunculus', description: 'Radiant Charm', birthMonth: 'March' },
  { id: 'sunflower', description: 'Adoration', birthMonth: 'August' },
  { id: 'lily', description: 'Purity & Grace', birthMonth: 'May' },
  { id: 'daisy', description: 'Innocence', birthMonth: 'May' },
  { id: 'peony', description: 'Prosperity', birthMonth: 'June' },
  { id: 'rose', description: 'Love & Passion', birthMonth: 'June' },
];
```
