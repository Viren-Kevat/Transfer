import { useNavigate } from "react-router-dom";
import SubscriptionPlans from "../components/Subscription/SubscriptionPlans";
import "./SubscriptionPage.css";

const SubscriptionPage = ({ currentUser }) => {
  const navigate = useNavigate();
  return (
    <div
      className="app__layout"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8f9fa",
      }}
    >
      <main
        className="subscription-page"
        style={{
          width: "100%",
          maxWidth: 1100,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 8px 32px rgba(29,161,242,0.08)",
          padding: "2.5rem 2rem",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            marginBottom: 24,
            background: "#1da1f2",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "8px 20px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ← Back to Home
        </button>
        <header className="page-header">
          <h1 className="page-header__title">Choose Your Plan</h1>
          <p className="page-header__subtitle">
            Upgrade your experience with a subscription plan.
          </p>
        </header>
        <section className="plans-section">
          <SubscriptionPlans currentUser={currentUser} />
        </section>
        <aside className="features-card">
          <h2 className="features-card__title">All Plans Include</h2>
          <ul className="features-list">
            <li className="features-list__item">
              <span className="feature-icon">📊</span>Basic Analytics
            </li>
            <li className="features-list__item">
              <span className="feature-icon">🎨</span>Profile Customization
            </li>
            <li className="features-list__item">
              <span className="feature-icon">🛎️</span>Priority Support
            </li>
          </ul>
        </aside>
      </main>
    </div>
  );
};

export default SubscriptionPage;
