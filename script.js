const PRODUCTS = [
  { id: 'reta10', name: 'Retatrutide', strength: '10mg', price: 149.99, category: 'Metabolic Research', image: 'assets/retatrutide-10mg.png' },
  { id: 'reta15', name: 'Retatrutide', strength: '15mg', price: 199.99, category: 'Metabolic Research', image: 'assets/retatrutide-15mg.png' },
  { id: 'reta20', name: 'Retatrutide', strength: '20mg', price: 249.99, category: 'Metabolic Research', image: 'assets/retatrutide-20mg.png' },
  { id: 'cjcipa10', name: 'CJC-1295 N/D + Ipamorelin', strength: '10mg', price: 119.99, category: 'GH Research', image: 'assets/cjc-ipa-10mg.png' },
  { id: 'bpctb20', name: 'BPC-157 + TB-500', strength: '10mg + 10mg', price: 119.99, category: 'Recovery Research', image: 'assets/bpc-tb-20mg.png' },
  { id: 'klow80', name: 'KLOW', strength: '80mg', price: 179.99, category: 'Multi Peptide Blend', image: 'assets/klow-80mg.png' },
  { id: 'bac3', name: 'BAC Water', strength: '3ml', price: 19.99, category: 'Ancillary', image: 'assets/bac-water-3ml.png' },
  { id: 'bac10', name: 'BAC Water', strength: '10ml', price: 29.99, category: 'Ancillary', image: 'assets/bac-water-10ml.png' },
  { id: 'mots10', name: 'MOTS-C', strength: '10mg', price: 99.99, category: 'Cellular Research', image: 'assets/mots-c-10mg.png' },
  { id: 'igf1', name: 'IGF-1 LR3', strength: '1mg', price: 119.99, category: 'GH Research', image: 'assets/igf-1-lr3-1mg.png' }
];

const WA_NUMBER = '64273211748';
const BANK_ACCOUNT_NAME = 'HTX Peptides NZ';
const BANK_ACCOUNT_NUMBER = '06-0489-0153992-02';

function money(value) {
  return `$${Number(value).toFixed(2)} NZD`;
}

function getProduct(id) {
  return PRODUCTS.find(product => product.id === id);
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('htxCart') || '{}');
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem('htxCart', JSON.stringify(cart));
  renderCart();
}

function cartItems() {
  const cart = getCart();
  return Object.entries(cart)
    .map(([id, qty]) => {
      const product = getProduct(id);
      if (!product) return null;
      return { ...product, qty: Number(qty) || 0 };
    })
    .filter(item => item && item.qty > 0);
}

function cartTotal() {
  return cartItems().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function addToCart(id, qty = 1) {
  const product = getProduct(id);
  if (!product) {
    console.warn('Product not found:', id);
    return;
  }

  const cart = getCart();
  cart[id] = (Number(cart[id]) || 0) + Number(qty || 1);
  saveCart(cart);
  openCart();

  const count = document.querySelector('.cart-count');
  if (count) {
    count.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], {
      duration: 280,
      easing: 'ease-out'
    });
  }
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
}

function updateQty(id, qty) {
  const cart = getCart();
  const nextQty = Number(qty);
  if (nextQty <= 0 || Number.isNaN(nextQty)) delete cart[id];
  else cart[id] = nextQty;
  saveCart(cart);
}

function renderCart() {
  const items = cartItems();
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });

  const cartBox = document.querySelector('#cartItems');
  if (cartBox) {
    cartBox.innerHTML = items.length ? items.map(item => `
      <div class="cart-line">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <b>${item.name}</b>
          <span>${item.strength} • ${money(item.price)}</span>
          <div class="qty">
            <button type="button" class="qty-btn" data-qty-id="${item.id}" data-qty="${item.qty - 1}">−</button>
            <input value="${item.qty}" inputmode="numeric" data-qty-input="${item.id}">
            <button type="button" class="qty-btn" data-qty-id="${item.id}" data-qty="${item.qty + 1}">+</button>
          </div>
        </div>
        <button type="button" class="icon-btn" data-remove-id="${item.id}">×</button>
      </div>
    `).join('') : '<p class="muted">Your cart is empty.</p>';
  }

  const subtotal = document.querySelector('#cartSubtotal');
  if (subtotal) subtotal.textContent = money(cartTotal());
}

function openCart() {
  document.body.classList.add('cart-open');
  renderCart();
}

function closeCart() {
  document.body.classList.remove('cart-open');
}

