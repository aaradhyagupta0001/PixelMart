// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

const cart = [];

// Fetch products
fetch('/api/products')
  .then(res => res.json())
  .then(products => {
    productsContainer.innerHTML = '';
    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-img"/>
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button class="add-to-cart">Add to Cart 🛒</button>
      `;
      productsContainer.appendChild(card);
    });
  })
  .catch(err => {
    productsContainer.innerHTML = '<p style="color:red;">Failed to load products 😢</p>';
    console.error(err);
  });

// Update cart UI
function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const li = document.createElement('li');
    li.textContent = `${item.name} - ₹${item.price}`;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = total;
}

// Add to cart button
document.addEventListener('click', function(e) {
  if(e.target.classList.contains('add-to-cart')) {
    const card = e.target.closest('.product-card');
    const name = card.querySelector('h3').textContent;
    const price = parseInt(card.querySelector('p').textContent.replace('₹',''));
    cart.push({ name, price });
    updateCart();
  }
});

// Checkout
document.getElementById('checkout').addEventListener('click', () => {
  alert(`Checkout successful! Total: ₹${cart.reduce((sum, item) => sum + item.price, 0)}`);
  cart.length = 0;
  updateCart();
});
