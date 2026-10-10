import { createCn } from 'cn/config';

/**
 * Class-name merge for Tailwind (shadcn's `cn`: clsx + tailwind-merge).
 *
 * It has to be told about our token names. Out of the box it reads
 * `text-label` as a text *colour*, so `cn('text-label', 'text-foreground')`
 * silently dropped the size. Keep these lists in step with the type scale
 * and size tokens mapped in src/styles/globals.css.
 */
export const cn = createCn({
  extend: {
    theme: {
      font: ['inter', 'neue'],
      text: ['display', 'h1', 'h2', 'h3', 'title', 'body', 'label', 'caption'],
      spacing: ['control', 'icon-button', 'touch', 'icon', 'thumbnail'],
    },
  },
});
