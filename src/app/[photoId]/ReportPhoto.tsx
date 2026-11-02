'use client';

import { Flag } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
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
import { REPORT_REASONS, type ReportReason } from '@/lib/photos/reportReasons';

/**
 * "Report this photo", under a public photo on the verification page. Posts
 * to `/[photoId]/report`. The app has the same sheet (`ReportPhotoSheet`),
 * with the same reasons and copy.
 */
export function ReportPhoto({ photoId }: { photoId: string }) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  const send = async () => {
    if (!reason || status === 'sending') return;
    setStatus('sending');
    try {
      const response = await fetch(`/${photoId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      setStatus(response.ok ? 'sent' : 'failed');
    } catch {
      setStatus('failed');
    }
  };

  // Opening it again after a report starts over.
  const onOpenChange = (open: boolean) => {
    if (!open) {
      setReason(null);
      setStatus('idle');
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex min-h-touch items-center gap-2 self-start text-label text-muted-foreground transition-colors duration-fast ease-out hover:text-foreground"
        >
          <Flag className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Report this photo
        </button>
      </DialogTrigger>
      <DialogContent>
        {status === 'sent' ? (
          <>
            <DialogHeader>
              <DialogTitle>Thanks for telling us.</DialogTitle>
              <DialogDescription>
                We&apos;ll take a look and remove it if it shouldn&apos;t be here.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Report this photo</DialogTitle>
              <DialogDescription>
                Tell us what&apos;s wrong. Whoever took it won&apos;t know it was you.
              </DialogDescription>
            </DialogHeader>
            <fieldset className="flex flex-col">
              <legend className="sr-only">Reason</legend>
              {REPORT_REASONS.map((option) => (
                <label
                  key={option.value}
                  className="flex min-h-touch cursor-pointer items-start gap-3 py-2"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={option.value}
                    checked={reason === option.value}
                    onChange={() => setReason(option.value)}
                    className="mt-1 size-4 shrink-0 accent-foreground"
                  />
                  <span className="flex flex-col">
                    <span className="text-body text-foreground">{option.title}</span>
                    {'subtitle' in option ? (
                      <span className="text-label text-muted-foreground">{option.subtitle}</span>
                    ) : null}
                  </span>
                </label>
              ))}
            </fieldset>
            {status === 'failed' ? (
              <p className="text-label text-destructive" role="alert">
                Couldn&apos;t send your report. Please try again.
              </p>
            ) : null}
            <DialogFooter>
              <Button onClick={send} disabled={!reason || status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send report'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
