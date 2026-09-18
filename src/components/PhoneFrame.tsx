import type { ReactNode } from "react";

/**
 * The product is a phone app, so on a wide screen we show it inside a phone
 * shell instead of stretching it. On phones and tablets the frame disappears
 * and the app fills the screen as usual.
 *
 * The frame carries a transform so that `fixed` elements inside the app (the
 * bottom bars) anchor to the phone, not to the browser window.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background md:flex md:min-h-screen md:items-center md:justify-center md:bg-surface-2 md:p-8">
      <div className="relative w-full md:h-[860px] md:max-h-[calc(100vh-4rem)] md:w-[400px] md:overflow-y-auto md:overflow-x-hidden md:rounded-[2.5rem] md:bg-background md:shadow-2xl md:ring-1 md:ring-hairline md:[transform:translateZ(0)] md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  );
}
