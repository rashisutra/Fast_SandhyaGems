(function () {
  'use strict';

  // ===== HARD-CODED FALLBACK PRODUCTS =====
  var FALLBACK_PRODUCTS = [
    { title: 'Natural Manik (Ruby) Stone', handle: 'manik-ruby', price: '\u20B92,500', img: 'https://images.unsplash.com/photo-1573408301185-9519f94e6a44?w=400&q=70&auto=format' },
    { title: 'Natural Moti (Pearl) Stone', handle: 'moti-pearl', price: '\u20B9500', img: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=400&q=70&auto=format' },
    { title: 'Natural Moonga (Red Coral) Stone', handle: 'moonga-coral', price: '\u20B9800', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=70&auto=format' },
    { title: 'Natural Panna (Emerald) Stone', handle: 'panna-emerald', price: '\u20B91,500', img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=70&auto=format' },
    { title: 'Natural Pukhraj (Yellow Sapphire)', handle: 'pukhraj-yellow-sapphire', price: '\u20B93,000', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=70&auto=format' },
    { title: 'Natural Heera (Diamond) Stone', handle: 'heera-diamond', price: '\u20B910,000', img: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400&q=70&auto=format' },
    { title: 'Natural Neelam (Blue Sapphire)', handle: 'neelam-blue-sapphire', price: '\u20B94,500', img: 'https://images.unsplash.com/photo-1608751819407-ed6af4f95117?w=400&q=70&auto=format' },
    { title: 'Natural Gomedh (Hessonite)', handle: 'gomedh-hessonite', price: '\u20B91,200', img: 'https://images.unsplash.com/photo-1617952739169-a9b0a1f7ebac?w=400&q=70&auto=format' },
  ];

  // ===== FOOTER YEAR =====
  function setFooterYear() {
    var el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ===== FORMAT PRICE =====
  function formatPrice(price) {
    var num = parseFloat(price);
    if (isNaN(num)) return '\u20B90';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }

  // ===== OPTIMIZE SHOPIFY IMAGE =====
  function optimizeImage(url, width) {
    if (!url || url.indexOf('cdn.shopify.com') === -1) return url;
    try {
      var u = new URL(url);
      u.searchParams.set('width', width || '400');
      u.searchParams.set('format', 'webp');
      return u.toString();
    } catch (e) {
      return url;
    }
  }

  // ===== RENDER PRODUCTS =====
  function renderProducts(products) {
    var grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';
    products.forEach(function (p) {
      var card = document.createElement('div');
      card.className = 'product-card';
      card.setAttribute('data-testid', 'product-card-' + (p.id || p.handle));
      var imgSrc = p.img || optimizeImage((p.images && p.images[0] && p.images[0].src) || '', 400);
      var price = p.price || formatPrice((p.variants && p.variants[0] && p.variants[0].price) || '0');
      var productUrl = 'https://sandhyagems.in/products/' + p.handle;
      card.innerHTML =
        '<div class="product-img-wrap">' +
          '<a href="' + productUrl + '" target="_blank" rel="noopener noreferrer" aria-label="View ' + p.title + ' on Sandhya Gems online store">' +
            '<img src="' + imgSrc + '" alt="' + p.title + '" class="product-img" loading="lazy" width="400" height="400" decoding="async" />' +
          '</a>' +
        '</div>' +
        '<div class="product-info">' +
          '<h3 class="product-title" title="' + p.title + '">' + p.title + '</h3>' +
          '<p class="product-price">' + price + '</p>' +
          '<div class="product-btn-wrap">' +
            '<a href="' + productUrl + '" target="_blank" rel="noopener noreferrer" class="product-btn" data-testid="button-buy-' + (p.id || p.handle) + '">' +
              '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
              'Know More' +
            '</a>' +
          '</div>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  // ===== RENDER FALLBACK PRODUCTS =====
  function renderFallback() {
    renderProducts(FALLBACK_PRODUCTS);
  }

  // ===== LOAD PRODUCTS FROM API =====
  var SHOPIFY_URL = 'https://sandhyagems.in/collections/navaratna/products.json?limit=8';
  var PROXY_URL   = '/api/products';

  function parseAndRender(data) {
    var products = (data.products || []).slice(0, 8);
    if (products.length > 0) {
      renderProducts(products);
      return true;
    }
    return false;
  }

  function loadProducts() {
    fetch(SHOPIFY_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!parseAndRender(data)) renderFallback();
      })
      .catch(function () {
        fetch(PROXY_URL)
          .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
          })
          .then(function (data) {
            if (!parseAndRender(data)) renderFallback();
          })
          .catch(function () {
            renderFallback();
          });
      });
  }

  // ===== WHATSAPP BUTTON =====
  function initWhatsApp() {
    var btn = document.querySelector('[data-testid="button-whatsapp"]');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(btn.href, '_blank', 'noopener,noreferrer');
    });
  }

  // ===== INIT =====
  function init() {
    setFooterYear();
    loadProducts();
    initWhatsApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
