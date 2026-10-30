import branch from '@/assets/public-info/olive-branch.png';
import corner from '@/assets/public-info/olive-branch-corner.png';
import leaves from '@/assets/public-info/olive-leaves.png';

const SOURCES = { branch, corner, leaves };

interface Props {
  name: keyof typeof SOURCES;
  /** Positioning and sizing within a `relative` parent. */
  className: string;
}

/** An olive branch or sprig of leaves cut from the slides, laid over a section's edge. */
export function Botanical({ name, className }: Props) {
  return (
    <img
      src={SOURCES[name]}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
    />
  );
}
