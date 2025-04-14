// Mock product data
const products = [
  {
    id: 1,
    name: "Laptop",
    category: "electronics",
    price: 999,
    description: "High-performance laptop",
    image: "laptop.jpg",
  },
  {
    id: 2,
    name: "T-shirt",
    category: "clothing",
    price: 19,
    description: "Comfortable cotton t-shirt",
    image: "tshirt.jpg",
  },
  {
    id: 3,
    name: "Notebook",
    category: "books",
    price: 7.99,
    description: "Latest books with a variety of genres",
    image: "notebook.jpg",
  },
];

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Utility: Get DOM element safely
function $(selector) {
  return document.querySelector(selector);
}

// Render Products
function renderProducts(query = "") {
  const searchValue = query.toLowerCase();
  const categoryValue = $("#category-filter")?.value || "";
  const sortValue = $("#sort-filter")?.value || "";

  let filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchValue) &&
      (categoryValue ? p.category === categoryValue : true)
  );

  if (sortValue === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  const grid = $("#product-grid");
  if (!grid) return;

  grid.innerHTML = "";
  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>$${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

// Add to Cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Update cart item count in header
function updateCartCount() {
  const countSpans = document.querySelectorAll("#cart-count");
  countSpans.forEach((span) => (span.textContent = cart.length));
}

// Render Cart on Cart Page
function renderCart() {
  const container = $("#cart-items");
  const totalEl = $("#total-price");
  if (!container || !totalEl) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - $${item.price.toFixed(2)}
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    container.appendChild(li);
  });

  totalEl.textContent = `$${total.toFixed(2)}`;
}

// Remove from Cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Checkout Submit
const checkoutForm = $("#checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert(
        "Your cart is empty. Please add items to the cart before checkout."
      );
      return;
    }
    alert("Order placed successfully!");
    localStorage.removeItem("cart");
    cart = [];
    updateCartCount();
    renderCart();
    window.location.href = "index.html";
  });
}

// Event Listeners on DOM Load
window.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  updateCartCount();

  const checkoutBtn = $("#checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty. Add items before proceeding to checkout.");
      } else {
        window.location.href = "checkout.html";
      }
    });
  }

  const searchInput = $("#search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () =>
      renderProducts(searchInput.value)
    );
  }

  const categoryFilter = $("#category-filter");
  const sortFilter = $("#sort-filter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () =>
      renderProducts(searchInput?.value || "")
    );
  }
  if (sortFilter) {
    sortFilter.addEventListener("change", () =>
      renderProducts(searchInput?.value || "")
    );
  }
});
