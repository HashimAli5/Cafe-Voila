// checkout.js

function selectPaymentMethod(method) {
    try {
        const paymentOptions = document.querySelectorAll('.payment-option');
        paymentOptions.forEach(option => {
            option.classList.remove('selected');
        });
        document.getElementById(method).classList.add('selected');
    } catch (error) {
        console.error('Error selecting payment method:', error);
        alert('An error occurred while selecting the payment method.');
    }
}

function updateOrderSummary() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || {};
        const cartSummary = document.getElementById('cart-summary');
        const cartTotalElement = document.getElementById('cart-total');
        const deliveryChargesElement = document.getElementById('delivery-charges');
        const grandTotalElement = document.getElementById('grand-total');

        cartSummary.innerHTML = '';
        let total = 0;

        for (const id in cart) {
            const item = cart[id];
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span>${item.name} x${item.quantity} - $${itemTotal.toFixed(2)}</span>
            `;
            cartSummary.appendChild(cartItem);
        }

        cartTotalElement.textContent = total.toFixed(2);
        const deliveryCharges = 3.00;  
        deliveryChargesElement.textContent = deliveryCharges.toFixed(2);
        grandTotalElement.textContent = (total + deliveryCharges).toFixed(2);
    } catch (error) {
        console.error('Error updating order summary:', error);
        alert('An error occurred while updating the order summary.');
    }
}

function validateForm() {
    try {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!name || !email || !phone || !address) {
            alert('Please fill out all fields.');
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error validating form:', error);
        alert('An error occurred while validating the form.');
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        updateOrderSummary();

        const confirmOrderButton = document.getElementById('confirm-order');
        confirmOrderButton.addEventListener('click', () => {
            try {
                if (!validateForm()) {
                    return; // Stop execution if the form is not valid
                }

                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const address = document.getElementById('address').value;
                const selectedPaymentMethod = document.querySelector('.payment-option.selected').id;

                const orderDetails = {
                    name,
                    email,
                    phone,
                    address,
                    paymentMethod: selectedPaymentMethod,
                    cart: JSON.parse(localStorage.getItem('cart')),
                    deliveryCharges: 3.00, 
                    total: parseFloat(document.getElementById('grand-total').textContent)
                };

               
                console.log('Order Confirmed:', orderDetails);

                alert('Order Confirmed!');

                // Clear the cart and redirect to a confirmation page
                localStorage.removeItem('cart');
                window.location.href = 'confirmation.html';
            } catch (error) {
                console.error('Error confirming order:', error);
                alert('An error occurred while confirming your order. Please try again.');
            }
        });
    } catch (error) {
        console.error('Error initializing page:', error);
        alert('An error occurred while initializing the page.');
    }
});
