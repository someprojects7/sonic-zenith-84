import type { ReactNode } from "react";

import cityMapBg from "@/assets/city-map-bg.jpg.asset.json";

/**
 * The product is a phone app, so on a wide screen we show it inside a phone
 * shell instead of stretching it, on a soft city-map backdrop. On phones and
 * tablets the frame and backdrop disappear and the app fills the screen.
 *
 * The frame carries a transform so that `fixed` elements inside the app (the
 * bottom bars) anchor to the phone, not to the browser window.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative bg-background md:flex md:min-h-screen md:items-center md:justify-center md:bg-surface-2 md:p-8">
      {/* Decorative backdrop, desktop only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: `url(${cityMapBg.url})` }}
      />

      <div className="relative w-full md:h-[860px] md:max-h-[calc(100vh-4rem)] md:w-[400px] md:overflow-y-auto md:overflow-x-hidden md:rounded-[1.5rem] md:bg-background md:shadow-2xl md:ring-1 md:ring-hairline md:[transform:translateZ(0)] md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  );
}
