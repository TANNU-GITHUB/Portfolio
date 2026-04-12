/** Full-width wave — black masks grid so the band meets the center with a scalloped edge */

export function WaveEdgeBottom() {
  return (
    <svg
      className="pointer-events-none absolute bottom-0 left-0 z-[1] block h-[min(11vw,44px)] w-full min-w-full text-black"
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0,48 L1440,48 L1440,24 C1200,40 1080,10 720,24 C360,38 240,14 0,24 L0,48 Z"
      />
    </svg>
  );
}

/** Black fill above the wave (top of bottom grid strip) */
export function WaveEdgeTop() {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 z-[1] block h-[min(11vw,44px)] w-full min-w-full text-black"
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0,0 L1440,0 L1440,24 C1200,8 1080,38 720,24 C360,10 240,34 0,24 L0,0 Z"
      />
    </svg>
  );
}
