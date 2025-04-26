    // eslint-disable-next-line no-unused-vars
import React from 'react';
import axios from 'axios';

const PaymentPage = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Razorpay SDK failed to load.');
      return;
    }

    const { data: order } = await axios.post('http://localhost:5000/api/payment/create-order', {
      amount: 5000,
    });

    const options = {
      key: 'rzp_test_7mjUrQNHheuUWf', // 🟡 Replace with your Razorpay Test Key ID
      amount: order.amount,
      currency: order.currency,
      name: 'Hostel Management System',
      description: 'Hostel Room Payment',
      order_id: order.id,
      handler: function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: 'Student Name',
        email: 'student@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Hostel Fees Payment</h2>
      <button onClick={handlePayment} style={{ padding: '10px 20px', backgroundColor: '#3399cc', color: 'white', border: 'none', borderRadius: '5px' }}>
        Pay Now ₹5000
      </button>
    </div>
  );
};

export default PaymentPage;