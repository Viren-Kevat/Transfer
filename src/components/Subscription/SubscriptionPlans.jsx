import { useEffect, useState } from "react";
import "./Subscription.css";

const PLANS = {
  free: { amount: 0, tweets: 1 },
  bronze: { amount: 10000, tweets: 3 },
  silver: { amount: 30000, tweets: 5, popular: true },
  gold: { amount: 100000, tweets: -1 },
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PlanCard = ({
  planKey,
  planDetails,
  isLoaded,
  currentUser,
  onSelect,
}) => {
  const isFree = planKey === "free";
  return (
    <article className={`plan-card ${planDetails.popular ? "popular" : ""}`}>
      {planDetails.popular && (
        <div className="popular-ribbon">Most Popular</div>
      )}
      <div className="plan-content">
        <h3 className="plan-title">{planKey.toUpperCase()}</h3>
        <div className="plan-features">
          <p className="tweet-limit">
            {planDetails.tweets === -1 ? (
              <>
                <span className="emoji">∞</span> Unlimited Tweets
              </>
            ) : (
              <>
                <span className="emoji">🐦</span> {planDetails.tweets}{" "}
                Tweets/Day
              </>
            )}
          </p>
          <div className="pricing">
            {isFree ? (
              <p className="price-free">Free Forever</p>
            ) : (
              <>
                <p className="price-amount">₹{planDetails.amount / 100}</p>
                <p className="price-duration">per month</p>
              </>
            )}
          </div>
        </div>
        <button
          className={`plan-button ${isFree ? "free" : "premium"}`}
          onClick={() => onSelect(planKey)}
          disabled={!isLoaded && !isFree}
          aria-label={`Subscribe to ${planKey} plan`}
        >
          {isFree ? "Get Started" : "Subscribe Now"}
          {!isFree && <span className="button-arrow">→</span>}
        </button>
      </div>
    </article>
  );
};

const SubscriptionPlans = ({ currentUser }) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(setRazorpayLoaded);
    console.log("Razorpay Key:", process.env.REACT_APP_RAZORPAY_KEY_ID);
  }, []);

  if (!currentUser || !currentUser._id) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        Loading user info...
      </div>
    );
  }

  const handleFreeSubscription = async (planKey) => {
    if (!currentUser?._id) {
      alert("Please log in to subscribe.");
      return;
    }
    alert("Free plan activated!");
  };

  const handlePayment = async (planKey) => {
    if (!razorpayLoaded) {
      alert("Razorpay script not loaded. Please try again.");
      return;
    }
    if (!currentUser?._id) {
      alert("Please log in to subscribe.");
      return;
    }
    try {
      // Call backend to create order
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:8081"
        }/api/payments/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: planKey, userId: currentUser._id }),
        }
      );
      if (!response.ok) throw new Error("Failed to create order");
      const order = await response.json();
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Sneaker Hub",
        description: `${planKey} Plan Subscription`,
        order_id: order.id,
        handler: async function (response) {
          alert(
            "Payment successful! Payment ID: " + response.razorpay_payment_id
          );
        },
        prefill: {
          email: currentUser?.email || "",
          name: currentUser?.name || "",
        },
        theme: { color: "#1da1f2" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment error: " + err.message);
    }
  };

  return (
    <section className="subscription-grid">
      {Object.entries(PLANS).map(([planKey, planDetails]) => (
        <PlanCard
          key={planKey}
          planKey={planKey}
          planDetails={planDetails}
          isLoaded={razorpayLoaded}
          currentUser={currentUser}
          onSelect={planKey === "free" ? handleFreeSubscription : handlePayment}
        />
      ))}
    </section>
  );
};

export default SubscriptionPlans;
