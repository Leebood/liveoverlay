// overlay-engine/builder.ts
// Builds the final HTML string that OBS browser source loads

import type { PlanType } from '@/types/plan';
import type { OverlayProduct } from '@/types/product';
import { getPlanLimits } from '@/lib/plan-limits';
import { getTemplateDefinition } from './registry';
import { getBasicTickerCss } from './templates/basic-ticker/css';
import { getModernTickerCss } from './templates/modern-ticker/css';
import { readFileSync } from 'fs';
import { join } from 'path';

interface OverlayBuildParams {
  storeId: string;
  overlayId: string;
  templateId: string;
  config: Record<string, unknown>;
  products: OverlayProduct[];
  planType: PlanType;
  controlChannel: string;
}

function filterConfigByPlan(
  templateId: string,
  config: Record<string, unknown>,
  planType: PlanType
): Record<string, unknown> {
  const template = getTemplateDefinition(templateId);
  if (!template) return config;

  const filtered: Record<string, unknown> = { ...template.defaultConfig };
  const levelMap: Record<PlanType, number> = { free: 0, starter: 1, pro: 2, business: 3 };
  const level = levelMap[planType];

  for (const field of template.configSchema) {
    if (config[field.key] !== undefined) {
      const fieldLevel = field.minPlan ? levelMap[field.minPlan] : 0;
      if (level >= fieldLevel) {
        filtered[field.key] = config[field.key];
      }
    }
  }
  return filtered;
}

function getTemplateCss(templateId: string, config: Record<string, unknown>): string {
  switch (templateId) {
    case 'basic-ticker':
      return getBasicTickerCss(config);
    case 'modern-ticker':
      return getModernTickerCss(config);
    default:
      return '';
  }
}

function getTemplateRenderJs(templateId: string): string {
  try {
    const engineRoot = join(process.cwd(), 'src', 'overlay-engine');
    const renderPath = join(engineRoot, 'templates', templateId, 'render.js');
    return readFileSync(renderPath, 'utf-8');
  } catch {
    return `function render${templateId.replace(/-./g, x=>x[1].toUpperCase())}(products, config) {
      var root = document.getElementById('overlay-root');
      root.innerHTML = '<div style="color:#fff;padding:20px;">Template "${templateId}" - Coming Soon</div>';
    }`;
  }
}

function getRenderFunctionName(templateId: string): string {
  const name = templateId.replace(/-./g, x => x[1].toUpperCase());
  return 'render' + name.charAt(0).toUpperCase() + name.slice(1);
}

export function buildOverlayHtml(params: OverlayBuildParams): string {
  const { templateId, config, products, planType, controlChannel } = params;
  const limits = getPlanLimits(planType);

  const filteredConfig = filterConfigByPlan(templateId, config, planType);
  const templateCss = getTemplateCss(templateId, filteredConfig);
  const renderJs = getTemplateRenderJs(templateId);
  const renderFn = getRenderFunctionName(templateId);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.COZE_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.COZE_SUPABASE_ANON_KEY || '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: transparent; overflow: hidden; font-family: ${(filteredConfig.fontFamily as string) || 'system-ui'}, sans-serif; }
    ${templateCss}
    ${limits.showWatermark ? '.lo-wm{position:fixed;bottom:5px;right:10px;font-size:10px;color:rgba(255,255,255,0.4);pointer-events:none;z-index:9999}' : ''}
  </style>
</head>
<body>
  <div id="overlay-root"></div>
  <script>
    var PRODUCTS = ${JSON.stringify(products)};
    var CONFIG = ${JSON.stringify(filteredConfig)};
    var CONTROL_CHANNEL = '${controlChannel}';
    var SHOW_WATERMARK = ${limits.showWatermark};

    ${renderJs}

    // Initialize rendering
    ${renderFn}(PRODUCTS, CONFIG);

    // Make product elements clickable - open buy URL on click
    (function() {
      function handleClick(e) {
        var el = e.target.closest ? e.target.closest('[data-product-id]') : null;
        if (!el) return;
        var pid = el.getAttribute('data-product-id');
        if (!pid) return;
        var product = PRODUCTS.find(function(p) { return p.id === pid; });
        if (!product) return;
        var url = product.buyUrl || product.buy_url || '';
        if (url) {
          window.open(url, '_blank');
        }
      }
      document.addEventListener('click', handleClick);
    })();

    // Add hover cursor for clickable products
    (function() {
      var style = document.createElement('style');
      style.textContent = '[data-product-id][data-buy-url] { cursor: pointer; } [data-product-id][data-buy-url]:hover { opacity: 0.9; }';
      document.head.appendChild(style);
    })();

    ${limits.showWatermark ? 'var wm=document.createElement("div");wm.className="lo-wm";wm.textContent="Powered by LiveOverlay";document.body.appendChild(wm);' : ''}

    ${limits.allowLiveControl ? `
    // Supabase Realtime listener
    (function(){
      var s=document.createElement("script");
      s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/main/iife.min.js";
      s.onload=function(){
        var c=window.supabase.createClient("${supabaseUrl}","${supabaseAnonKey}");
        c.channel(CONTROL_CHANNEL).on("broadcast",{event:"control"},function(p){
          var m=p.payload;
          switch(m.action){
            case "highlight_product": if(window.highlightProduct) highlightProduct(m.productId); break;
            case "unhighlight_product": if(window.unhighlightProduct) unhighlightProduct(); break;
            case "toggle_visibility": if(window.toggleOverlay) toggleOverlay(m.visible); break;
            case "show_countdown": if(window.showCountdown) showCountdown(m.seconds,m.text); break;
            case "hide_countdown": if(window.hideCountdown) hideCountdown(); break;
            case "flash_deal": if(window.flashDeal) flashDeal(m.productId,m.price,m.duration); break;
            case "update_config": if(window.updateConfig) updateConfig(m.config); break;
          }
        }).subscribe();
      };
      document.head.appendChild(s);
    })();
    ` : ''}
  </script>
</body>
</html>`;
}
