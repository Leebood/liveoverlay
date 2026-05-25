// overlay-engine/shared/product-loader.js
// This runs inside OBS browser source - zero dependencies

var ProductLoader = {
  load: function(products, config) {
    window.__LO_PRODUCTS = products;
    window.__LO_CONFIG = config;
    return products;
  },
  getActiveProducts: function() {
    if (!window.__LO_PRODUCTS) return [];
    return window.__LO_PRODUCTS.filter(function(p) { return p.isActive !== false; });
  },
  formatPrice: function(price, currency) {
    var c = currency || 'USD';
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: c }).format(price);
    } catch(e) {
      return c + ' ' + price.toFixed(2);
    }
  },
  // Generate a clickable element for product purchase
  createBuyLink: function(product, text) {
    var url = product.buyUrl || product.buy_url || '';
    if (!url) return text || '购买';
    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;cursor:pointer;" onclick="window.open(\'' + url + '\',\'_blank\')">' + (text || '购买') + '</a>';
  },
  // Check if product has a buy URL
  hasBuyUrl: function(product) {
    return !!(product.buyUrl || product.buy_url);
  },
  // Get product buy URL
  getBuyUrl: function(product) {
    return product.buyUrl || product.buy_url || '';
  },
  // Make an entire element clickable
  makeClickable: function(element, product) {
    var url = product.buyUrl || product.buy_url || '';
    if (!url || !element) return;
    element.style.cursor = 'pointer';
    element.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.open(url, '_blank');
    });
  }
};
