import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Button.module.css';

export type ButtonVariant = 'glass' | 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonTone = 'light' | 'dark';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Only meaningful for `variant="glass"`: which backdrop it sits on. */
  tone?: ButtonTone;
  /**
   * The original design system passed a Lucide icon *name* and relied on a
   * global `lucide.createIcons()` sweep. Taking a node instead keeps the
   * component self-contained and drops the runtime dependency.
   */
  icon?: ReactNode;
}

export function Button({
  variant = 'glass',
  size = 'md',
  tone = 'light',
  icon,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[size], styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} data-tone={tone} type={type} {...rest}>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}
