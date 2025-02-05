// Toggle Menu Visibility
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', (event) => {
    // Calculate position of the menu button
    const rect = menuToggle.getBoundingClientRect();
    menu.style.top = `${rect.bottom}px`; // Position below the button
    menu.style.left = `${rect.left}px`; // Align with the button's left edge
    menu.classList.toggle('active');
});

// Close Menu When Clicking Outside
document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
        menu.classList.remove('active');
    }
});

// Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCount = document.querySelector('.cart-count');

// Update Cart Count
function updateCartCount() {
    cartCount.textContent = cart.length;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Product Details Modal
const products = document.querySelectorAll('.product');
const modal = document.createElement('div');
modal.classList.add('modal');
document.body.appendChild(modal);

// Open Product Details Modal
products.forEach(product => {
    product.addEventListener('click', () => {
        const id = product.getAttribute('data-id');
        const name = product.getAttribute('data-name');
        const price = product.getAttribute('data-price');
        const image = product.getAttribute('data-image');

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="${image}" alt="${name}">
                <h2>${name}</h2>
                <div class="product-info">
                    <p>Handcrafted with natural ingredients for a soothing experience.</p>
                    <p>Burn Time: 40 hours</p>
                    <p>Size: 8 oz</p>
                </div>
                <p>${price}</p>
                <button class="add-to-cart" data-id="${id}" data-name="${name}" data-price="${price}" data-image="${image}">Add to Cart</button>
            </div>
        `;
        modal.style.display = 'flex'; // Use flexbox to center the modal

        // Close Modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Add to Cart
        modal.querySelector('.add-to-cart').addEventListener('click', () => {
            const productData = {
                id: id,
                name: name,
                price: price,
                image: image
            };
            cart.push(productData);
            updateCartCount();
            modal.style.display = 'none';
        });
    });
});

// Close Modal When Clicking Outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Load Cart Items on Cart Page
if (window.location.pathname.includes('cart.html')) {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    const orderForm = document.querySelector('.order-form');

    let totalAmount = 0;

    // Display Cart Items
    function displayCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear existing items
        totalAmount = 0; // Reset total amount

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>R${item.price}</p>
                <button class="remove-item" data-index="${index}">🗑️</button>
            `;
            cartItemsContainer.appendChild(cartItem);

            // Calculate Total Amount
            totalAmount += parseFloat(item.price);
        });

        // Display Total Amount
        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    // Remove Item from Cart
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const index = event.target.getAttribute('data-index');
            cart.splice(index, 1); // Remove item from cart
            updateCartCount();
            displayCartItems(); // Refresh cart display
        }
    });

    // Send Order via Email (Simulated)
    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = orderForm.querySelector('input[type="email"]').value;
        alert(`Order sent to ${email}!`);
        cart = []; // Clear the cart
        localStorage.removeItem('cart'); // Clear cart from localStorage
        window.location.href = 'index.html'; // Redirect to homepage
    });

    // Initialize Cart Display
    displayCartItems();
}

// Initialize Cart Count
updateCartCount();
