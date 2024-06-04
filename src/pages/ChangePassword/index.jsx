import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient from "../../axios/AxiosClient";
import Footer from "../../components/Footer";
import BreadCrumbs from "../../components/BreadCrumbs";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { token } = useParams();
  let email = '';
  const navigate = useNavigate();

  const userRedux = useSelector((state) => {
    email = state.user.value.email; 
    return state.user.value;
});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password and confirmation password match
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirmation new password does not match.");
      return;
    }

    setLoading(true);
    try {
      await AxiosClient.get("/sanctum/csrf-cookie");
      const response = await AxiosClient.post("api/auth/change-password", {
        email: email,
        password: password,
        newPassword: newPassword,
        password_confirmation: confirmNewPassword,
      });
      console.log("response", response);
      if (response.message) {
        toast.error(response.message);
        setLoading(false);
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
      if (response && response.data) {
        setLoading(false);
        if (response.status === 200) {
          setPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          toast.success("Password successfully updated!");
        //   navigate("/userlogin")

          // navigate("/");
        } else {
          toast.error("Failed to reset password. Please try again.");
        }
        console.log("Reset password response", response.data);
        console.log("Reset response", response);
      }
    } catch (error) {
      setLoading(false);
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      console.log("error", error);

      if (error.response && error.response.status === 400) {
        // Validation error occurred

        // Log the error response to console
        console.log("Error response:", error.response);

        // Check if the error message contains "Invalid token provided"
        if (
          error.response.message &&
          error.response.message.includes("Invalid token provided")
        ) {
          toast.error("Invalid token provided. Please try again.");
        } else {
          toast.error("Failed to reset password. Please try again.");
        }
      }
    }

    // Handle form submission here, e.g., send a POST request to the backend
    // console.log("Form submitted:", { email, password, confirmPassword, token });
  };

  return (
    <>
      <Header />
      <BreadCrumbs title="Change Password" />
      <div className="loginOuter">
        <div className="row justify-content-center">
          {/* <div className="col-lg-4"></div> */}
          <div className="col-lg-5 col-md-12">
            <div className="card mb-4">
              <div className="registerBg">
                {/* <h4 className="">Change Password</h4> */}
                <form className="change-pass-form" onSubmit={handleSubmit}>
                  <div className="row">
                    {/* <div className="col-12 mb-4">
                      <label className="form-label" htmlFor="billings-card-num">
                        Email
                      </label>
                      <div className="input-group input-group-merge">
                        <input
                          type="email"
                          required
                          // placeholder="Enter your email"
                          id="billings-card-num"
                          className="form-control billing-card-mask"
                          value={email}
                          readOnly
                        />
                      </div>
                    </div> */}

                    <div className="col-12 mb-4">
                      <label className="form-label" htmlFor="billings-card-num">
                        Old Password
                      </label>
                      <div className="input-group input-group-merge">
                        <input
                          type="password"
                          required
                          name="password"
                          // placeholder="Enter your email"
                          id="billings-card-num"
                          className="form-control billing-card-mask"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-12 mb-4">
                      <label className="form-label" htmlFor="billings-card-num">
                        New Password
                      </label>
                      <div className="input-group input-group-merge">
                        <input
                          type="password"
                          required
                          name="newPassword"
                          // placeholder="Enter your email"
                          id="billings-card-num"
                          className="form-control billing-card-mask"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-12 mb-4">
                      <label className="form-label" htmlFor="billings-card-num">
                        Confirm Password
                      </label>
                      <div className="input-group input-group-merge">
                        <input
                          type="password"
                          required
                          name="password_confirmation"
                          // placeholder="Enter your email"
                          id="billings-card-num"
                          className="form-control billing-card-mask"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <input type="hidden" name="token" value={token} />

                    <div className="col-md-3">
                      <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                          {/* <span className="me-2"> */}{" "}
                          {loading ? (
                            <div className="loader">
                              <Loader />
                            </div>
                          ) : (
                            "Update"
                          )}
                          {/* </span> */}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {/* 
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Forgot Password?</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={email}
          readOnly
          //   onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form> */}
    </>
  );
};

export default ChangePassword;
