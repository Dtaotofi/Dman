const PRODUCTS = [
  { id: 'reta10', name: 'Retatrutide', strength: '10mg', price: 120, stock: 10, category: 'Metabolic Research', image: 'assets/retatrutide-10mg.png' },
  { id: 'reta20', name: 'Retatrutide', strength: '20mg', price: 220, stock: 0, category: 'Metabolic Research', image: 'assets/retatrutide-20mg.png' },
  { id: 'mots10', name: 'MOTS-C', strength: '10mg', price: 150, stock: 10, category: 'Metabolic Research', image: 'assets/mots-c-10mg.png' },
  { id: 'cjcipa10', name: 'CJC-1295 + Ipamorelin Blend', strength: '10mg', price: 120, stock: 20, category: 'GH Research', image: 'assets/cjc-ipa-10mg.png' },
  { id: 'bpctb20', name: 'BPC-157 + TB-500 Blend', strength: '20mg', price: 170, stock: 10, category: 'Recovery Research', image: 'assets/bpc-tb-20mg.png' },
  { id: 'klow80', name: 'KLOW', strength: '80mg', price: 220, stock: 20, category: 'Multi Peptide Blend', image: 'assets/klow-80mg.png' },
  { id: 'igf1lr3', name: 'IGF-1 LR3', strength: '1mg', price: 150, stock: 7, category: 'GH Research', image: 'assets/igf-1-lr3-1mg.png' },
  { id: 'bac3', name: 'BAC Water', strength: '3ml', price: 20, stock: 30, category: 'Ancillary', image: 'assets/bac-water-3ml.png' },
  { id: 'bac10', name: 'BAC Water', strength: '10ml', price: 30, stock: 30, category: 'Ancillary', image: 'assets/bac-water-10ml.png' }
];

const BANK_ACCOUNT_NAME = 'HTX Peptides';
const BANK_ACCOUNT_NUMBER = '06-0489-0153992-06';
const SUPPORT_EMAIL = 'support@htxpeptides.co.nz';
const ORDER_EMAIL = 'orders@htxpeptides.co.nz';
const SHIPPING_OPTIONS = {
  standard: {
    label: 'Flat Rate NZ Shipping',
    price: 12,
    eta: '1-3 business days'
  }
};

function money(value) {
  return `$${Number(value || 0).toFixed(2)} NZD`;
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
  renderCheckoutSummary();
}

function cartItems() {
  const cart = getCart();

  return Object.entries(cart)
    .map(([id, qty]) => {
      const product = getProduct(id);
      if (!product) return null;

      return {
        ...product,
        qty: Number(qty) || 0
      };
    })
    .filter(item => item && item.qty > 0);
}

function cartTotal() {
  return cartItems().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function cartCount() {
  return cartItems().reduce((sum, item) => sum + item.qty, 0);
}

function addToCart(id, qty = 1) {
  const product = getProduct(id);
  if (!product) return;

  if (product.stock <= 0) {
    alert('This product is currently sold out.');
    return;
  }

  const cart = getCart();
  const currentQty = Number(cart[id]) || 0;
  const requestedQty = currentQty + Number(qty || 1);

  if (requestedQty > product.stock) {
    alert(`Only ${product.stock} available in stock.`);
    return;
  }

  cart[id] = requestedQty;
  saveCart(cart);
  openCart();

  document.querySelectorAll('.cart-count').forEach(count => {
    count.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }],
      { duration: 280, easing: 'ease-out' }
    );
  });
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
}

function updateQty(id, qty) {
  const product = getProduct(id);
  if (!product) return;

  const cart = getCart();
  const nextQty = Number(qty);

  if (nextQty <= 0 || Number.isNaN(nextQty)) {
    delete cart[id];
  } else if (product.stock <= 0) {
    alert('This product is currently sold out.');
    delete cart[id];
  } else if (nextQty > product.stock) {
    alert(`Only ${product.stock} available in stock.`);
    cart[id] = product.stock;
  } else {
    cart[id] = nextQty;
  }

  saveCart(cart);
}

