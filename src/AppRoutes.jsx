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
import UserLogin from './pages/UserLogin/index.jsx'
import Dashboard from "./pages/dashboard/index.jsx";
import ParkingSpots from "./pages/parkingSpots/index.jsx";
import AddParkingSpots from "./components/AddParkingSpots.jsx";
import MyBookingSlots from "./pages/MyBookingSlots/index.jsx";
import ViewParkingSpots from "./components/ViewParkingSpots.jsx";
import EditParkingSpot from "./components/EditParkingSpot.jsx";
import Earnings from "./pages/Earnings/index.jsx";
import Profile from "./pages/profile/index.jsx";
import ViewBookingSlot from "./components/ViewBookingSlot.jsx";
import EditBookingSlot from "./components/EditBookingSlot.jsx";
import ChangePassword from "./pages/ChangePassword/index.jsx";
import ViewCancelledBooking from "./components/ViewCancelledBooking.jsx";

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
        path="/"
        element={
          <UnAuthenticatedRoute>
            <HomePage />
          </UnAuthenticatedRoute>
        }
      ></Route>
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
            {/* <Dashboard /> */}
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/userlogin"
        element={
          <UnAuthenticatedRoute>
            <UserLogin />
          </UnAuthenticatedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AuthenticatedRoute>
            <Dashboard />
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
        path="/my-parking-spot"
        element={
          <AuthenticatedRoute>
            <ParkingSpots />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/earnings"
        element={
          <AuthenticatedRoute>
            <Earnings />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/view-cancelled-booking"
        element={
          <AuthenticatedRoute>
            <ViewCancelledBooking />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/add-parking-spots"
        element={
          <AuthenticatedRoute>
            <AddParkingSpots />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/my-slot-bookings"
        element={
          <AuthenticatedRoute>
            <MyBookingSlots />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthenticatedRoute>
            <Profile />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <AuthenticatedRoute>
            <ChangePassword />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/view-parking-spot"
        element={
          <AuthenticatedRoute>
            <ViewParkingSpots />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/edit-parking-spot"
        element={
          <AuthenticatedRoute>
            <EditParkingSpot />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/view-booking-slot"
        element={
          <AuthenticatedRoute>
            <ViewBookingSlot />
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
      <Route
        path="/edit-booking-slot"
        element={
          <AuthenticatedRoute>
            <EditBookingSlot />
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
