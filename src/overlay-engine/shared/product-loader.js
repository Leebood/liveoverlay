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
  }
};
