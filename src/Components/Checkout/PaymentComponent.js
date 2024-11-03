import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const stripePromise = loadStripe("pk_test_51Px4aqRsoQBPHlEDA15MLzUtHFbmsa9CSIidItQMaMQuNOjSsD7ywDaagl2YmlbZyq7OFOZdrSf8EESQ26voDAnI00xT47XSkh");

const PaymentComponent = ({ amount, currency = "usd", onPaymentSuccess }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const user = useSelector((store) => store.userSection.cu);

  const handleSubmit = async (e) => {
    // console.log("first")
    // return
    e.preventDefault();
    if (!stripe || !elements) return;

    setBtnLoading(true);
    const body = {
      amount: amount * 100, currency
    }
    console.log('body=>', body);
    try {

      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to create payment intent");

      const { clientSecret } = await res.json();
      const cardNumberElement = elements.getElement(CardNumberElement);


      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: user?.name || "Customer",
          },
        },
      });

      setBtnLoading(false);

      if (error) {
        handleError(error);
      } else if (paymentIntent.status === "succeeded") {
        toast.success("Payment Successful!", { position: "top-center" });


        await savePaymentStatus(paymentIntent.id);
        onPaymentSuccess(paymentIntent);
      }
    } catch (err) {
      setBtnLoading(false);
      handleError(err);
    }
  };

  const savePaymentStatus = async (paymentId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/save-payment-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, status: "paid" }),
      });

      if (!res.ok) throw new Error("Failed to save payment status");
    } catch (error) {
      console.error("Error saving payment status:", error);
      toast.error("Could not save payment status. Please try again later.", { position: "top-center" });
    }
  };


  const handleError = (error) => {
    console.error(error);
    const message = error?.type === "card_error" || error?.type === "validation_error"
      ? `Payment failed: ${error.message}`
      : "An unexpected error occurred. Please try again later.";
    toast.error(message, { position: "top-center" });
  };

  const inputStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: { color: "#fa755a", iconColor: "#fa755a" },
    },
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <div className="form-outline form-white mb-4">
        <label className="form-label" htmlFor="cardNumber">Card Number</label>
        <CardNumberElement options={inputStyle} className="form-control p-3" id="cardNumber" />
      </div>
      <div className="row mb-4">
        <div className="col-6">
          <div className="form-outline form-white">
            <label className="form-label" htmlFor="cardExpiry">Expiration</label>
            <CardExpiryElement options={inputStyle} className="form-control p-3" id="cardExpiry" />
          </div>
        </div>
        <div className="col-6">
          <div className="form-outline form-white">
            <label className="form-label" htmlFor="cardCvc">Cvv</label>
            <CardCvcElement options={inputStyle} className="form-control p-3" id="cardCvc" />
          </div>
        </div>
      </div>
      <button
        className="button-submit w-100"
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || btnLoading}
      >
        {btnLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const StripePayment = ({ amount, currency, onPaymentSuccess }) => (
  <Elements stripe={stripePromise}>
    <PaymentComponent amount={amount} currency={currency} onPaymentSuccess={onPaymentSuccess} />
  </Elements>
);

export default StripePayment;
