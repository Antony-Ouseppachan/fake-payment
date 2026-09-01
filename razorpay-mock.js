// Fake Razorpay SDK - mimics real library for phishing simulation

window.Razorpay = class MockRazorpay {
    constructor(options) {
        this.options = options;
        console.log('🔴 Mock Razorpay initialized (TEST PHISHING)');
        console.log('📦 Options:', options);
    }

    open() {
        console.log('🔴 Opening fake payment modal...');
        
        // Create fake payment popup
        const overlay = document.createElement('div');
        overlay.id = 'mock-razorpay-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: sans-serif;
        `;
        
        overlay.innerHTML = `
            <div style="
                background: white;
                padding: 40px;
                border-radius: 16px;
                max-width: 400px;
                text-align: center;
            ">
                <div style="font-size: 48px; margin-bottom: 16px;">🏦</div>
                <h2 style="color: #1f2937; margin-bottom: 8px;">Complete Payment</h2>
                <p style="color: #6b7280; margin-bottom: 24px;">
                    Amount: ₹${this.options.amount/100}.00
                </p>
                <div style="
                    background: #fee2e2;
                    border: 2px solid #ef4444;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 24px;
                ">
                    <p style="color: #991b1b; font-weight: bold; margin: 0;">
                        ⚠️ TEST PHISHING SIMULATION
                    </p>
                </div>
                <button onclick="this.closest('#mock-razorpay-overlay').remove()" style="
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                ">
                    Close (Test Only)
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Trigger Verdict detection
        console.log('🚨 PHISHING: Fake Razorpay popup opened');
        
        // Dispatch custom event for Verdict to detect
        const event = new CustomEvent('phishing-detected', {
            detail: {
                type: 'fake-razorpay-popup',
                amount: this.options.amount,
                merchant: this.options.key
            }
        });
        document.dispatchEvent(event);
    }
};

// 🚨 Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔴 Fake Razorpay SDK loaded (TEST)');
    
    // Check if Razorpay is being used
    if (typeof Razorpay !== 'undefined') {
        console.log('🔴 Razorpay detected, but this is a fake version!');
    }
});