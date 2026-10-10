import type { Metadata } from 'next';
import { Copy, Heart, Images, Plus } from 'lucide-react';

import type { ReactNode } from 'react';

import tokens from '@/../design-system/tokens.json';
import { BoilingMark } from '@/components/brand/BoilingMark';
import { BrandReveal } from '@/components/brand/BrandReveal';
import { HighlightBadge } from '@/components/brand/HighlightBadge';
import { LabelValue } from '@/components/brand/LabelValue';
import { NotificationCard } from '@/components/brand/NotificationCard';
import { ProfileHeader } from '@/components/brand/ProfileHeader';
import { ProofCard } from '@/components/brand/ProofCard';
import { ShareActions } from '@/components/brand/ShareActions';
import { VerifiedMark } from '@/components/brand/VerifiedMark';
import { Wordmark } from '@/components/brand/Wordmark';
import { SiteHeader } from '@/components/marketing/SiteHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { isPublicFlagEnabled } from '@/lib/featureFlags';
import { cn } from '@/lib/utils';
import { colors } from '@/styles/tokens';

/**
 * The living styleguide. Every token and component, in the order the three
 * platforms share: brand reveal, colours, type, radius, buttons, input,
 * cards, the mark. Lists are read from design-system/tokens.json, so a token
 * change shows up here without touching this file — only the class maps
 * below need a line for a *new* token, since Tailwind can't see class names
 * built at runtime.
 */

export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false },
};

const COLOR_CLASS: Record<string, string> = {
  background: 'bg-background',
  foreground: 'bg-foreground',
  surface: 'bg-surface',
  'surface-hover': 'bg-surface-hover',
  primary: 'bg-primary',
  'primary-foreground': 'bg-primary-foreground',
  'muted-foreground': 'bg-muted-foreground',
  'subtle-foreground': 'bg-subtle-foreground',
  border: 'bg-border',
  highlight: 'bg-highlight',
  'highlight-foreground': 'bg-highlight-foreground',
  destructive: 'bg-destructive',
  'destructive-foreground': 'bg-destructive-foreground',
  ring: 'bg-ring',
};

const TEXT_CLASS: Record<string, string> = {
  display: 'text-display',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  title: 'text-title',
  body: 'text-body',
  label: 'text-label',
  caption: 'text-caption',
};

const TYPE_SAMPLE: Record<string, string> = {
  display: 'Human.',
  h1: 'We just never signed it.',
  h2: 'Made by a human.',
  h3: 'Verify your identity',
  title: 'iPhone 16 Pro Max',
  body: 'A predominantly white, spacious canvas gives creators and their work the spotlight.',
  label: 'Weekly Streak',
  caption: '37.7749° N, 122.4194° W',
};

const RADIUS_CLASS: Record<string, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

const camel = (name: string) => name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
const own = <T extends object>(group: T) =>
  Object.entries(group).filter(([key]) => !key.startsWith('$')) as [string, Record<string, never>][];

function Section({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <h2 className="mb-6 text-caption text-muted-foreground">{title}</h2>
      {note ? <p className="-mt-4 mb-6 max-w-prose text-caption text-muted-foreground">{note}</p> : null}
      {children}
    </section>
  );
}

