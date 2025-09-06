// Product data
const products = [
    { id: 1, name: "iPhone 15 Pro", price: 999, category: "phones", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=📱", rating: 5, reviews: 234 },
    { id: 2, name: "MacBook Pro M3", price: 1999, category: "laptops", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=💻", rating: 5, reviews: 156 },
    { id: 3, name: "AirPods Pro", price: 249, category: "accessories", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=🎧", rating: 4, reviews: 89 },
    { id: 4, name: "Samsung Galaxy S24", price: 899, category: "phones", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=📱", rating: 4, reviews: 167 },
    { id: 5, name: "Dell XPS 13", price: 1299, category: "laptops", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=💻", rating: 4, reviews: 98 },
    { id: 6, name: "Apple Watch Ultra", price: 799, category: "accessories", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=⌚", rating: 5, reviews: 145 },
    { id: 7, name: "iPad Pro", price: 1099, category: "accessories", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=📱", rating: 5, reviews: 203 },
    { id: 8, name: "Surface Laptop", price: 1199, category: "laptops", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=💻", rating: 4, reviews: 76 }
];

const trendingProducts = [
    { id: 1, name: "iPhone 15 Pro", price: 999, category: "phones", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=📱", rating: 5, reviews: 234 },
    { id: 2, name: "MacBook Pro M3", price: 1999, category: "laptops", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=💻", rating: 5, reviews: 156 },
    { id: 3, name: "AirPods Pro", price: 249, category: "accessories", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=🎧", rating: 4, reviews: 89 },
    { id: 6, name: "Apple Watch Ultra", price: 799, category: "accessories", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=⌚", rating: 5, reviews: 145 },
    { id: 7, name: "iPad Pro", price: 1099, category: "accessories", image: "https://placehold.co/150x150/e0e7ff/4338ca?text=📱", rating: 5, reviews: 203 },
];

let cart = [];
let currentFilter = 'all';

// Custom Message Box
function showMessage(message, type = 'success') {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    messageText.textContent = message;
    messageBox.className = `fixed top-0 left-1/2 -translate-x-1/2 mt-4 p-4 rounded-lg shadow-xl text-center z-50 message-box`;
    if (type === 'success') {
        messageBox.classList.add('bg-green-500');
    } else if (type === 'error') {
        messageBox.classList.add('bg-red-500');
    } else {
        messageBox.classList.add('bg-blue-500');
    }
    messageBox.classList.remove('hidden');
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
}

// Display product cards
function createProductCard(product) {
    return `
        <div class="bg-white p-6 rounded-2xl shadow-lg card-hover flex flex-col items-center text-center product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="w-24 h-24 mb-4 rounded-lg" onerror="this.onerror=null;this.src='https://placehold.co/150x150/e0e7ff/4338ca?text=Image';" />
            <h3 class="text-lg font-semibold mb-1">${product.name}</h3>
            <div class="flex items-center mb-2">
                <span class="star-rating text-sm text-yellow-400">
                    ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}
                </span>
                <span class="text-xs text-gray-500 ml-2">(${product.reviews})</span>
            </div>
            <span class="text-xl font-bold text-blue-600 mb-4">$${product.price}</span>
            <button class="add-to-cart-btn w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-full transition-colors hover:bg-blue-600">
                Add to Cart
            </button>
        </div>
    `;
}

function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    const filteredProducts = currentFilter === 'all' ? products : products.filter(p => p.category === currentFilter);
    productGrid.innerHTML = filteredProducts.map(createProductCard).join('');
}

function displayTrendingProducts() {
    const trendingGrid = document.getElementById('trendingGrid');
    trendingGrid.innerHTML = trendingProducts.map(createProductCard).join('');
}

// Filter products and update UI
function filterProducts(category) {
    currentFilter = category;
    displayProducts();
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'hover:bg-blue-700');
        btn.classList.add('text-gray-600', 'hover:bg-gray-200');
    });
    event.target.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');
    event.target.classList.remove('text-gray-600', 'hover:bg-gray-200');
}

// Update cart UI
function updateCartUI() {
    const cartCounts = document.querySelectorAll('[id^="cartCount"]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounts.forEach(el => el.textContent = totalItems);
    
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-gray-500 py-8">Your cart is empty.</p>';
        cartTotalEl.textContent = '0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex items-center space-x-4 border-b pb-4">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-md">
            <div class="flex-grow">
                <h4 class="font-semibold text-gray-800">${item.name}</h4>
                <p class="text-gray-600">$${item.price.toFixed(2)}</p>
            </div>
            <div class="flex items-center space-x-2">
                <button data-product-id="${item.id}" data-change="-1" class="update-quantity-btn bg-gray-200 text-gray-700 w-8 h-8 rounded-full transition-colors hover:bg-gray-300">-</button>
                <span>${item.quantity}</span>
                <button data-product-id="${item.id}" data-change="1" class="update-quantity-btn bg-gray-200 text-gray-700 w-8 h-8 rounded-full transition-colors hover:bg-gray-300">+</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = total.toFixed(2);
}

// Add to cart functionality
document.addEventListener('click', function(event) {
    const button = event.target.closest('.add-to-cart-btn');
    if (button) {
        const card = button.closest('.product-card');
        const productId = parseInt(card.dataset.productId);
        const product = products.find(p => p.id === productId) || trendingProducts.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({...product, quantity: 1});
        }
        
        updateCartUI();
        const cartBtn = document.getElementById('cartBtn');
        cartBtn.classList.add('cart-badge');
        setTimeout(() => cartBtn.classList.remove('cart-badge'), 500);
    }
});

// Event delegation for cart quantity buttons
document.getElementById('cartItems').addEventListener('click', function(event) {
    const button = event.target.closest('.update-quantity-btn');
    if (button) {
        const productId = parseInt(button.dataset.productId);
        const change = parseInt(button.dataset.change);
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
        }
        updateCartUI();
    }
});

// Modal functionality
const cartModal = document.getElementById('cartModal');
const authModal = document.getElementById('authModal');
const cartBtn = document.getElementById('cartBtn');
const loginBtn = document.getElementById('loginBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const loginBtnMobile = document.getElementById('loginBtnMobile');
const cartBtnMobile = document.getElementById('cartBtnMobile');

function openModal(modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closeModal(modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

cartBtn.addEventListener('click', () => openModal(cartModal));
cartBtnMobile.addEventListener('click', () => openModal(cartModal));
closeCartBtn.addEventListener('click', () => closeModal(cartModal));

loginBtn.addEventListener('click', () => openModal(authModal));
loginBtnMobile.addEventListener('click', () => openModal(authModal));
closeAuthBtn.addEventListener('click', () => closeModal(authModal));

window.addEventListener('click', function(event) {
    if (event.target === cartModal) {
        closeModal(cartModal);
    }
    if (event.target === authModal) {
        closeModal(authModal);
    }
});

// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
const mobileNavLinks = mobileMenu.querySelectorAll('a');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('-translate-x-full');
});

closeMobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('-translate-x-full');
});

mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('-translate-x-full');
    });
});

// Auth modal form switching
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const toggleSignup = document.getElementById('toggleSignup');
const authTitle = document.getElementById('authTitle');
const formToggleText = document.getElementById('formToggleText');

toggleSignup.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        authTitle.textContent = 'Login to TechStore';
        formToggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleSignup" class="text-blue-600 hover:underline">Signup now</a>';
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        authTitle.textContent = 'Create an Account';
        formToggleText.innerHTML = 'Already have an account? <a href="#" id="toggleSignup" class="text-blue-600 hover:underline">Login instead</a>';
    }
});

