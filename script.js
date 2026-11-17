// - 1. DATA & STATE -
const flowerProducts = [
    {
        id: 1,
        name: "Red Rose Bouquet",
        price: 15.00,
        rating: 5,
        image: "assets/images/redrose.jpg",
        category: "flowers"
    },
    {
        id: 2,
        name: "Cheerful Sunflowers",
        price: 8.50,
        rating: 4,
        image: "assets/images/sunflowers.jpg",
        category: "flowers"
    },
    {
        id: 3,
        name: "Elegant White Tulips",
        price: 12.00,
        rating: 5,
        image: "assets/images/white-falcon-flowers.jpg",
        category: "flowers"
    },
    {
        id: 4,
        name: "Salvo Premium Bouquet",
        price: 20.00,
        rating: 4,
        image: "assets/images/salvo-flowers.jpg",
        category: "gifts"
    },
    {
        id: 5,
        name: "Luxury Gift Box",
        price: 35.00,
        rating: 5,
        image: "assets/images/salvo-flowers.jpg",
        category: "gifts"
    },
    {
        id: 6,
        name: "Romantic Promo Bundle",
        price: 25.00,
        rating: 5,
        image: "assets/images/redrose.jpg",
        category: "promo"
    }
];

let cart = JSON.parse(localStorage.getItem('bloomcart_data')) || [];
let currentCategory = 'all';
let currentUser = JSON.parse(localStorage.getItem('bloomcart_user')) || null;
let isDarkMode = JSON.parse(localStorage.getItem('bloomcart_darkmode')) || false;

// - 2. DOM ELEMENTS -
const productListEl = document.getElementById('product-list');
const searchInput = document.getElementById('search-input');
const noResultEl = document.getElementById('no-result');
const menuBtn = document.getElementById('menu-btn');
const navbar = document.getElementById('navbar');

// Hero Elements
const heroTitle = document.getElementById('hero-title');
const heroDesc = document.getElementById('hero-desc');
const sectionTitle = document.getElementById('section-title');

// Cart Drawer Elements
const cartBtn = document.getElementById('cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const closeCartBtn = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartCountEl = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPriceEl = document.getElementById('cart-total-price');
const btnCheckout = document.getElementById('btn-checkout');
const toastContainer = document.getElementById('toast-container');

// Checkout Modal Elements
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutBtn = document.getElementById('close-checkout');
const checkoutTotalPriceEl = document.getElementById('checkout-total-price');
const paymentForm = document.getElementById('payment-form');

// Dark Mode and Profile
const userBtn = document.getElementById('user-btn');
const userNameDisplay = document.getElementById('user-name-display');
const loginModal = document.getElementById('login-modal');
const closeLoginBtn = document.getElementById('close-login');
const loginForm = document.getElementById('login-form');
const userPanelModal = document.getElementById('user-panel-modal');
const closeUserPanelBtn = document.getElementById('close-user-panel');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const btnLogout = document.getElementById('btn-logout');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// - 3. UTILITY FUNCTIONS -
// Function to format numbers as USD
function formatUSD(number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(number);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2500);
}

// - 4. NAVIGATION & RENDERING LOGIC -
window.filterByCategory = function(category) {
    currentCategory = category;
    
    if (category === 'all') {
        heroTitle.textContent = "Give a Smile with Flowers";
        heroDesc.textContent = "Fresh bouquet collections and special gifts for your loved ones.";
        sectionTitle.textContent = "Product Catalog";
    } else if (category === 'flowers') {
        heroTitle.textContent = "Fresh Flower Collection";
        heroDesc.textContent = "Beautifully crafted bouquets for every occasion.";
        sectionTitle.textContent = "Flowers";
    } else if (category === 'gifts') {
        heroTitle.textContent = "Special Gifts";
        heroDesc.textContent = "Find the perfect gift to accompany your flowers.";
        sectionTitle.textContent = "Gift Collections";
    } else if (category === 'promo') {
        heroTitle.textContent = "Hot Promos!";
        heroDesc.textContent = "Grab our best deals before they're gone.";
        sectionTitle.textContent = "Promo Bundles";
    }

    navbar.classList.remove('active');

    const filteredProducts = category === 'all' 
        ? flowerProducts 
        : flowerProducts.filter(p => p.category === category);
        
    renderProducts(filteredProducts);
};