function productCard(product) {
  const home = document.body.classList.contains('home-page');

  if (home) {
    return `
      <article class="premium-stock-card">
        <div class="premium-img">
          <img src="${product.image}" alt="${product.name} ${product.strength}">
        </div>
        <div class="premium-info">
          <small>${product.category}</small>
          <h3>${product.name}</h3>
          <p>${product.strength} • Research Use Only</p>
          <b>${money(product.price)}</b>
          <div class="premium-actions">
            <button type="button" class="btn ghost" data-view-product="${product.id}">View Product</button>
            <button type="button" class="btn" data-add-product="${product.id}">Add To Cart</button>
          </div>
        </div>
      </article>
    `;
  }

  return `
    <article class="product-card">
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name} ${product.strength}">
      </div>
      <div class="product-info">
        <small>${product.category}</small>
        <h3>${product.name}</h3>
        <p>${product.strength}</p>
        <b>${money(product.price)}</b>
        <div class="product-actions">
          <button type="button" class="btn ghost" data-view-product="${product.id}">View Product</button>
          <button type="button" class="btn" data-add-product="${product.id}">Add</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(limit) {
  const grid = document.querySelector('#productGrid');
  if (!grid) return;

  const amount = Number(limit || document.body.dataset.limit || PRODUCTS.length);
  grid.innerHTML = PRODUCTS.slice(0, amount).map(productCard).join('');
}

function viewProduct(id) {
  const product = getProduct(id);
  const modal = document.querySelector('#productModal');
  if (!product || !modal) return;

  modal.innerHTML = `
    <div class="modal-card">
      <button class="modal-close" type="button" data-close-modal>×</button>
      <div class="modal-grid">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <small class="eyebrow">${product.category}</small>
          <h2>${product.name}</h2>
          <h3>${product.strength}</h3>
          <p class="price">${money(product.price)}</p>
          <p>Premium lyophilized peptide product supplied for research purposes only. Not for human use.</p>
          <ul class="clean-list">
            <li>Storage: Refrigerate at 2°C–8°C</li>
            <li>Research use only</li>
            <li>COA available on request</li>
          </ul>
          <button class="btn wide" type="button" data-add-product="${product.id}" data-close-after-add="true">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('show');
}

function closeModal() {
  document.querySelector('#productModal')?.classList.remove('show');
}

function checkoutWhatsApp() {
  const items = cartItems();
  if (!items.length) {
    alert('Your cart is empty.');
    return;
  }

  const paymentMethod = document.querySelector('#paymentMethod')?.value || 'Bank Transfer';
  const orderRef = 'HTX-' + Date.now().toString().slice(-6);
  const lines = items.map(item => `• ${item.name} ${item.strength} x ${item.qty} — ${money(item.price * item.qty)}`).join('\\n');

  const paymentText = paymentMethod === 'Bank Transfer'
    ? `\\n\\nPayment Method: Bank Transfer\\nAccount Name: ${BANK_ACCOUNT_NAME}\\nAccount Number: ${BANK_ACCOUNT_NUMBER}\\nReference: ${orderRef}`
    : `\\n\\nPayment Method: Card Payment Link\\nReference: ${orderRef}\\nPlease send me a secure card payment link for this order.`;

  const message = `Hi HTX Peptides, I would like to place an order:\\n${lines}\\n\\nSubtotal: ${money(cartTotal())}${paymentText}\\n\\nName:\\nDelivery address:`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add-product]');
    if (addButton) {
      event.preventDefault();
      event.stopPropagation();
      addToCart(addButton.dataset.addProduct, 1);
      if (addButton.dataset.closeAfterAdd === 'true') closeModal();
      return;
    }

    const viewButton = event.target.closest('[data-view-product]');
    if (viewButton) {
      event.preventDefault();
      viewProduct(viewButton.dataset.viewProduct);
      return;
    }

    const removeButton = event.target.closest('[data-remove-id]');
    if (removeButton) {
      event.preventDefault();
      removeFromCart(removeButton.dataset.removeId);
      return;
    }

    const qtyButton = event.target.closest('[data-qty-id]');
    if (qtyButton) {
      event.preventDefault();
      updateQty(qtyButton.dataset.qtyId, qtyButton.dataset.qty);
      return;
    }

    if (event.target.closest('[data-close-modal]')) {
      event.preventDefault();
      closeModal();
      return;
    }
  });

  document.addEventListener('change', (event) => {
    const input = event.target.closest('[data-qty-input]');
    if (input) updateQty(input.dataset.qtyInput, input.value);
  });
}

function init() {
  renderProducts();
  renderCart();
  bindEvents();
}

window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.checkoutWhatsApp = checkoutWhatsApp;
window.viewProduct = viewProduct;
window.closeModal = closeModal;

document.addEventListener('DOMContentLoaded', init);
