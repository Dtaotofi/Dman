const PRODUCTS = [
  {id:'reta10', name:'Retatrutide', strength:'10mg', price:149.99, category:'Metabolic Research', image:'assets/retatrutide-10mg.png'},
  {id:'reta15', name:'Retatrutide', strength:'15mg', price:199.99, category:'Metabolic Research', image:'assets/retatrutide-15mg.png'},
  {id:'reta20', name:'Retatrutide', strength:'20mg', price:249.99, category:'Metabolic Research', image:'assets/retatrutide-20mg.png'},
  {id:'cjcipa10', name:'CJC-1295 N/D + Ipamorelin', strength:'10mg', price:119.99, category:'GH Research', image:'assets/cjc-ipa-10mg.png'},
  {id:'bpctb20', name:'BPC-157 + TB-500', strength:'10mg + 10mg', price:119.99, category:'Recovery Research', image:'assets/bpc-tb-20mg.png'},
  {id:'klow80', name:'KLOW', strength:'80mg', price:179.99, category:'Multi Peptide Blend', image:'assets/klow-80mg.png'},
  {id:'mots10', name:'MOTS-C', strength:'10mg', price:99.99, category:'Cellular Research', image:'assets/mots-c-10mg.png'},
  {id:'igf1', name:'IGF-1 LR3', strength:'1mg', price:119.99, category:'GH Research', image:'assets/igf-1-lr3-1mg.png'},
  {id:'bac3', name:'BAC Water', strength:'3ml', price:19.99, category:'Ancillary', image:'assets/bac-water-3ml.png'},
  {id:'bac10', name:'BAC Water', strength:'10ml', price:29.99, category:'Ancillary', image:'assets/bac-water-10ml.png'}
];

const WA_NUMBER = '64273211748';

const money = n => `$${Number(n).toFixed(2)} NZD`;
const getCart = () => JSON.parse(localStorage.getItem('htxCart') || '{}');
const productById = id => PRODUCTS.find(p => p.id === id);

