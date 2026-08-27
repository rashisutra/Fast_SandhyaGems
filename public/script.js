(function () {
  'use strict';

  // ===== BUSINESS HOURS CONFIG =====
  var HOURS = [
    { day: 'Sunday',    hours: '10:00 AM - 9:30 PM',  isShort: false },
    { day: 'Monday',    hours: '10:00 AM - 9:30 PM',  isShort: false },
    { day: 'Tuesday',   hours: '10:00 AM - 3:30 PM',  isShort: true  },
    { day: 'Wednesday', hours: '10:00 AM - 9:30 PM',  isShort: false },
    { day: 'Thursday',  hours: '10:00 AM - 3:30 PM',  isShort: true  },
    { day: 'Friday',    hours: '10:00 AM - 9:30 PM',  isShort: false },
    { day: 'Saturday',  hours: '10:00 AM - 9:30 PM',  isShort: false },
  ];

  // ===== HARD-CODED FALLBACK PRODUCTS =====
  var FALLBACK_PRODUCTS = [
    { title: 'Natural Panna (Emerald) Stone', handle: 'panna-emerald', price: '₹1,500', img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=70&auto=format' },
    { title: 'Natural Moonga (Coral) Stone', handle: 'moonga-coral', price: '₹800', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=70&auto=format' },
    { title: 'Natural Manik (Ruby) Stone', handle: 'manik-ruby', price: '₹2,500', img: 'https://images.unsplash.com/photo-1573408301185-9519f94e6a44?w=400&q=70&auto=format' },
    { title: 'Natural Pukhraj (Yellow Sapphire)', handle: 'pukhraj-yellow-sapphire', price: '₹3,000', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=70&auto=format' },
    { title: 'Natural Neelam (Blue Sapphire)', handle: 'neelam-blue-sapphire', price: '₹4,500', img: 'https://images.unsplash.com/photo-1608751819407-ed6af4f95117?w=400&q=70&auto=format' },
    { title: 'Natural Heera (Diamond) Stone', handle: 'heera-diamond', price: '₹10,000', img: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400&q=70&auto=format' },
    { title: 'Natural Moti (Pearl) Stone', handle: 'moti-pearl', price: '₹500', img: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=400&q=70&auto=format' },
    { title: 'Natural Gomedh (Hessonite)', handle: 'gomedh-hessonite', price: '₹1,200', img: 'https://images.unsplash.com/photo-1617952739169-a9b0a1f7ebac?w=400&q=70&auto=format' },
  ];

  // ===== STORE STATUS =====
  function updateStoreStatus() {
    var now = new Date();
    var dayIndex = now.getDay();
    var today = HOURS[dayIndex];
    var currentTime = now.getHours() * 60 + now.getMinutes();
    var openTime = 10 * 60;
    var closeTime = (today.isShort ? 15 : 21) * 60 + 30;
    var isOpen = currentTime >= openTime && currentTime <= closeTime;

    var badge = document.getElementById('store-status-badge');
    var hoursText = document.getElementById('store-hours-text');

    if (badge) {
      badge.textContent = isOpen ? 'Open Now' : 'Closed';
      badge.className = 'status-badge ' + (isOpen ? 'status-open' : 'status-closed');
    }
    if (hoursText) {
      hoursText.textContent = 'Today: ' + today.hours;
    }
  }

  // ===== HIGHLIGHT TODAY IN HOURS TABLE =====
  function highlightToday() {
    var now = new Date();
    var dayIndex = now.getDay();
    var dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    var todayId = 'hours-' + dayNames[dayIndex];
    var row = document.getElementById(todayId);
    if (!row) return;
    row.classList.add('is-today');
    var daySpan = row.querySelector('.hours-day');
    if (daySpan) {
      daySpan.classList.add('is-today');
      var badge = document.createElement('span');
      badge.className = 'today-badge';
      badge.textContent = 'Today';
      daySpan.appendChild(badge);
    }
  }

  // ===== FOOTER YEAR =====
  function setFooterYear() {
    var el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ===== FORMAT PRICE =====
  function formatPrice(price) {
    var num = parseFloat(price);
    if (isNaN(num)) return '₹0';
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

  // ===== ESCAPE HTML =====
  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ===== RENDER PRODUCTS =====
  function renderProducts(products) {
    var grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';
    products.forEach(function (p) {
      var card = document.createElement('div');
      card.className = 'product-card';
      var testId = escapeHtml(p.id || p.handle || '');
      card.setAttribute('data-testid', 'product-card-' + testId);
      var imgSrc = escapeHtml(p.img || optimizeImage((p.images && p.images[0] && p.images[0].src) || '', 400));
      var price = escapeHtml(p.price || formatPrice((p.variants && p.variants[0] && p.variants[0].price) || '0'));
      var title = escapeHtml(p.title || '');
      var productUrl = 'https://sandhyagems.in/products/' + encodeURIComponent(p.handle || '');
      card.innerHTML =
        '<div class="product-img-wrap">' +
          '<a href="' + productUrl + '" target="_blank" rel="noopener noreferrer" aria-label="View ' + title + ' on Sandhya Gems online store">' +
            '<img src="' + imgSrc + '" alt="' + title + '" class="product-img" loading="lazy" width="400" height="400" decoding="async" />' +
          '</a>' +
        '</div>' +
        '<div class="product-info">' +
          '<h3 class="product-title" title="' + title + '">' + title + '</h3>' +
          '<p class="product-price">' + price + '</p>' +
          '<div class="product-btn-wrap">' +
            '<a href="' + productUrl + '" target="_blank" rel="noopener noreferrer" class="product-btn" data-testid="button-buy-' + testId + '">' +
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
  var SHOPIFY_URL = 'https://sandhyagems.in/collections/navarat/products.json?limit=8';
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
    updateStoreStatus();
    highlightToday();
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
