import Link from 'next/link';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Button.module.css';

export type ButtonVariant = 'glass' | 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonTone = 'light' | 'dark';

interface ButtonStyleProps {
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
  className?: string;
}

function buttonClasses({
  variant = 'glass',
  size = 'md',
  className,
}: ButtonStyleProps) {
  return [styles.button, styles[size], styles[variant], className]
    .filter(Boolean)
    .join(' ');
}

function ButtonInner({ icon, children }: Pick<ButtonStyleProps, 'icon'> & { children: ReactNode }) {
  return (
    <>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </>
  );
}

export interface ButtonProps
  extends ButtonStyleProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {}

export function Button({
  variant,
  size,
  tone = 'light',
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={buttonClasses({ variant, size, className })}
      data-tone={tone}
      type={type}
      {...rest}
    >
      <ButtonInner icon={icon}>{children}</ButtonInner>
    </button>
  );
}

export interface ButtonLinkProps extends ButtonStyleProps {
  href: string;
  children: ReactNode;
}

/** A link that looks like a Button. Use for navigation, not actions. */
export function ButtonLink({
  href,
  variant,
  size,
  tone = 'light',
  icon,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={buttonClasses({ variant, size, className })}
      data-tone={tone}
    >
      <ButtonInner icon={icon}>{children}</ButtonInner>
    </Link>
  );
}
