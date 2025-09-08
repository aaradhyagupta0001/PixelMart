// fetch products from backend
async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    showToast('Failed to load products');
    console.error(err);
  }
}

const productsEl = document.getElementById('products');
const cartBtn = document.getElementById('cartBtn');
const cartPanel = document.getElementById('cartPanel');
const cartItemsEl = document.getElementById('cartItems');
const totalPriceEl = document.getElementById('totalPrice');
const cartCountEl = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

let cart = [];

// render
function renderProducts(list) {
  productsEl.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <div class="price">₹${p.price}</div>
      <div class="actions">
        <button class="addBtn" data-id="${p.id}">Add</button>
        <button class="infoBtn" data-id="${p.id}">Info</button>
      </div>
    `;
    productsEl.appendChild(card);
  });
}

// add to cart (delegation)
productsEl.addEventListener('click', (e) => {
  if (e.target.matches('.addBtn')) {
    const id = Number(e.target.dataset.id);
    addToCart(id);
  } else if (e.target.matches('.infoBtn')) {
    const id = Number(e.target.dataset.id);
    showToast('Product info coming soon 😉');
  }
});

// add item
function addToCart(id) {
  fetch('/api/products').then(r=>r.json()).then(list=>{
    const p = list.find(x=>x.id===id);
    if(!p) return;
    const exists = cart.find(c=>c.id===id);
    if (exists) exists.qty++;
    else cart.push({...p, qty:1});
    updateCartUI();
    showToast(`${p.name} added to cart ✨`);
  });
}

function updateCartUI() {
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name} x${item.qty}</span>
      <div>
        <button class="qtyMinus" data-id="${item.id}">-</button>
        <button class="qtyPlus" data-id="${item.id}">+</button>
        <span>₹${item.price * item.qty}</span>
      </div>
    `;
    cartItemsEl.appendChild(li);
  });
  totalPriceEl.textContent = total;
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

// qty controls (delegation)
cartItemsEl.addEventListener('click', (e) => {
  if (e.target.matches('.qtyPlus')) {
    const id = Number(e.target.dataset.id);
    const it = cart.find(c=>c.id===id); if (it) it.qty++;
    updateCartUI();
  } else if (e.target.matches('.qtyMinus')) {
    const id = Number(e.target.dataset.id);
    const it = cart.find(c=>c.id===id); if (it) { it.qty--; if(it.qty<=0) cart = cart.filter(x=>x.id!==id); }
    updateCartUI();
  }
});

// cart panel toggle
cartBtn.addEventListener('click', () => cartPanel.classList.toggle('open'));

// clear cart
clearCartBtn && clearCartBtn.addEventListener('click', () => { cart=[]; updateCartUI(); showToast('Cart cleared'); });

// checkout (dummy)
checkoutBtn && checkoutBtn.addEventListener('click', async () => {
  if (cart.length === 0) return showToast('Cart is empty');
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ cart })
    });
    const data = await res.json();
    if (data && data.success) {
      showToast('Order placed! ID: ' + data.orderId);
      cart = []; updateCartUI(); cartPanel.classList.remove('open');
    } else {
      showToast('Checkout failed');
    }
  } catch (err) {
    console.error(err); showToast('Checkout error');
  }
});

// toast
function showToast(text) {
  const t = document.getElementById('toast');
  t.textContent = text; t.style.display='block';
  setTimeout(()=> t.style.display='none', 1800);
}

// init
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});
