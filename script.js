
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
                
                const item = cart.find(item => item.id === productId);
                if (item) {
                    item.quantity += change;
                    if (item.quantity <= 0) {
                        cart = cart.filter(cartItem => cartItem.id !== productId);
                    }
                    updateCartUI();
                }
            }
        });

        // Checkout function
        document.getElementById('checkoutBtn').addEventListener('click', function() {
            if (cart.length === 0) {
                showMessage('Your cart is empty!', 'error');
                return;
            }
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            showMessage(`Demo Checkout: Total $${total.toFixed(2)}. This would redirect to a payment page.`, 'info');
            cart = [];
            updateCartUI();
            document.getElementById('cartModal').classList.add('hidden');
        });

        // Login/Signup forms logic
        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            showMessage(`Login successful for ${email}!`, 'success');
            document.getElementById('loginForm').reset();
            toggleModal('authModal');
        });

        document.getElementById('signupForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                showMessage("Passwords do not match!", "error");
                return;
            }
            showMessage(`Signup successful for ${email}!`, 'success');
            document.getElementById('signupForm').reset();
            toggleModal('authModal');
        });

        document.getElementById('toggleSignup').addEventListener('click', function(event) {
            event.preventDefault();
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('signupForm').classList.remove('hidden');
            document.getElementById('authTitle').textContent = "Create an Account";
            document.getElementById('formToggleText').innerHTML = 'Already have an account? <a href="#" id="toggleLogin" class="text-blue-600 hover:underline">Login</a>';
        });

        document.getElementById('authModal').addEventListener('click', function(event) {
            if (event.target.id === 'toggleLogin') {
                event.preventDefault();
                document.getElementById('loginForm').classList.remove('hidden');
                document.getElementById('signupForm').classList.add('hidden');
                document.getElementById('authTitle').textContent = "Login to TechStore";
                document.getElementById('formToggleText').innerHTML = "Don't have an account? <a href='#' id='toggleSignup' class='text-blue-600 hover:underline'>Signup now</a>";
            }
        });

        // Live chat logic
        document.getElementById('sendChatBtn').addEventListener('click', function() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            if (message) {
                const chatMessages = document.getElementById('chatMessages');
                const userMessageDiv = document.createElement('div');
                userMessageDiv.className = 'flex justify-end';
                userMessageDiv.innerHTML = `<div class="bg-blue-500 text-white p-3 rounded-lg max-w-[80%]">${message}</div>`;
                chatMessages.appendChild(userMessageDiv);
                
                input.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Simulate a response
                setTimeout(() => {
                    const agentMessageDiv = document.createElement('div');
                    agentMessageDiv.className = 'flex justify-start';
                    agentMessageDiv.innerHTML = `<div class="bg-gray-200 p-3 rounded-lg max-w-[80%]">Thank you for your message! An agent will be with you shortly.</div>`;
                    chatMessages.appendChild(agentMessageDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        });
        
        // Toggle modal visibility
        function toggleModal(modalId) {
            document.getElementById(modalId).classList.toggle('hidden');
        }

        // Event listeners for modals and menu
        document.getElementById('cartBtn').addEventListener('click', () => { toggleModal('cartModal'); updateCartUI(); });
        document.getElementById('cartBtnMobile').addEventListener('click', () => { toggleModal('cartModal'); updateCartUI(); });
        document.getElementById('closeCartBtn').addEventListener('click', () => toggleModal('cartModal'));
        
        document.getElementById('loginBtn').addEventListener('click', () => toggleModal('authModal'));
        document.getElementById('loginBtnMobile').addEventListener('click', () => toggleModal('authModal'));
        document.getElementById('closeAuthBtn').addEventListener('click', () => toggleModal('authModal'));

        document.getElementById('openChatBtn').addEventListener('click', () => toggleModal('chatModal'));
        document.getElementById('closeChatBtn').addEventListener('click', () => toggleModal('chatModal'));
        
        document.getElementById('mobileMenuBtn').addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('-translate-x-full'));
        document.getElementById('closeMobileMenuBtn').addEventListener('click', () => document.getElementById('mobileMenu').classList.add('-translate-x-full'));
        
        // Close modals when clicking outside
        document.addEventListener('click', function(event) {
            if (event.target === document.getElementById('cartModal')) { toggleModal('cartModal'); }
            if (event.target === document.getElementById('authModal')) { toggleModal('authModal'); }
        });

        // FAQ accordion logic
        document.getElementById('faq').addEventListener('click', function(event) {
            const questionButton = event.target.closest('.faq-question');
            if (questionButton) {
                const answer = questionButton.nextElementSibling;
                const icon = questionButton.querySelector('span i');
                
                const isHidden = answer.classList.contains('hidden');
                answer.classList.toggle('hidden');
                
                if (isHidden) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href === '#' || href.trim() === '' || href === '#contact') {
                    return;
                }
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                document.getElementById('mobileMenu').classList.add('-translate-x-full');
            });
        });

        // Data visualization with Chart.js
        function initializeCharts() {
            // Sales Performance Bar Chart
            const salesCtx = document.getElementById('salesChart').getContext('2d');
            new Chart(salesCtx, {
                type: 'bar',
                data: {
                    labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
                    datasets: [{
                        label: 'Total Sales ($)',
                        data: [150000, 210000, 185000, 250000],
                        backgroundColor: '#60a5fa',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        borderRadius: 8
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

            // Website Traffic Line Chart
            const trafficCtx = document.getElementById('trafficChart').getContext('2d');
            new Chart(trafficCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Unique Visitors',
                        data: [1200, 1900, 1500, 2200, 2500, 3000],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
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
        }

        // Initial render on page load
        document.addEventListener('DOMContentLoaded', () => {
            displayProducts();
            displayTrendingProducts();
            initializeCharts();
        });
   