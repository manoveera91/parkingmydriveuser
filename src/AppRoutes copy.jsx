import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notfound from "./pages/Notfound";
import HomePage from "./pages/Home";
import BookingHistory from "./pages/BookingHistory";
import BookingDetail from "./pages/BookingDetail";
import Listing from "./pages/Listing";
import ReviewBooking from "./pages/ReviewBooking";
import { useAuthContext } from "./context/AppContext";

const AuthenticatedRoute = ({ children }) => {
  // const auth = useAuthContext();

  // return localStorage.getItem("isAuthenticated") === "true" ? (
  //   <>{children}</>
  // ) : (
  //   <Navigate to="/login" />
  // );
  return <>{children}</>;
};

const UnAuthenticatedRoute = ({ children }) => {
  // const auth = useAuthContext();
  // return localStorage.getItem("isAuthenticated") === "true" ? (
  //   <Navigate to="/" />
  // ) : (
  //   <>{children}</>
  // );
  return <>{children}</>;
};

const PublicRoutes = ({ children }) => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <UnAuthenticatedRoute>
            <Login />
          </UnAuthenticatedRoute>
        }
      ></Route>
      <Route
        path="/register"
        element={
          <UnAuthenticatedRoute>
            <Register />
          </UnAuthenticatedRoute>
        }
      ></Route>
      <Route
        path="/review-booking"
        element={
          <UnAuthenticatedRoute>
            <ReviewBooking />
          </UnAuthenticatedRoute>
        }
      ></Route>
    </Routes>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthenticatedRoute>
            <HomePage />
          </AuthenticatedRoute>
        }
      />

      <Route
        path="/listing"
        element={
          <AuthenticatedRoute>
            <Listing />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/booking-detail/:id"
        element={
          <AuthenticatedRoute>
            <BookingDetail />
          </AuthenticatedRoute>
        }
      />
      <Route path="*" element={<PublicRoutes />} />
    </Routes>
  );
};
export default AppRoutes;
