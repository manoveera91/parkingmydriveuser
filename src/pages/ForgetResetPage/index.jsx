import { useState } from "react";

import AxiosClient from "../../axios/AxiosClient";
import Header from "../../components/Header";
import BreadCrumbs from "../../components/BreadCrumbs";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";

const ForgetResetPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgetPassword = async () => {
    // Logic to send reset password email
    console.log("Forget password email sent to:", email);
    setLoading(true);
    try {
      await AxiosClient.get("/sanctum/csrf-cookie");
      const response = await AxiosClient.post("api/auth/forgot-password", {
        email,
      });
      console.log("response", response); // Log the response
      if (response.status === "error") {
        // Display error message
        toast.error("Invalid email");
        setLoading(false);
      } else {
        setLoading(false);
        toast.success("Please check your mail");
        navigate("/userlogin");
        setEmail("");
        console.log("forget password response", response.data);
      }
    } catch (error) {
      setLoading(false);

      console.log("error", error);
      toast.error("An error occurred. Please try again later.");
      //   throw new Error(
      //     error.response.data.message || "Failed to send password reset link."
      //   );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleForgetPassword();
  };

  return (
    <>
      {/* <Header /> */}
      <BreadCrumbs title="forget Password" />
      <div className="loginOuter">
        <div className="row">
          {/* <div className="col-lg-4"></div> */}
          <div className=" offset-lg-4 col-lg-5 col-md-12">
            <div className="card mb-4">
              <div className="registerBg">
                <h4 className="">Forget Password</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12 mb-4">
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
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                          {/* <span className="me-2"> */}{" "}
                          {loading ? (
                            <div className="loader">
                              <Loader />
                            </div>
                          ) : (
                            "Submit"
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
    </>
  );
};

export default ForgetResetPage;
