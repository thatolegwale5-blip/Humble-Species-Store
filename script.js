// Basic cart (localStorage-backed)
const addBtns = document.querySelectorAll('.add-to-cart');
const cartToggle = document.getElementById('cart-toggle');
const cartEl = document.getElementById('cart');
const cartClose = document.getElementById('cart-close');
const overlay = document.getElementById('overlay');
const cartItemsWrap = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const payfastBtn = document.getElementById('payfast-btn');
const checkoutBtn = document.getElementById('checkout-btn');

let cart = JSON.parse(localStorage.getItem('hs_cart') || '[]');

function saveCart() {
  localStorage.setItem('hs_cart', JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  cartItemsWrap.innerHTML = '';
  let total = 0;
  let count = 0;
  cart.forEach((item, i) => {
    total += item.price * item.qty;
    count += item.qty;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="item-meta">
        <h4>${item.name}</h4>
        <div class="qty-controls">
          <button data-i="${i}" class="dec">-</button>
          <span>${item.qty}</span>
          <button data-i="${i}" class="inc">+</button>
          <span style="margin-left:10px;font-weight:700">R${(item.price*item.qty).toFixed(2)}</span>
        </div>
      </div>
      <button data-i="${i}" class="remove">✕</button>
    `;
    cartItemsWrap.appendChild(el);
  });

  cartCount.innerText = count;
  cartTotalEl.innerText = `R${total.toFixed(2)}`;

  // attach controls
  document.querySelectorAll('.inc').forEach(b => b.addEventListener('click', e => {
    const i = +e.target.dataset.i; cart[i].qty++; saveCart();
  }));
  document.querySelectorAll('.dec').forEach(b => b.addEventListener('click', e => {
    const i = +e.target.dataset.i; if(cart[i].qty>1) cart[i].qty--; else cart.splice(i,1); saveCart();
  }));
  document.querySelectorAll('.remove').forEach(b => b.addEventListener('click', e => {
    const i = +e.target.dataset.i; cart.splice(i,1); saveCart();
  }));
}

function openCart() {
  cartEl.classList.add('open');
  overlay.classList.add('show');
}
function closeCart() {
  cartEl.classList.remove('open');
  overlay.classList.remove('show');
}

addBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const product = e.target.closest('.product');
    const id = product.dataset.id;
    const name = product.dataset.name;
    const price = Number(product.dataset.price);
    const img = product.querySelector('img').src;
    const existing = cart.find(i => i.id === id);
    if(existing) existing.qty++;
    else cart.push({id,name,price,qty:1,img});
    saveCart();
    openCart();
  });
});

cartToggle.addEventListener('click', openCart);
cartClose?.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

renderCart();

// PayFast button action (simple redirect)
payfastBtn.addEventListener('click', () => {
  if (cart.length === 0) { alert('Cart is empty'); return; }
  const total = cart.reduce((s,i) => s + i.price*i.qty, 0).toFixed(2);

  // Replace MERCHANT_ID with your PayFast receiver id
  const merchantId = 'MERCHANT_ID';

  // PayFast link format (example)
  const itemName = encodeURIComponent('Humble Species order');
  const payfastUrl = `https://www.payfast.co.za/eng/process?cmd=_paynow&receiver=${merchantId}&amount=${total}&item_name=${itemName}`;

  // Redirect user to PayFast checkout
  window.location.href = payfastUrl;
});

// Checkout (placeholder for card on-site in future)
checkoutBtn.addEventListener('click', () => {
  alert('On-site card checkout can be added later. For now, use PayFast to pay by card.');
});
