type BrandMarkProps = {
  size?: number;
  title?: string;
};

export function BrandMark({ size = 32, title = "AK" }: BrandMarkProps) {
  return (
    <svg
      aria-label={title}
      height={size}
      role="img"
      viewBox="0 0 36 36"
      width={size}
    >
      <path
        d="M5 29V15L13 7L21 15V29M9 22H17M21 7V29M21 19L31 9M25 15L31 21"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.8"
      />
      <circle cx="5" cy="29" fill="var(--signal-primary)" r="2" />
      <circle cx="31" cy="9" fill="var(--signal-secondary)" r="2" />
      <circle cx="31" cy="21" fill="var(--signal-premium)" r="2" />
    </svg>
  );
}