function renderCart() {
  const items = cartItems();
  const count = cartCount();

  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });

  const cartBox = document.querySelector('#cartItems');
  if (cartBox) {
    cartBox.innerHTML = items.length ? items.map(item => `
      <div class="cart-line">
        <img src="${item.image}" alt="${item.name} ${item.strength}" loading="lazy">
        <div>
          <b>${item.name}</b>
          <span>${item.strength} • ${money(item.price)}</span>
          <div class="qty">
            <button type="button" class="qty-btn" data-qty-id="${item.id}" data-qty="${item.qty - 1}">−</button>
            <input value="${item.qty}" inputmode="numeric" data-qty-input="${item.id}" aria-label="Quantity for ${item.name}">
            <button type="button" class="qty-btn" data-qty-id="${item.id}" data-qty="${item.qty + 1}">+</button>
          </div>
        </div>
        <button type="button" class="icon-btn" data-remove-id="${item.id}" aria-label="Remove ${item.name}">×</button>
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
          <img src="${product.image}" alt="${product.name} ${product.strength}" loading="lazy">
        </div>
        <div class="premium-info">
          <small>${product.category}</small>
          <h3>${product.name}</h3>
         <p>${product.strength} • Research Use Only</p>
${product.stock > 0
  ? `<p class="stock-count">In Stock: ${product.stock}</p>`
  : `<p class="sold-out-label">SOLD OUT</p>`
}
<b>${money(product.price)}</b>
          <div class="premium-actions">
            <button type="button" class="btn ghost" data-view-product="${product.id}">View Product</button>
            ${product.stock > 0
  ? `<button type="button" class="btn" data-add-product="${product.id}">
       Add To Cart
     </button>`
  : `<button type="button" class="sold-out-btn" disabled>
       SOLD OUT
     </button>`
}
          </div>
        </div>
      </article>
    `;
  }

  return `
    <article class="product-card">
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name} ${product.strength}" loading="lazy">
      </div>
      <div class="product-info">
        <small>${product.category}</small>
        <h3>${product.name}</h3>
        <p>${product.strength} • Research Use Only</p>
${product.stock > 0
  ? `<p class="stock-count">In Stock: ${product.stock}</p>`
  : `<p class="sold-out-label">SOLD OUT</p>`
}

<b>${money(product.price)}</b>

<div class="product-actions">
  <button type="button" class="btn ghost" data-view-product="${product.id}">
    View Product
  </button>

  ${product.stock > 0
    ? `<button type="button" class="btn" data-add-product="${product.id}">
         Add
       </button>`
    : `<button type="button" class="sold-out-btn" disabled>
         SOLD OUT
       </button>`
  }
</div>
        </div>
    </article>
  `;
}

function filteredProducts() {
  const search = (document.querySelector('#searchInput')?.value || '').toLowerCase().trim();
  const category = document.querySelector('#categoryFilter')?.value || 'all';

  return PRODUCTS.filter(product => {
    const matchesSearch = !search || `${product.name} ${product.strength} ${product.category}`.toLowerCase().includes(search);
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });
}

function renderProducts(limit) {
  const grid = document.querySelector('#productGrid');
  if (!grid) return;

  const isShop = Boolean(document.querySelector('#searchInput') || document.querySelector('#categoryFilter'));
  const products = isShop ? filteredProducts() : PRODUCTS;
  const amount = Number(limit || document.body.dataset.limit || products.length);
  const visibleProducts = products.slice(0, amount);

  grid.innerHTML = visibleProducts.length
    ? visibleProducts.map(productCard).join('')
    : '<p class="muted">No products found.</p>';
}

function viewProduct(id) {
  const product = getProduct(id);
  const modal = document.querySelector('#productModal');
  if (!product || !modal) return;

  modal.innerHTML = `
    <div class="modal-card">
      <button class="modal-close" type="button" data-close-modal>×</button>
      <div class="modal-grid">
        <img src="${product.image}" alt="${product.name} ${product.strength}" loading="lazy">
        <div>
          <small class="eyebrow">${product.category}</small>
          <h2>${product.name}</h2>
          <h3>${product.strength}</h3>
          <p class="price">${money(product.price)}</p>
          ${product.stock > 0
  ? `<p class="stock-count">In Stock: ${product.stock}</p>`
  : `<p class="sold-out-label">SOLD OUT</p>`
}
          <p>Premium lyophilized peptide product supplied for research purposes only. Not for human use.</p>
          <ul class="clean-list">
            <li>Storage: Refrigerate at 2°C–8°C</li>
            <li>Research use only</li>
            <li>COA available on request</li>
          </ul>
          ${product.stock > 0
  ? `<button class="btn wide" type="button" data-add-product="${product.id}" data-close-after-add="true">Add to Cart</button>`
  : `<button class="sold-out-btn wide" type="button" disabled>SOLD OUT</button>`
}
        </div>
      </div>
    </div>
  `;
  modal.classList.add('show');
}

function closeModal() {
  document.querySelector('#productModal')?.classList.remove('show');
}

function goToCheckout() {
  if (!cartItems().length) {
    alert('Your cart is empty.');
    return;
  }
  window.location.href = 'checkout.html';
}

function generateOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const random = Math.floor(10 + Math.random() * 90);
  return `HTX-${date}-${time}${random}`;
}

