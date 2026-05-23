// overlay-engine/templates/modern-ticker/css.ts

export function getModernTickerCss(config: Record<string, unknown>): string {
  return `
@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.33%); }
}
.ticker-bar {
  font-family: ${(config.fontFamily as string) || 'system-ui'}, sans-serif;
}
.ticker-card {
  transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
}
`;
}