function renderProducts(data) {
    productListEl.innerHTML = '';

    if (data.length === 0) {
        noResultEl.classList.remove('hidden');
        return;
    }
    noResultEl.classList.add('hidden');

    data.forEach(product => {
        let stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);

        const cardHTML = `
            <article class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">${stars}</div>
                    <div class="product-price">${formatUSD(product.price)}</div>
                    <button class="btn-add" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </article>
        `;
        productListEl.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// - 5. CART LOGIC -
function updateCartState() {
    localStorage.setItem('bloomcart_data', JSON.stringify(cart));
    
    let totalItems = 0;
    cart.forEach(item => totalItems += item.qty);
    cartCountEl.textContent = totalItems;

    renderCartItems();
}

window.addToCart = function(productId) {
    const product = flowerProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartState();
    showToast(`${product.name} added to cart!`);
    openCart();
};

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#777; margin-top:20px;">Your cart is empty.</p>';
        cartTotalPriceEl.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        totalPrice += item.price * item.qty;

        const itemHTML = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatUSD(item.price)}</div>
                    <div class="cart-item-actions">
                        <button class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
                        <button class="btn-delete" onclick="removeItem(${item.id})">&times;</button>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    cartTotalPriceEl.textContent = formatUSD(totalPrice);
}

window.changeQty = function(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += change;
    
    if (item.qty <= 0) {
        removeItem(productId);
    } else {
        updateCartState();
    }
};

window.removeItem = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartState();
};

// - 6. UI TOGGLES (CART & CHECKOUT) -
function openCart() {
    cartDrawer.classList.add('active');
    overlay.classList.add('active');
}
function closeCart() {
    cartDrawer.classList.remove('active');
    overlay.classList.remove('active');
}

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

btnCheckout.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast("Your cart is empty. Add some items first!");
        return;
    }
    
    let totalPrice = 0;
    cart.forEach(item => totalPrice += item.price * item.qty);
    
    checkoutTotalPriceEl.textContent = formatUSD(totalPrice);
    
    closeCart();
    checkoutModal.classList.add('active');
});

closeCheckoutBtn.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
});

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const submitBtn = document.querySelector('.btn-submit-payment');
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
        paymentForm.reset();
        cart = [];
        updateCartState();
        
        submitBtn.textContent = 'Confirm Payment';
        submitBtn.disabled = false;
        
        checkoutModal.classList.remove('active');
        showToast("Transaction Successful! Thank you for shopping.");
    }, 1500); 
});

// - 7. SEARCH & MOBILE MENU -
menuBtn.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

const processSearch = debounce((keyword) => {
    const baseData = currentCategory === 'all' 
        ? flowerProducts 
        : flowerProducts.filter(p => p.category === currentCategory);
        
    const result = baseData.filter(p => 
        p.name.toLowerCase().includes(keyword.toLowerCase())
    );
    
    renderProducts(result);
}, 300);

searchInput.addEventListener('input', (e) => {
    processSearch(e.target.value);
});

// - 8. AUTHENTICATION & SETTINGS LOGIC -
function updateAuthUI() {
    if (currentUser) {
        userNameDisplay.textContent = currentUser.name.split(' ')[0]; 
        userNameDisplay.classList.remove('hidden');
        profileName.textContent = currentUser.name;
        profileEmail.textContent = currentUser.email;
        btnLogout.style.display = 'block';
    } else {
        userNameDisplay.classList.add('hidden');
        profileName.textContent = 'Guest User';
        profileEmail.textContent = 'Not logged in';
        btnLogout.style.display = 'none';
    }
}

function applyDarkMode() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        darkModeToggle.checked = false;
    }
}

userBtn.addEventListener('click', () => {
    if (currentUser) {
        userPanelModal.classList.add('active');
    } else {
        loginModal.classList.add('active');
    }
});

closeLoginBtn.addEventListener('click', () => loginModal.classList.remove('active'));
closeUserPanelBtn.addEventListener('click', () => userPanelModal.classList.remove('active'));

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    
    const userName = email.split('@')[0]; 
    currentUser = { name: userName.charAt(0).toUpperCase() + userName.slice(1), email: email };
    
    localStorage.setItem('bloomcart_user', JSON.stringify(currentUser));
    
    loginForm.reset();
    loginModal.classList.remove('active');
    updateAuthUI();
    showToast(`Welcome, ${currentUser.name}!`);
});

btnLogout.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('bloomcart_user');
    userPanelModal.classList.remove('active');
    updateAuthUI();
    showToast("You have been logged out.");
});

darkModeToggle.addEventListener('change', (e) => {
    isDarkMode = e.target.checked;
    localStorage.setItem('bloomcart_darkmode', JSON.stringify(isDarkMode));
    applyDarkMode();
});

// - 9. INITIALIZATION -
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(flowerProducts);
    
    if (cart.length > 0) {
        updateCartState(); 
    }

    // Load auth and theme state on refresh
    updateAuthUI();
    applyDarkMode();
});