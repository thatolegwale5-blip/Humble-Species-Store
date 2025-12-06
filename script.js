/* ============================
   HUMBLE SPECIES SHOP SCRIPT
   Fully Synced With Your HTML + CSS
============================ */

// Elements
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

// Cart data
let cart = JSON.parse(localStorage.getItem('hs_cart') || '[]');

// Color → image map (matches your real image filenames)
const colorMap = {
  black: {
    front: "HUMBLE SPECIES/humble-species/images/humble-species-hoodie.jpg",
    back: "HUMBLE SPECIES/humble-species/images/hoodie-back.jpg"
  },
  white: {
    front: "HUMBLE SPECIES/humble-species/images/humble-species-hoodie.jpg",
    back: "HUMBLE SPECIES/humble-species/images/hoodie-back.jpg"
  },
  red: {
    front: "HUMBLE SPECIES/humble-species/images/red-humble-species-hoodie.jpg",
    back: "HUMBLE SPECIES/humble-species/images/hoodie-back.jpg"
  },
  blue: {
    front: "HUMBLE SPECIES/humble-species/images/humble-species-hoodie.jpg",
    back: "HUMBLE SPECIES/humble-species/images/hoodie-back.jpg"
  },
  // Jorts color images
  jorts: {
    black: "HUMBLE SPECIES/humble-species/images/jorts-black.jpg",
    brown: "HUMBLE SPECIES/humble-species/images/jorts-brown.jpg"
  },
  // CAP IMAGES
  cap_black: {
    front: "HUMBLE SPECIES/humble-species/images/panel-cap-black.jpg",
    back: "HUMBLE SPECIES/humble-species/images/panel-cap-red.jpg"
  },
  cap_red: {
    front: "HUMBLE SPECIES/humble-species/images/panel-cap-red.jpg",
    back: "HUMBLE SPECIES/humble-species/images/panel-cap-black.jpg"
  }
};

/* ============================
   IMAGE MODAL HANDLING
   Clicking a product image opens a modal showing the image
   and available color dots (no flip). Color dots in modal
   change the modal image using the same mapping logic.
============================ */
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');
const modalColors = document.getElementById('modal-colors');

function getMappedImage(productId, color, side = 'front'){
  if (!color) return null;
  if (productId === 'hoodie1'){
    const map = colorMap[color];
    if (!map) return null;
    return side === 'back' ? map.back : map.front;
  }
  if (productId === 'jorts1'){
    const map = colorMap.jorts;
    return map && map[color] ? map[color] : null;
  }
  if (productId === 'cap1'){
    const key = color === 'red' ? 'cap_red' : 'cap_black';
    const map = colorMap[key];
    if (!map) return null;
    return side === 'back' ? (map.back || map.front) : map.front;
  }
  // no mapping available
  return null;
}

function openImageModal(product){
  const pid = product.dataset.id;
  const front = product.querySelector('.front-img');
  const currentSrc = front ? front.src : '';
  modalImg.src = currentSrc;

  // build color dots in modal based on product color-options if present
  modalColors.innerHTML = '';
  const opts = product.querySelector('.color-options');
  if (opts){
    opts.querySelectorAll('.color-dot').forEach(d => {
      const clone = d.cloneNode(true);
      clone.addEventListener('click', () => {
        const color = clone.dataset.color;
        // try to get mapped image
        const mapped = getMappedImage(pid, color, 'front');
        if (mapped) modalImg.src = mapped;
        // visually mark active
        modalColors.querySelectorAll('.color-dot').forEach(x=>x.classList.remove('active-color'));
        clone.classList.add('active-color');
      });
      modalColors.appendChild(clone);
    });
  }

  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
}

function closeImageModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
  modalImg.src = '';
  modalColors.innerHTML = '';
}

// attach click to each product front image
document.querySelectorAll('.product .front-img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', e => {
    const product = img.closest('.product');
    openImageModal(product);
  });
});

modalClose && modalClose.addEventListener('click', closeImageModal);
modal && modal.addEventListener('click', e => {
  if (e.target === modal) closeImageModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeImageModal(); });

