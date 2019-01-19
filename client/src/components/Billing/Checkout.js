import React from 'react'
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

const PAYMENT_SERVER_URL = process.env.REACT_APP_PAYMENT_SERVER_URL;
const STRIPE_PUBLISHABLE = process.env.REACT_APP_STRIPE_API_PUBLISH_KEY;

// console.log("stripe key", STRIPE_PUBLISHABLE);

const CURRENCY = 'USD';

// All API requests expect amounts to be provided in a currency’s smallest unit. 
// For example, to charge $10 USD, provide an amount value of 1000 (i.e, 1000 cents).

const fromUSDToCent = amount => amount*100;

const successPayment = data => {
    alert('Payment Successful');
    console.log(data);
  };
  
const errorPayment = data => {
  alert('Payment Error');
  console.log(data);
};

const onToken = (amount, description) => token =>
  axios.post(PAYMENT_SERVER_URL,
    {
      description,
      source: token.id,
      currency: CURRENCY,
      amount: fromUSDToCent(amount)
    }, { withCredentials: true })
    .then(successPayment)
    .catch(errorPayment);
  
const Checkout = ({ name, description, amount }) =>
  <StripeCheckout
    name={name}
    description={description}
    amount={fromUSDToCent(amount)}
    token={onToken(amount, description)}
    currency={CURRENCY}
    stripeKey={STRIPE_PUBLISHABLE}
  />
  
export default Checkout;
