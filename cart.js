function initCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');
    const deliveryChargesElement = document.getElementById('delivery-charges');
    const grandTotalElement = document.getElementById('grand-total');
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.getElementById('checkout');
    const cartEmptyElement = document.getElementById('cart-empty');
    const cartTotalContainer = document.getElementById('cart-total-container');
    const deliveryChargesContainer = document.getElementById('delivery-charges-container');
    const grandTotalContainer = document.getElementById('grand-total-container');

    // Function to update the cart display
    function updateCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || {};
        cartContainer.innerHTML = ''; // Mutating the DOM to reflect the current state of the cart
        let total = 0; // Mutable local variable
        let itemCount = 0; // Mutable local variable

        for (const id in cart) {
            const item = cart[id];
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            itemCount += item.quantity;

            const cartItem = document.createElement('div'); // Creating new DOM elements (mutable)
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span>${item.name}</span>
                <div class="cart-controls">
                    <button class="quantity-minus" onclick="updateQuantity('${id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-plus" onclick="updateQuantity('${id}', 1)">+</button>
                </div>
                <span>$${itemTotal.toFixed(2)}</span>
                <button class="remove-button" onclick="removeFromCart('${id}')">Remove</button>
            `;
            cartContainer.appendChild(cartItem); // Mutating the DOM
        }

        if (itemCount === 0) {
            cartEmptyElement.style.display = 'block'; // Mutating the DOM
            cartTotalContainer.style.display = 'none'; // Mutating the DOM
            deliveryChargesContainer.style.display = 'none'; // Mutating the DOM
            grandTotalContainer.style.display = 'none'; // Mutating the DOM
            clearCartButton.style.display = 'none'; // Mutating the DOM
            checkoutButton.style.display = 'none'; // Mutating the DOM
        } else {
            cartEmptyElement.style.display = 'none'; // Mutating the DOM
            cartTotalContainer.style.display = 'block'; // Mutating the DOM
            deliveryChargesContainer.style.display = 'block'; // Mutating the DOM
            grandTotalContainer.style.display = 'block'; // Mutating the DOM
            clearCartButton.style.display = 'block'; // Mutating the DOM
            checkoutButton.style.display = 'block'; // Mutating the DOM

            cartTotalElement.textContent = total.toFixed(2); // Mutating the DOM
            deliveryChargesElement.textContent = '3.00'; // Mutating the DOM
            grandTotalElement.textContent = (total + 3.00).toFixed(2); // Mutating the DOM
        }

        cartCountElement.textContent = itemCount; // Mutating the DOM

        // Save cart to local storage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to update item quantity
    window.updateQuantity = function(id, change) {
        const cart = JSON.parse(localStorage.getItem('cart')) || {};
        if (cart[id]) {
            const updatedCart = { ...cart }; // Creating a new cart object (immutability)
            updatedCart[id] = { ...cart[id], quantity: cart[id].quantity + change }; // Creating a new item object (immutability)
            if (updatedCart[id].quantity <= 0) {
                delete updatedCart[id]; // Mutating the local updatedCart object
            }
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            updateCart();
        }
    }

    // Function to remove an item from the cart
    window.removeFromCart = function(id) {
        const cart = JSON.parse(localStorage.getItem('cart')) || {};
        const updatedCart = { ...cart }; // Creating a new cart object (immutability)
        delete updatedCart[id]; // Mutating the local updatedCart object
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        updateCart();
    }

    // Function to clear the cart
    window.clearCart = function() {
        localStorage.removeItem('cart');
        updateCart();
    }

    // Add event listener to cart icon to toggle dropdown
    cartIcon.addEventListener('click', () => {
        cartDropdown.style.display = cartDropdown.style.display === 'none' ? 'block' : 'none'; // Mutating the DOM
    });

    // Add event listener to clear cart button
    clearCartButton.addEventListener('click', clearCart);

    // Add event listener to checkout button
    checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    // Add event listener to order buttons
    document.querySelectorAll('.order-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const cart = JSON.parse(localStorage.getItem('cart')) || {};
            const foodItem = event.target.closest('.food-item');
            const id = foodItem.getAttribute('data-id');
            const name = foodItem.querySelector('.food-title').textContent;
            const price = parseFloat(foodItem.querySelector('.food-price').textContent.replace('$', ''));
            const quantityElement = foodItem.querySelector('.quantity');
            const quantity = parseInt(quantityElement.textContent);

            const updatedCart = { ...cart }; // Creating a new cart object (immutability)
            if (!updatedCart[id]) {
                updatedCart[id] = { name, price, quantity }; // Creating a new item object (immutability)
            } else {
                updatedCart[id] = { ...updatedCart[id], quantity: updatedCart[id].quantity + quantity }; // Creating a new item object (immutability)
            }

            localStorage.setItem('cart', JSON.stringify(updatedCart));
            updateCart();
        });
    });

    // Add event listener to quantity plus buttons
    document.querySelectorAll('.quantity-plus').forEach(button => {
        button.addEventListener('click', (event) => {
            const quantityElement = event.target.previousElementSibling;
            let quantity = parseInt(quantityElement.textContent); // Mutable local variable
            quantity += 1; // Mutating the local variable
            quantityElement.textContent = quantity; // Mutating the DOM
        });
    });

    // Add event listener to quantity minus buttons
    document.querySelectorAll('.quantity-minus').forEach(button => {
        button.addEventListener('click', (event) => {
            const quantityElement = event.target.nextElementSibling;
            let quantity = parseInt(quantityElement.textContent); // Mutable local variable
            if (quantity > 1) {
                quantity -= 1; // Mutating the local variable
                quantityElement.textContent = quantity; // Mutating the DOM
            }
        });
    });

    // Listen for storage changes
    window.addEventListener('storage', (event) => {
        if (event.key === 'cart') {
            updateCart();
        }
    });

    // Initialize cart display on page load
    updateCart();
}

// Initialize cart on page load
initCart();