/* ============================
   INITIALIZE PRODUCTS
============================ */
document.querySelectorAll('.product').forEach(product => {
  const dots = product.querySelectorAll('.color-dot');
  const sizeSelect = product.querySelector('.size-select');

  // default color
  if (dots.length) {
    const defaultDot = dots[0];
    defaultDot.classList.add('active-color');
    product.dataset.selectedColor = defaultDot.dataset.color;
  }

  // default size
  if (sizeSelect) {
    product.dataset.selectedSize = sizeSelect.value;
    sizeSelect.addEventListener('change', e => {
      product.dataset.selectedSize = e.target.value;
    });
  }
});

/* ============================
   COLOR CHANGE HANDLING
============================ */
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const product = dot.closest('.product');
    const color = dot.dataset.color;

    // UI highlight
    product.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active-color'));
    dot.classList.add('active-color');
    product.dataset.selectedColor = color;

    const front = product.querySelector('.front-img');
    const back = product.querySelector('.back-img');

    // hoodie colors
    if (product.dataset.id === "hoodie1") {
      const map = colorMap[color];
      if (map) {
        front.src = map.front;
        back.src = map.back;
      }
    }

      // jorts color handling
      if (product.dataset.id === "jorts1") {
        const map = colorMap.jorts;
        if (map && map[color]) {
          front.src = map[color];
          // if there's no separate back view, keep back the same as front
          if (back) back.src = map[color];
        }
      }

    // cap colors
    if (product.dataset.id === "cap1") {
      const key = color === "red" ? "cap_red" : "cap_black";
      const map = colorMap[key];
      if (map) {
        front.src = map.front;
        back.src = map.back;
      }
    }
  });
});

/* ============================
   SAVE & RENDER CART
============================ */
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

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.img}" alt="">
      <div class="item-meta">
        <h4>${item.name}</h4>
        <div class="qty-controls">
          <button class="dec" data-i="${i}">-</button>
          <span>${item.qty}</span>
          <button class="inc" data-i="${i}">+</button>
          <span style="margin-left:10px;font-weight:700">R${(item.qty * item.price).toFixed(2)}</span>
        </div>
      </div>
      <button class="remove" data-i="${i}">✕</button>
    `;
    cartItemsWrap.appendChild(row);
  });

  cartCount.textContent = count;
  cartTotalEl.textContent = `R${total.toFixed(2)}`;

  // attach events
  document.querySelectorAll('.inc').forEach(b => {
    b.onclick = e => {
      const i = +e.target.dataset.i;
      cart[i].qty++;
      saveCart();
    };
  });

  document.querySelectorAll('.dec').forEach(b => {
    b.onclick = e => {
      const i = +e.target.dataset.i;
      if (cart[i].qty > 1) cart[i].qty--;
      else cart.splice(i, 1);
      saveCart();
    };
  });

  document.querySelectorAll('.remove').forEach(b => {
    b.onclick = e => {
      const i = +e.target.dataset.i;
      cart.splice(i, 1);
      saveCart();
    };
  });
}

/* ============================
   CART OPEN/CLOSE
============================ */
function openCart() {
  cartEl.classList.add('open');
  overlay.classList.add('show');
}
function closeCart() {
  cartEl.classList.remove('open');
  overlay.classList.remove('show');
}

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

/* ============================
   ADD TO CART
============================ */
addBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const product = e.target.closest('.product');

    const id = product.dataset.id;
    const baseName = product.dataset.name;
    const price = Number(product.dataset.price);

    const img = product.querySelector('.front-img').src;
    const color = product.dataset.selectedColor || null;
    const size = product.dataset.selectedSize || null;

    const itemId = `${id}::${color || ''}::${size || ''}`;

    let displayName = baseName;
    if (color) displayName += ` (${color})`;
    if (size) displayName += ` - ${size}`;

    const existing = cart.find(i => i.itemId === itemId);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        itemId,
        name: displayName,
        price,
        qty: 1,
        img,
        color,
        size
      });
    }

    saveCart();
    openCart();
  });
});

/* ============================
   INITIAL RENDER
============================ */
renderCart();

/* ============================
   PAYFAST
============================ */
payfastBtn.addEventListener('click', () => {
  if (cart.length < 1) return alert("Your cart is empty");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);

  const merchantId = "MERCHANT_ID"; // Replace with your real PayFast ID

  window.location.href =
    `https://www.payfast.co.za/eng/process?cmd=_paynow&receiver=${merchantId}&amount=${total}&item_name=Humble%20Species%20Order`;
});

/* ============================
   CHECKOUT PLACEHOLDER
============================ */
checkoutBtn.addEventListener('click', () => {
  alert("On-site card checkout coming soon. Use PayFast for now.");
});
