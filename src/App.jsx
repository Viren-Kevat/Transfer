import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import loadingImg from "./assets/nike-gif.gif";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Landing from "./components/landing/Landing";
import Popular from "./components/popular/Popular";
import Hightlight from "./components/hightlight/Hightlight";
import Top from "./components/top/Top";
import Featured from "./components/featured/Featured";
import Blogs from "./components/blogs/Blogs";
import Footer from "./components/footer/Footer";
import Cart from "./components/cart/Cart";
import SubscriptionPage from "./pages/SubscriptionPage";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const cartShow = useSelector((state) => state.cart.show);
  const isLoggedIn = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/auth/me`,
            { headers: { Authorization: `Bearer ${isLoggedIn}` } }
          );
          setCurrentUser(res.data);
        } catch (err) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, [isLoggedIn]);

  const styling = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  };

  return (
    <>
      <Routes>
        {/* Redirect to login page if not logged in */}
        {!isLoggedIn && <Route path="/" element={<Navigate to="/login" />} />}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* Subscription page route, only for logged in users */}
        {isLoggedIn && (
          <Route
            path="/subscription"
            element={<SubscriptionPage currentUser={currentUser} />}
          />
        )}
        {/* If logged in, show main page */}
      </Routes>

      {loading ? (
        <img
          src={loadingImg}
          className="img-fluid"
          alt="loading"
          style={styling}
        />
      ) : (
        // Render landing page and other components only if user is authenticated
        isLoggedIn && (
          <div>
            <Landing />
            {cartShow && <Cart />}
            <Popular />
            <Hightlight />
            <Top />
            <Featured />
            <Blogs />
            <Footer />
          </div>
        )
      )}
    </>
  );
};

export default App;
