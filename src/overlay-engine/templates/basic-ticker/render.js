// overlay-engine/templates/basic-ticker/render.js
// Pure JS rendering for OBS browser source - zero dependencies

function renderBasicTicker(products, config) {
  var root = document.getElementById('overlay-root');
  var bar = document.createElement('div');
  bar.className = 'ticker-bar';
  bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;height:' + config.barHeight + 'px;background:' + config.backgroundColor + ';overflow:hidden;display:flex;align-items:center;z-index:100;';

  var track = document.createElement('div');
  track.className = 'ticker-track';
  track.style.cssText = 'display:flex;align-items:center;white-space:nowrap;animation:ticker-scroll ' + (60 / config.scrollSpeed) + 's linear infinite;';

  function createItem(p) {
    var item = document.createElement('span');
    item.className = 'ticker-item';
    item.setAttribute('data-product-id', p.id);
    if (p.buyUrl || p.buy_url) item.setAttribute('data-buy-url', p.buyUrl || p.buy_url);
    item.style.cssText = 'display:inline-flex;align-items:center;padding:0 24px;color:' + config.textColor + ';font-size:16px;font-weight:500;';

    var imgHtml = config.showProductImage && p.imageUrl ? '<img src="' + p.imageUrl + '" style="width:36px;height:36px;border-radius:4px;margin-right:8px;object-fit:cover;" />' : '';
    var nameSpan = '<span style="margin-right:8px;">' + p.name + '</span>';
    var priceSpan = '<span style="color:' + config.priceColor + ';font-weight:700;">$' + p.price.toFixed(2) + '</span>';
    var origSpan = p.originalPrice ? '<span style="text-decoration:line-through;color:' + config.textColor + ';opacity:0.5;margin-left:6px;font-size:13px;">$' + p.originalPrice.toFixed(2) + '</span>' : '';
    var tagSpan = p.tag ? '<span style="background:' + config.priceColor + ';color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;margin-left:8px;">' + p.tag + '</span>' : '';
    var sep = '<span style="margin:0 16px;opacity:0.3;">' + (config.separator || '•') + '</span>';

    item.innerHTML = imgHtml + nameSpan + priceSpan + origSpan + tagSpan + sep;
    return item;
  }

  // Duplicate products for seamless loop
  var allProducts = products.concat(products);
  allProducts.forEach(function(p) {
    track.appendChild(createItem(p));
  });

  bar.appendChild(track);
  root.appendChild(bar);

  // Highlight control
  window.highlightProduct = function(productId) {
    var items = document.querySelectorAll('.ticker-item');
    items.forEach(function(el) {
      if (el.getAttribute('data-product-id') === productId) {
        el.style.transform = 'scale(1.15)';
        el.style.transition = 'transform 0.3s';
      } else {
        el.style.opacity = '0.4';
      }
    });
  };

  window.unhighlightProduct = function() {
    var items = document.querySelectorAll('.ticker-item');
    items.forEach(function(el) {
      el.style.transform = '';
      el.style.opacity = '';
    });
  };

  window.toggleOverlay = function(visible) {
    root.style.display = visible ? '' : 'none';
  };

  window.updateConfig = function(newConfig) {
    Object.assign(config, newConfig);
  };
}
