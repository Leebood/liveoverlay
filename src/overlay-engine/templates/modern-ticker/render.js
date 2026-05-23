// overlay-engine/templates/modern-ticker/render.js

function renderModernTicker(products, config) {
  var root = document.getElementById('overlay-root');
  var bar = document.createElement('div');
  bar.className = 'ticker-bar';
  bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;height:120px;background:' + config.backgroundColor + ';display:flex;align-items:center;overflow:hidden;padding:10px 0;z-index:100;';

  var track = document.createElement('div');
  track.className = 'ticker-track';
  track.style.cssText = 'display:flex;align-items:center;gap:16px;animation:ticker-scroll ' + (80 / config.scrollSpeed) + 's linear infinite;padding:0 20px;';

  function createCard(p) {
    var card = document.createElement('div');
    card.className = 'ticker-card';
    card.setAttribute('data-product-id', p.id);
    card.style.cssText = 'flex-shrink:0;width:' + config.cardWidth + 'px;background:' + config.cardBackgroundColor + ';border-radius:' + config.borderRadius + 'px;padding:12px;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px rgba(0,0,0,0.2);transition:transform 0.3s,opacity 0.3s;';

    var imgHtml = config.showProductImage && p.imageUrl
      ? '<img src="' + p.imageUrl + '" style="width:48px;height:48px;border-radius:8px;object-fit:cover;flex-shrink:0;" />'
      : '';

    var info = document.createElement('div');
    info.style.cssText = 'flex:1;min-width:0;';

    var nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-size:13px;font-weight:600;color:' + config.productNameColor + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:' + config.fontFamily + ',sans-serif;';
    nameEl.textContent = p.name;

    var priceEl = document.createElement('div');
    priceEl.style.cssText = 'font-size:16px;font-weight:700;color:' + config.priceColor + ';';
    priceEl.textContent = '$' + p.price.toFixed(2);

    if (config.showOriginalPrice && p.originalPrice) {
      var origEl = document.createElement('span');
      origEl.style.cssText = 'font-size:12px;text-decoration:line-through;color:' + config.productNameColor + ';opacity:0.5;margin-left:6px;';
      origEl.textContent = '$' + p.originalPrice.toFixed(2);
      priceEl.appendChild(origEl);
    }

    if (p.tag) {
      var tagEl = document.createElement('span');
      tagEl.style.cssText = 'display:inline-block;background:' + config.accentColor + ';color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;margin-left:6px;';
      tagEl.textContent = p.tag;
      priceEl.appendChild(tagEl);
    }

    info.appendChild(nameEl);
    info.appendChild(priceEl);
    card.innerHTML = imgHtml;
    card.appendChild(info);

    return card;
  }

  var allProducts = products.concat(products).concat(products);
  allProducts.forEach(function(p) { track.appendChild(createCard(p)); });
  bar.appendChild(track);
  root.appendChild(bar);

  window.highlightProduct = function(productId) {
    document.querySelectorAll('.ticker-card').forEach(function(el) {
      if (el.getAttribute('data-product-id') === productId) {
        el.style.transform = 'scale(1.1)';
        el.style.boxShadow = '0 4px 20px rgba(99,102,241,0.5)';
      } else {
        el.style.opacity = '0.3';
      }
    });
  };
  window.unhighlightProduct = function() {
    document.querySelectorAll('.ticker-card').forEach(function(el) {
      el.style.transform = '';
      el.style.opacity = '';
      el.style.boxShadow = '';
    });
  };
  window.toggleOverlay = function(visible) { root.style.display = visible ? '' : 'none'; };
  window.updateConfig = function(newConfig) { Object.assign(config, newConfig); };
}
