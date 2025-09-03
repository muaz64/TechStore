/* app.js - Plain vanilla JS (no frameworks).
   Key goals:
   - Safe DOM rendering (no innerHTML with untrusted data)
   - No inline onclick usage; use addEventListener
   - Filter buttons via data-filter
   - Basic modal accessibility + focus handling
   - Cart persisted to localStorage
*/

/* -------------------------------------
   Data (sample). In production fetch this from an API or JSON.
------------------------------------- */
const products = [
  { id: 1, name: "iPhone 15 Pro", price: 999, category: "phones", image: "📱", rating: 5, reviews: 234 },
  { id: 2, name: "MacBook Pro M3", price: 1999, category: "laptops", image: "💻", rating: 5, reviews: 156 },
  { id: 3, name: "AirPods Pro", price: 249, category: "accessories", image: "🎧", rating: 4, reviews: 89 },
  { id: 4, name: "Samsung Galaxy S24", price: 899, category: "phones", image: "📱", rating: 4, reviews: 167 },
  { id: 5, name: "Dell XPS 13", price: 1299, category: "laptops", image: "💻", rating: 4, reviews: 98 },
  { id: 6, name: "Apple Watch Ultra", price: 799, category: "accessories", image: "⌚", rating: 5, reviews: 145 },
  { id: 7, name: "iPad Pro", price: 1099, category: "accessories", image: "📱", rating: 5, reviews: 203 },
  { id: 8, name: "Surface Laptop", price: 1199, category: "laptops", image: "💻", rating: 4, reviews: 76 }
];

/* -------------------------------------
   App state
------------------------------------- */
let cart = [];               // array of {id, name, price, image, quantity}
let currentFilter = 'all';
let lastFocusedElement = null;

/* -------------------------------------
   Utility functions
------------------------------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const formatPrice = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

function saveCart() {
  try {
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
  } catch (e) { /* ignore storage errors */ }
}
function loadCart() {
  try {
    const raw = localStorage.getItem('techstore_cart');
    cart = raw ? JSON.parse(raw) : [];
  } catch (e) {
    cart = [];
  }
}

/* -------------------------------------
   Rendering: products
------------------------------------- */
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg overflow-hidden card-hover';

  const inner = document.createElement('div');
  inner.className = 'p-6 text-center';

  const emoji = document.createElement('div');
  emoji.className = 'text-6xl mb-4';
  emoji.setAttribute('aria-hidden', 'true');
  emoji.textContent = product.image;

  const title = document.createElement('h3');
  title.className = 'text-xl font-semibold mb-2';
  title.textContent = product.name;

  // rating row
  const ratingRow = document.createElement('div');
  ratingRow.className = 'flex items-center justify-center mb-2';
  const stars = document.createElement('div');
  stars.className = 'star-rating';
  stars.textContent = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
  ratingRow.appendChild(stars);
  const rev = document.createElement('span');
  rev.className = 'ml-2 text-gray-600 text-sm';
  rev.textContent = `(${product.reviews})`;
  ratingRow.appendChild(rev);

  const price = document.createElement('p');
  price.className = 'text-2xl font-bold text-blue-600 mb-4';
  price.textContent = formatPrice(product.price);

  const btn = document.createElement('button');
  btn.className = 'w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors';
  btn.type = 'button';
  btn.textContent = 'Add to Cart';
  btn.addEventListener('click', () => addToCart(product.id));

  inner.append(emoji, title, ratingRow, price, btn);
  card.appendChild(inner);
  return card;
}

function displayProducts() {
  const productGrid = $('#productGrid');
  productGrid.innerHTML = ''; // clear
  const filtered = currentFilter === 'all' ? products : products.filter(p => p.category === currentFilter);
  const frag = document.createDocumentFragment();
  filtered.forEach(p => frag.appendChild(createProductCard(p)));
  productGrid.appendChild(frag);
}

/* -------------------------------------
   Cart operations
------------------------------------- */
function addToCart(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: prod.id, name: prod.name, price: prod.price, image: prod.image, quantity: 1 });
  }
  saveCart();
  updateCartUI(true);
}

function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveCart();
  updateCartUI();
}

