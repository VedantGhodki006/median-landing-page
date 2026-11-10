export const EASE = [0.22, 1, 0.36, 1] as const;

export const revealViewport = { once: true, margin: "-80px" } as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