export default async function StyleguidePage() {
  const neueOn = await isPublicFlagEnabled('neue_font');

  return (
    <>
      <SiteHeader alwaysVisible />
      <main className="mx-auto max-w-marketing px-4 pt-24 md:px-8">
        <div className="flex items-center justify-between py-5">
          <Wordmark />
          <span className="text-caption text-muted-foreground">Design system · v0.1</span>
        </div>

        {/* 1. Brand reveal */}
        <div className="pt-12 pb-24">
          <BrandReveal lines={['Made by a human.', 'Signed by a phone.']} replayable />
          <p className="mt-6 text-center text-caption text-muted-foreground">
            Opacity-only reveal · 750ms ease-out · 800ms stagger
          </p>
        </div>

        {/* 2. Colours */}
        <Section title="Colors" note="Black, white and one light grey. Photos bring the colour; blue is for count badges only.">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {own(tokens.color.semantic).map(([name, token]) => (
              <div key={name} className="flex items-center gap-3">
                <span
                  className={cn('size-10 shrink-0 rounded-md border border-border', COLOR_CLASS[name])}
                  aria-hidden="true"
                />
                <span className="flex min-w-0 flex-col text-caption">
                  <span className="text-foreground">{name}</span>
                  <span className="text-muted-foreground">
                    {colors[camel(name) as keyof typeof colors]} · {String(token.$description)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* 3. Type */}
        <Section
          title="Typography"
          note={
            <>
              One weight (Medium, 500); hierarchy from size and colour. Each style is shown in
              Inter Display, the default, and in PP Neue Montreal, which only loads while the{' '}
              <code>neue_font</code> flag is on —{' '}
              {neueOn
                ? 'it is on now.'
                : 'it is off now, so that column falls back to Inter Display (or to a copy installed on this computer, if there is one).'}{' '}
              Sizes are web px / mobile pt.
            </>
          }
        >
          <div className="hidden grid-cols-[6rem_1fr_1fr] gap-4 border-b border-border pb-3 text-caption text-muted-foreground md:grid">
            <span>Style</span>
            <span>Inter Display</span>
            <span>PP Neue Montreal</span>
          </div>
          {own(tokens.typography).map(([name, token]) => {
            const web = (token.$value as { fontSize: number }).fontSize;
            const mobile = (token.$extensions as { mobile: { fontSize: number } }).mobile.fontSize;
            return (
              <div
                key={name}
                className="grid grid-cols-1 items-baseline gap-2 border-b border-border py-4 md:grid-cols-[6rem_1fr_1fr] md:gap-4"
              >
                <span className="text-caption text-muted-foreground">
                  {name} · {web}/{mobile}
                </span>
                <span className={cn('min-w-0 font-inter text-foreground', TEXT_CLASS[name])}>{TYPE_SAMPLE[name]}</span>
                <span className={cn('min-w-0 font-neue text-foreground', TEXT_CLASS[name])}>{TYPE_SAMPLE[name]}</span>
              </div>
            );
          })}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <LabelValue label="LabelValue · the core text pattern">Hard to miss you now.</LabelValue>
            <LabelValue label="Proof metadata" size="title">
              September 18, 2026 <span className="text-caption text-muted-foreground">3:42 PM</span>
            </LabelValue>
          </div>
        </Section>

        {/* 4. Radius */}
        <Section title="Radius">
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {own(tokens.radius).map(([name, token]) => (
              <div key={name} className="flex flex-col gap-2">
                <span className={cn('aspect-square w-full bg-surface', RADIUS_CLASS[name])} aria-hidden="true" />
                <span className="text-caption">
                  <span className="text-foreground">{name}</span>{' '}
                  <span className="text-muted-foreground">· {String(token.$description)}</span>
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* 5. Buttons (and badges, dialog) */}
        <Section title="Buttons" note="Pills. Primary is black, at most one per screen; secondary is grey; tertiary is text only.">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Download on the App Store</Button>
            <Button variant="secondary">
              <Copy strokeWidth={1.5} />
              Copy link
            </Button>
            <Button variant="tertiary">Not now</Button>
            <Button variant="destructive">Delete photo</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="icon" variant="secondary" aria-label="New photo">
              <Plus strokeWidth={1.5} />
            </Button>
            <Button size="icon" variant="secondary" aria-label="Gallery">
              <Images strokeWidth={1.5} />
            </Button>
            <Button size="icon" variant="secondary" aria-label="Like">
              <Heart strokeWidth={1.5} />
            </Button>
            <HighlightBadge label="3 week streak">3x</HighlightBadge>
            <VerifiedMark variant="badge" label="Verified" />
            <Badge>Badge</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <div className="mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete this photo?</DialogTitle>
                  <DialogDescription>Its proof link stops working. This can&rsquo;t be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="tertiary">Not now</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Section>

        {/* 6. Input */}
        <Section title="Input">
          <div className="grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="sg-name" className="text-label text-muted-foreground">
                Display name
              </label>
              <Input id="sg-name" placeholder="Sam Reyes" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sg-handle" className="text-label text-muted-foreground">
                Handle
              </label>
              <Input id="sg-handle" defaultValue="sam reyes" aria-invalid="true" aria-describedby="sg-handle-error" />
              <span id="sg-handle-error" className="text-label text-destructive">
                Handles can&rsquo;t contain spaces.
              </span>
            </div>
          </div>
        </Section>

        {/* 7. Cards */}
        <Section title="Cards" note="Flat: bg-surface, rounded, no border, no shadow.">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p className="text-caption text-muted-foreground">ProofCard · hover or tap the photo (300ms)</p>
              <ProofCard
                className="max-w-app"
                src="/styleguide/photo.jpg"
                alt="Prints laid out on a white table"
                width={523}
                height={529}
                fit="portrait"
                status={
                  <>
                    Your photo was
                    <br />
                    successfully verified!
                  </>
                }
                reveal={
                  <>
                    <span>iPhone 16 Pro Max</span>
                    <span>
                      September 18, 2026 <span className="text-caption text-muted-foreground">3:42 PM</span>
                    </span>
                    <span>iOS 19.0.1</span>
                    <span>San Francisco, CA</span>
                  </>
                }
                info={
                  <p className="text-title text-foreground">
                    iPhone 16 Pro Max
                    <br />
                    September 18, 2026 <span className="text-caption text-muted-foreground">3:42 PM</span>
                    <br />
                    iOS 19.0.1
                    <br />
                    San Francisco, CA{' '}
                    <span className="text-caption text-muted-foreground">37.7749° N, 122.4194° W</span>
                  </p>
                }
                actions={<ShareActions url="https://the-human-internet.com" />}
              />
            </div>

            <div className="flex flex-col gap-10">
              <div className="flex max-w-sm flex-col gap-4">
                <p className="text-caption text-muted-foreground">NotificationCard</p>
                <NotificationCard thumbnail="/styleguide/doodle-hand.png" label="Photo shared" value="They know it’s you." />
                <NotificationCard
                  thumbnail="/styleguide/photo.jpg"
                  label="Photo verified"
                  value="Go show them."
                  corner={<VerifiedMark variant="badge" label="Verified" />}
                />
                <NotificationCard
                  thumbnail="/styleguide/doodle-flame.png"
                  label="Weekly Streak"
                  value="Hard to miss you now."
                  corner={<HighlightBadge label="3 week streak">3x</HighlightBadge>}
                />
              </div>

              <div className="flex max-w-app flex-col gap-4">
                <p className="text-caption text-muted-foreground">ProfileHeader</p>
                <ProfileHeader
                  avatar="/styleguide/photo.jpg"
                  name="Sam Reyes"
                  meta="Influencer · Joined 2026 · 84 verified photos"
                  verified
                />
              </div>

              <div className="flex max-w-app flex-col gap-4">
                <p className="text-caption text-muted-foreground">Card</p>
                <Card>
                  <CardHeader>
                    <CardTitle>Photo verified.</CardTitle>
                    <CardDescription>Go show them.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    A card is a grey surface on the white page. Nothing more.
                  </CardContent>
                  <CardFooter>
                    <Button variant="tertiary">Not now</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </Section>

        {/* 8. The mark */}
        <Section title="The mark · boils at ~8fps on brand moments only">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid place-items-center rounded-lg border border-border px-4 py-12 md:col-span-2">
              <BoilingMark className="w-56" />
            </div>
            <div className="flex flex-col items-start justify-center gap-6 rounded-lg bg-surface p-6">
              <div className="flex items-center gap-3">
                <VerifiedMark />
                <span className="text-label">VerifiedMark</span>
              </div>
              <div className="flex items-center gap-3">
                <VerifiedMark variant="badge" />
                <span className="text-label">variant=&quot;badge&quot;</span>
              </div>
              <Wordmark />
            </div>
          </div>
          <p className="mt-2 text-caption text-muted-foreground">
            Approximation: the real boil swaps 4–6 hand-drawn variants of the mark every 120ms.
          </p>
        </Section>

        <footer className="border-t border-border pt-12 pb-16 text-caption text-muted-foreground">
          Tokens: design-system/tokens.json · Intent: DESIGN.md · Agent rules: AGENTS.md
        </footer>
      </main>
    </>
  );
}