function shippingCost(subtotal, key) {
  if (subtotal >= 300) return 0;
  const option = SHIPPING_OPTIONS[key] || SHIPPING_OPTIONS.standard;
  return option.price;
}

function getCheckoutFormData() {
  return {
    fullName: document.querySelector('#fullName')?.value.trim() || '',
    email: document.querySelector('#email')?.value.trim() || '',
    phone: document.querySelector('#phone')?.value.trim() || '',
    address: document.querySelector('#address')?.value.trim() || '',
    shipping: document.querySelector('input[name="shippingOption"]:checked')?.value || 'standard'
  };
}

function renderCheckoutSummary() {
  const summary = document.querySelector('#checkoutSummary');
  if (!summary) return;

  const items = cartItems();
  const form = getCheckoutFormData();
  const subtotal = cartTotal();
  const ship = shippingCost(subtotal, form.shipping);
  const total = subtotal + ship;
  const option = SHIPPING_OPTIONS[form.shipping] || SHIPPING_OPTIONS.standard;

  if (!items.length) {
    summary.innerHTML = '<p class="muted">Your cart is empty.</p><a class="btn wide" href="shop.html">Return to Shop</a>';
    return;
  }

  summary.innerHTML = `
    <div class="checkout-products">
      ${items.map(item => `
        <div class="checkout-product-line">
          <img src="${item.image}" alt="${item.name} ${item.strength}" loading="lazy">
          <div><b>${item.name}</b><span>${item.strength} × ${item.qty}</span></div>
          <strong>${money(item.price * item.qty)}</strong>
        </div>
      `).join('')}
    </div>
    <div class="checkout-totals">
      <div><span>Subtotal</span><b>${money(subtotal)}</b></div>
      <div><span>${subtotal >= 300 ? 'Free Shipping' : option.label}</span><b>${ship === 0 ? '$0.00 NZD' : money(ship)}</b></div>
      <div class="checkout-total"><span>Total</span><b>${money(total)}</b></div>
    </div>
  `;
}

function placeBankOrder(event) {
  event?.preventDefault();
  const items = cartItems();
  if (!items.length) {
    alert('Your cart is empty.');
    return;
  }

  const form = getCheckoutFormData();
  if (!form.fullName || !form.email || !form.phone || !form.address) {
    alert('Please complete your name, email, phone and shipping address.');
    return;
  }

  const subtotal = cartTotal();
  const selectedShipping = SHIPPING_OPTIONS[form.shipping] || SHIPPING_OPTIONS.standard;
  const shipping = shippingCost(subtotal, form.shipping);
  const orderNumber = generateOrderNumber();
  const total = subtotal + shipping;

  const order = {
    orderNumber,
    customer: {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address
    },
    products: items.map(item => ({
      id: item.id,
      name: item.name,
      strength: item.strength,
      quantity: item.qty,
      unitPrice: item.price,
      lineTotal: item.price * item.qty
    })),
    subtotal,
    shipping: {
      method: selectedShipping.label,
      eta: selectedShipping.eta,
      cost: shipping,
      freeShippingApplied: subtotal >= 300
    },
    total,
    payment: {
      method: 'Bank Transfer',
      accountName: BANK_ACCOUNT_NAME,
      accountNumber: BANK_ACCOUNT_NUMBER,
      reference: orderNumber.slice(-8)
    },
    status: 'Awaiting Bank Transfer',
    createdAt: new Date().toISOString()
  };

  localStorage.setItem('htxLastOrder', JSON.stringify(order));

emailjs.send(
  "service_d1m7eei",
  "template_jcriw1i",
  {
    order_id: order.orderNumber,
    reference: order.payment.reference,
    customer_name: order.customer.fullName,
    email: order.customer.email,
    phone: order.customer.phone,
    address: order.customer.address,
    shipping_method: order.shipping.freeShippingApplied
      ? "Free Shipping"
      : `${order.shipping.method} - ${money(order.shipping.cost)}`,
    orders: order.products
      .map(item => `${item.name} ${item.strength} x ${item.quantity} - ${money(item.lineTotal)}`)
      .join("\n"),
    total: money(order.total)
  }
)
.then(function(response) {
  console.log("Email sent successfully", response);
})
.catch(function(error) {
  console.error("Email failed", error);
});
emailjs.send(
  "service_d1m7eei",
  "template_u8hk7us",
  {
    order_id: order.orderNumber,
     reference: order.payment.reference,
    customer_name: order.customer.fullName,
    email: order.customer.email,
    phone: order.customer.phone,
    address: order.customer.address,
    shipping_method: order.shipping.freeShippingApplied
      ? "Free Shipping"
      : `${order.shipping.method} - ${money(order.shipping.cost)}`,
    orders: order.products
      .map(item => `${item.name} ${item.strength} x ${item.quantity}`)
      .join("\n"),
    total: money(order.total)
  }
)
.then(function(response) {
  console.log("Admin email sent", response);
})
.catch(function(error) {
  console.error("Admin email failed", error);
});
document.querySelector('#checkoutForm')?.classList.add('hidden');
document.querySelector('#checkoutIntro')?.classList.add('hidden');
document.querySelector('.checkout-summary-card')?.classList.add('hidden');

renderOrderConfirmation(order);
localStorage.removeItem('htxCart');
renderCart();
}