function setCart(cart){
  localStorage.setItem('htxCart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id, qty = 1){
  const cart = getCart();
  cart[id] = (cart[id] || 0) + Number(qty);
  setCart(cart);
  openCart();
}

function removeFromCart(id){
  const cart = getCart();
  delete cart[id];
  setCart(cart);
}

function updateQty(id, qty){
  const cart = getCart();
  qty = Number(qty);
  if(qty <= 0) delete cart[id];
  else cart[id] = qty;
  setCart(cart);
}

function cartItems(){
  const cart = getCart();
  return Object.entries(cart)
    .map(([id, qty]) => ({...productById(id), qty}))
    .filter(item => item.id);
}

function cartTotal(){
  return cartItems().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartUI(){
  const count = cartItems().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);

  const box = document.querySelector('#cartItems');
  if(!box) return;

  const items = cartItems();
  box.innerHTML = items.length ? items.map(item => `
    <div class="cart-line">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <b>${item.name}</b>
        <span>${item.strength} • ${money(item.price)}</span>
        <div class="qty">
          <button onclick="updateQty('${item.id}', ${item.qty - 1})">−</button>
          <input value="${item.qty}" onchange="updateQty('${item.id}', this.value)">
          <button onclick="updateQty('${item.id}', ${item.qty + 1})">+</button>
        </div>
      </div>
      <button class="icon-btn" onclick="removeFromCart('${item.id}')">×</button>
    </div>
  `).join('') : '<p class="muted">Your cart is empty.</p>';

  const subtotal = document.querySelector('#cartSubtotal');
  if(subtotal) subtotal.textContent = money(cartTotal());
}

function openCart(){
  document.body.classList.add('cart-open');
  updateCartUI();
}

function closeCart(){
  document.body.classList.remove('cart-open');
}

function checkoutWhatsApp(){
  const items = cartItems();
  if(!items.length) return alert('Your cart is empty.');

  const paymentMethod = document.querySelector('#paymentMethod')?.value || 'Bank Transfer';
  const orderRef = 'HTX-' + Date.now().toString().slice(-6);
  const lines = items.map(item => `• ${item.name} ${item.strength} x ${item.qty} — ${money(item.price * item.qty)}`).join('\\n');

  let paymentText = '';
  if(paymentMethod === 'Bank Transfer'){
    paymentText = `\\n\\nPayment Method: Bank Transfer\\nReference: ${orderRef}\\n\\nPlease send bank transfer details so I can pay with the reference above.`;
  } else {
    paymentText = `\\n\\nPayment Method: Card Payment Link\\nReference: ${orderRef}\\n\\nPlease send me a secure card payment link for this order.`;
  }

  const msg = `Hi HTX Peptides, I’d like to place an order:\\n${lines}\\n\\nSubtotal: ${money(cartTotal())}${paymentText}\\n\\nName:\\nDelivery address:`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

function productCard(product){
  const home = document.body.classList.contains('home-page');

  if(home){
    return `
      <article class="product-card exact-stock-card" data-cat="${product.category}">
        <div class="stock-img">
          <img src="${product.image}" alt="${product.name} ${product.strength}">
        </div>
        <div class="stock-info">
          <small>${product.category}</small>
          <h3>${product.name}</h3>
          <p>${product.strength} • Research Use Only</p>
          <b>${money(product.price)}</b>
          <div class="product-actions stock-actions">
            <button onclick="viewProduct('${product.id}')" class="btn ghost">View Product</button>
            <button onclick="addToCart('${product.id}')" class="btn">Add</button>
          </div>
        </div>
      </article>
    `;
  }

  return `
    <article class="product-card" data-cat="${product.category}">
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name} ${product.strength}">
      </div>
      <div class="product-info">
        <small>${product.category}</small>
        <h3>${product.name}</h3>
        <p>${product.strength}</p>
        <b>${money(product.price)}</b>
        <div class="product-actions">
          <button onclick="viewProduct('${product.id}')" class="btn ghost">View Product</button>
          <button onclick="addToCart('${product.id}')" class="btn">Add</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(limit){
  const grid = document.querySelector('#productGrid');
  if(!grid) return;

  const selected = PRODUCTS.slice(0, limit || PRODUCTS.length);
  grid.innerHTML = selected.map(productCard).join('');
}

function filterProducts(){
  const q = (document.querySelector('#searchInput')?.value || '').toLowerCase();
  const cat = document.querySelector('#categoryFilter')?.value || 'all';
  const grid = document.querySelector('#productGrid');
  if(!grid) return;

  const filtered = PRODUCTS.filter(product => {
    const matchesCategory = cat === 'all' || product.category === cat;
    const searchable = `${product.name} ${product.strength} ${product.category}`.toLowerCase();
    return matchesCategory && searchable.includes(q);
  });

  grid.innerHTML = filtered.length ? filtered.map(productCard).join('') : '<p class="muted">No products found.</p>';
}

function viewProduct(id){
  const product = productById(id);
  const modal = document.querySelector('#productModal');
  if(!product || !modal) return;

  modal.innerHTML = `
    <div class="modal-card">
      <button class="modal-close" onclick="closeModal()">×</button>
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
          <div class="qty big">
            <button onclick="this.nextElementSibling.stepDown()">−</button>
            <input id="modalQty" type="number" value="1" min="1">
            <button onclick="this.previousElementSibling.stepUp()">+</button>
          </div>
          <button class="btn wide" onclick="addToCart('${product.id}', document.querySelector('#modalQty').value); closeModal();">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('show');
}

function closeModal(){
  document.querySelector('#productModal')?.classList.remove('show');
}

function init(){
  renderProducts(Number(document.body.dataset.limit));
  updateCartUI();
  document.querySelector('#searchInput')?.addEventListener('input', filterProducts);
  document.querySelector('#categoryFilter')?.addEventListener('change', filterProducts);
}

document.addEventListener('DOMContentLoaded', init);
