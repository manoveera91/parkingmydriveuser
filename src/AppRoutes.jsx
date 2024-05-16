import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/Home";
import BookingHistory from "./pages/BookingHistory";
import BookingDetail from "./pages/BookingDetail";
import Listing from "./pages/Listing";
import ReviewBooking from "./pages/ReviewBooking";
import FindParkingSpot from "./pages/FindParkingSpot/index.jsx";
import ListParkingSpot from "./components/ListParkingSpot.jsx";
import ForgetResetPage from "./pages/ForgetResetPage/index.jsx";
import PasswordReset from "./pages/PasswordReset/index.jsx";

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
      {/* <Route
        path="/login"
        element={
          <UnAuthenticatedRoute>
            <Login />
          </UnAuthenticatedRoute>
        }
      ></Route> */}
      {/* <Route
        path="/register"
        element={
          <UnAuthenticatedRoute>
            <Register />
          </UnAuthenticatedRoute>
        }
      ></Route> */}
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
        path="/review-booking/:id"
        element={
          <AuthenticatedRoute>
            <ReviewBooking />
          </AuthenticatedRoute>
        }
      ></Route>
      <Route
        path="/booking-detail/:id"
        element={
          <AuthenticatedRoute>
            <BookingDetail />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/booking-history"
        element={
          <AuthenticatedRoute>
            <BookingHistory />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/find-parking-spot"
        element={
          <AuthenticatedRoute>
            <FindParkingSpot />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/list-parking-spot"
        element={
          <AuthenticatedRoute>
            <ListParkingSpot />
          </AuthenticatedRoute>
        }
      />

      <Route path="/forgetPassword" element={<ForgetResetPage />} />
      <Route path="/password-reset/:token" element={<PasswordReset />} />
      <Route path="*" element={<PublicRoutes />} />
    </Routes>
  );
};
export default AppRoutes;