function renderOrderConfirmation(order) {
  const box = document.querySelector('#orderConfirmation');
  if (!box) return;

  box.classList.remove('hidden');

  box.innerHTML = `
    <div class="confirmation-card">
      <p class="eyebrow">Order Received</p>
      <h1>Bank Transfer Payment</h1>
      <p class="lead">
        Please use the 8-digit reference below when making your bank transfer.
        Your order will be processed once payment clears.
      </p>

      <div class="bank-details-box">
        <div><span>Order Number</span><b>${order.orderNumber}</b></div>
        <div><span>Order Total</span><b>${money(order.total)}</b></div>
        <div><span>Account Name</span><b>${order.payment.accountName}</b></div>
        <div><span>Account Number</span><b>${order.payment.accountNumber}</b></div>
        <div><span>Reference</span><b>${order.payment.reference}</b></div>
      </div>

      <div class="confirmation-actions">
        <button class="btn wide" type="button" data-copy-payment>Copy Bank Details</button>
        <a class="btn ghost wide" href="mailto:${ORDER_EMAIL}?subject=New Order ${order.orderNumber}&body=${encodeURIComponent(buildEmailBody(order))}">Email Order Details</a>
        <a class="btn ghost wide" href="shop.html">Continue Shopping</a>
      </div>
    </div>
  `;

  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildEmailBody(order) {
  const lines = order.products
    .map(item => `- ${item.name} ${item.strength} x ${item.quantity}: ${money(item.lineTotal)}`)
    .join('\n');

  return `Order Number: ${order.orderNumber}\n\nCustomer:\n${order.customer.fullName}\n${order.customer.email}\n${order.customer.phone}\n${order.customer.address}\n\nProducts:\n${lines}\n\nSubtotal: ${money(order.subtotal)}\nShipping: ${order.shipping.freeShippingApplied ? 'Free Shipping' : `${order.shipping.method} - ${money(order.shipping.cost)}`}\nTotal: ${money(order.total)}\n\nBank Transfer Details:\nAccount Name: ${order.payment.accountName}\nAccount Number: ${order.payment.accountNumber}\nReference: ${order.payment.reference}`;
}

function copyPaymentDetails() {
  const order = JSON.parse(localStorage.getItem('htxLastOrder') || 'null');
  if (!order) return;

  const details = `HTX Peptides NZ Bank Transfer\nOrder Number: ${order.orderNumber}\nAmount Due: ${money(order.total)}\nAccount Name: ${order.payment.accountName}\nAccount Number: ${order.payment.accountNumber}\nReference: ${order.payment.reference}`;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(details).then(() => alert('Bank details copied.'));
  } else {
    alert(details);
  }
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add-product]');
    if (addButton) {
      event.preventDefault();
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

    if (event.target.closest('[data-checkout]')) {
      event.preventDefault();
      goToCheckout();
      return;
    }

    if (event.target.closest('[data-copy-payment]')) {
      event.preventDefault();
      copyPaymentDetails();
    }
  });

  document.addEventListener('change', (event) => {
    const input = event.target.closest('[data-qty-input]');
    if (input) updateQty(input.dataset.qtyInput, input.value);

    if (event.target.closest('input[name="shippingOption"]')) {
      renderCheckoutSummary();
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.closest('#checkoutForm')) renderCheckoutSummary();
    if (event.target.closest('#searchInput') || event.target.closest('#categoryFilter')) renderProducts();
  });

  document.addEventListener('change', (event) => {
    if (event.target.closest('#categoryFilter')) renderProducts();
  });

  const checkoutForm = document.querySelector('#checkoutForm');
  if (checkoutForm) checkoutForm.addEventListener('submit', placeBankOrder);
}

function init() {
  renderProducts();
  renderCart();
  renderCheckoutSummary();
  bindEvents();
}

window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.goToCheckout = goToCheckout;
window.viewProduct = viewProduct;
window.closeModal = closeModal;
window.placeBankOrder = placeBankOrder;

document.addEventListener('DOMContentLoaded', init);