// Placeholder for form submission logic
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showMessage('Login successful!', 'success');
    closeModal(authModal);
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        showMessage('Passwords do not match.', 'error');
        return;
    }
    showMessage('Account created successfully!', 'success');
    closeModal(authModal);
});

// Live Chat functionality
const chatModal = document.getElementById('chatModal');
const openChatBtn = document.getElementById('openChatBtn');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');

openChatBtn.addEventListener('click', () => openModal(chatModal));
closeChatBtn.addEventListener('click', () => closeModal(chatModal));

sendChatBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;

    // User message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'flex justify-end';
    userMessageDiv.innerHTML = `<div class="bg-blue-500 text-white p-3 rounded-lg max-w-[80%] hide-scrollbar">${message}</div>`;
    chatMessages.appendChild(userMessageDiv);
    
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simple AI response
    setTimeout(() => {
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'flex justify-start';
        botMessageDiv.innerHTML = `<div class="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[80%]">Thank you for your message. An agent will be with you shortly.</div>`;
        chatMessages.appendChild(botMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const icon = button.querySelector('i');
        const isHidden = answer.classList.contains('hidden');

        // Close all other open answers
        document.querySelectorAll('.faq-answer').forEach(ans => {
            if (ans !== answer) {
                ans.classList.add('hidden');
                ans.previousElementSibling.querySelector('i').classList.remove('fa-minus');
                ans.previousElementSibling.querySelector('i').classList.add('fa-plus');
            }
        });

        // Toggle the clicked one
        if (isHidden) {
            answer.classList.remove('hidden');
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
        } else {
            answer.classList.add('hidden');
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
        }
    });
});


// Chart.js data visualization
const salesCtx = document.getElementById('salesChart').getContext('2d');
new Chart(salesCtx, {
    type: 'bar',
    data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
            label: 'Sales ($M)',
            data: [12, 19, 14, 25],
            backgroundColor: [
                'rgba(59, 130, 246, 0.6)',
                'rgba(59, 130, 246, 0.6)',
                'rgba(59, 130, 246, 0.6)',
                'rgba(59, 130, 246, 0.8)'
            ],
            borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(59, 130, 246, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

const trafficCtx = document.getElementById('trafficChart').getContext('2d');
new Chart(trafficCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Website Visitors',
            data: [5000, 7500, 6000, 9000, 11000, 10500],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Initial content load
document.addEventListener('DOMContentLoaded', () => {
    displayTrendingProducts();
    displayProducts();
    updateCartUI();
});
// Contact Form functionality
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // You would typically send the form data to a backend here
        // For this example, we'll just show a success message
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Clear the form fields
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';

        showMessage(`Thank you, ${name}! Your message has been sent.`, 'success');
    });
}