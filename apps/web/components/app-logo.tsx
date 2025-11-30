import Link from 'next/link';

import { cn } from '@kit/ui/utils';

function LogoImage({
  className,
  width = 105,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
  width={width}
  className={cn(`w-[80px] lg:w-[95px]`, className)}
  viewBox="0 0 720 200"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    {/* Dark blue for "Shop" */}
    <linearGradient id="gradShop" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#0A2A66" />
      <stop offset="100%" stopColor="#123E8A" />
    </linearGradient>

    {/* Teal for "Hub" */}
    <linearGradient id="gradHub" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#0DB9C5" />
      <stop offset="100%" stopColor="#23D4C7" />
    </linearGradient>
  </defs>

  {/* SHOP */}
  <text
    x="0"
    y="130"
    fontFamily="Montserrat, sans-serif"
    fontWeight="700"
    fontSize="120"
    fill="url(#gradShop)"
    letterSpacing="-2"
  >
    Shop
  </text>

  {/* dot */}
  <circle cx="355" cy="95" r="8" fill="#D24FDC" />

  {/* HUB */}
  <text
    x="380"
    y="130"
    fontFamily="Montserrat, sans-serif"
    fontWeight="600"
    fontSize="120"
    fill="url(#gradHub)"
    letterSpacing="-1"
  >
    Hub
  </text>
</svg>

  );
}

export function AppLogo({
  href,
  label,
  className,
}: {
  href?: string | null;
  className?: string;
  label?: string;
}) {
  if (href === null) {
    return <LogoImage className={className} />;
  }

  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'}>
      <LogoImage className={className} />
    </Link>
  );
}