function updateCartUI(animateBadge = false) {
  const cartCount = $('#cartCount');
  const totalItems = cart.reduce((s, it) => s + it.quantity, 0);
  cartCount.textContent = totalItems;
  if (animateBadge) {
    cartCount.classList.add('cart-badge');
    setTimeout(() => cartCount.classList.remove('cart-badge'), 500);
  }

  const cartItems = $('#cartItems');
  const cartTotal = $('#cartTotal');

  if (!cart || cart.length === 0) {
    cartItems.innerHTML = '<p class="text-gray-500 text-center py-4">Your cart is empty</p>';
    cartTotal.textContent = formatPrice(0);
    return;
  }

  cartItems.innerHTML = ''; // clear
  const frag = document.createDocumentFragment();
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';

    const left = document.createElement('div');
    left.className = 'flex items-center';
    const img = document.createElement('span');
    img.className = 'text-2xl mr-3';
    img.textContent = item.image;
    img.setAttribute('aria-hidden', 'true');
    const meta = document.createElement('div');
    const name = document.createElement('p');
    name.className = 'font-medium';
    name.textContent = item.name;
    const priceQty = document.createElement('p');
    priceQty.className = 'text-sm text-gray-600';
    priceQty.textContent = `${formatPrice(item.price)} x ${item.quantity}`;
    meta.append(name, priceQty);
    left.append(img, meta);

    const right = document.createElement('div');
    right.className = 'flex items-center space-x-2';
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.className = 'w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm';
    minus.textContent = '-';
    minus.addEventListener('click', () => updateQuantity(item.id, -1));
    const qty = document.createElement('span');
    qty.className = 'w-8 text-center';
    qty.textContent = item.quantity;
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm';
    plus.textContent = '+';
    plus.addEventListener('click', () => updateQuantity(item.id, +1));

    right.append(minus, qty, plus);
    row.append(left, right);
    frag.appendChild(row);
  });

  cartItems.appendChild(frag);
  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  cartTotal.textContent = formatPrice(total);
}

/* -------------------------------------
   Modal + accessibility helpers
------------------------------------- */
function getFocusableElements(container) {
  const selectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll(selectors)).filter(el => el.offsetParent !== null);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  const dialog = modal.querySelector('[role="document"]') || modal.querySelector('div[tabindex="-1"]') || modal.firstElementChild;
  dialog.setAttribute('tabindex', '-1');
  dialog.focus();

  // trap focus
  function trap(e) {
    if (e.key !== 'Tab') return;
    const focusables = getFocusableElements(dialog);
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  modal._trapHandler = trap;
  document.addEventListener('keydown', trap);
  document.addEventListener('keydown', modal._escapeHandler = (e) => {
    if (e.key === 'Escape') closeModal(modalId);
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');

  if (modal._trapHandler) {
    document.removeEventListener('keydown', modal._trapHandler);
    modal._trapHandler = null;
  }
  if (modal._escapeHandler) {
    document.removeEventListener('keydown', modal._escapeHandler);
    modal._escapeHandler = null;
  }
  if (lastFocusedElement) lastFocusedElement.focus();
}

/* -------------------------------------
   UI wiring and event bindings
------------------------------------- */
function setupFilters() {
  $$('#filterBar .filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = btn.dataset.filter;
      currentFilter = cat;
      // update visuals
      $$('#filterBar .filter-btn').forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white');
        b.classList.add('text-gray-600', 'hover:bg-gray-100');
      });
      btn.classList.add('bg-blue-600', 'text-white');
      displayProducts();
    });
  });
}

function setupNavAndButtons() {
  // Smooth scroll for same-page links
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile menu if open
      document.getElementById('mobileMenu').classList.remove('open');
    });
  });

  $('#shopNow').addEventListener('click', () => document.getElementById('products').scrollIntoView({ behavior: 'smooth' }));
  $('#browseBtn').addEventListener('click', () => document.getElementById('products').scrollIntoView({ behavior: 'smooth' }));
  $('#contactBtn').addEventListener('click', () => openModal('contactModal'));

  // mobile menu controls
  $('#mobileToggle').addEventListener('click', () => document.getElementById('mobileMenu').classList.toggle('open'));
  $('#closeMobile').addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));

  // cart open/close
  $('#cartButton').addEventListener('click', () => {
    const modal = document.getElementById('cartModal');
    if (modal.classList.contains('hidden')) {
      openModal('cartModal');
      updateCartUI();
    } else {
      closeModal('cartModal');
    }
  });
  $('#closeCart').addEventListener('click', () => closeModal('cartModal'));
  $('#closeContact').addEventListener('click', () => closeModal('contactModal'));

  // checkout demo
  $('#checkoutBtn').addEventListener('click', () => {
    if (!cart || cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
    alert(`Demo Checkout\n\nTotal: ${formatPrice(total)}\n\nIn a real app you would redirect to a secure payment processor.`);
    cart = [];
    saveCart();
    updateCartUI();
    closeModal('cartModal');
  });

  // contact form submission (client-side demo only)
  $('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // minimal client-side validation already via required attributes
    alert('Thank you for your message! We will get back to you within 24 hours.');
    $('#contactForm').reset();
    closeModal('contactModal');
  });
}

/* -------------------------------------
   Init
------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // dynamic footer year
  $('#footerYear').textContent = new Date().getFullYear();

  loadCart();
  setupFilters();
  displayProducts();
  updateCartUI();
  setupNavAndButtons();
});
