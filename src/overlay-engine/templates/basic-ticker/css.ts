// overlay-engine/templates/basic-ticker/css.js

export function getBasicTickerCss(config: Record<string, unknown>): string {
  return `
@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.ticker-bar {
  font-family: system-ui, -apple-system, sans-serif;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}
.ticker-item {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.ticker-item:hover {
  transform: scale(1.05);
}
`;
}
