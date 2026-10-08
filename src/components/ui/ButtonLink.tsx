import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { useSmoothScroll } from "../motion/SmoothScroll";
import type { AnalyticsEvent } from "../../lib/analytics";
import { track } from "../../lib/analytics";
export function AnchorLink({
  href,
  children,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { navigate } = useSmoothScroll();
  return (
    <a
      {...props}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (
          !e.defaultPrevented &&
          href?.startsWith("#") &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          e.preventDefault();
          navigate(href);
        }
      }}
    >
      {children}
    </a>
  );
}
export function ButtonLink({
  href,
  children,
  event,
  className = "",
  params = {},
}: {
  href?: string;
  children: ReactNode;
  event?: AnalyticsEvent;
  className?: string;
  params?: Record<string, string | number>;
}) {
  if (!href)
    return (
      <button
        className={`button-link unavailable ${className}`}
        type="button"
        aria-disabled="true"
        title="Link coming soon"
      >
        <span>
          {children}
          <small>Link coming soon</small>
        </span>
        <ArrowUpRight size={19} aria-hidden="true" />
      </button>
    );
  const click = () => {
    if (event) track(event, params);
  };
  return href.startsWith("#") ? (
    <AnchorLink
      className={`button-link ${className}`}
      data-cursor
      href={href}
      onClick={click}
    >
      {children}
      <ArrowUpRight size={19} aria-hidden="true" />
    </AnchorLink>
  ) : (
    <a
      className={`button-link ${className}`}
      data-cursor
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={click}
    >
      {children}
      <ArrowUpRight size={19} aria-hidden="true" />
    </a>
  );
}
