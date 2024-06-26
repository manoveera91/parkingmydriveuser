import { useState } from "react";

import AxiosClient from "../../axios/AxiosClient";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useDispatch } from "react-redux";
import { saveUser } from "../../redux/userSlice";
import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
import { useNavigate } from "react-router-dom";
import { BehaviorSubject } from 'rxjs';
// import { useHistory, useNavigate } from "react-router-dom";

const Register = ({ onDataChange }) => {
  const sendDataToParent = (val) => {
    onDataChange(val);
};
  // const params = id;
  // console.log("param id", id);
  const navigate = useNavigate();
  // const history = useHistory(); // Initialize useHistory
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    mobile: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState();

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    
    // await ownerHandleSubmit(e);
    await loginSubmit(e);
  }

  const loginSubmit = async (e) => {
    setError(null);
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true); // Set loading state to true when API call sta
      sendDataToParent(true);
      await OwnerAxiosClient.get("/sanctum/csrf-cookie");
      const { name, email, password, password_confirmation, mobile } =
        formData;
      const { data, statusText, message, error, status } =
        await OwnerAxiosClient.post("/api/auth/adminregister", {
          name,
          email,
          password,
          password_confirmation,
          mobile,
        });
      console.log("errior response", error);
      if (error) {
        sendDataToParent(false);
        setError(error);
        setLoading(false); 
        return;
      }
      if (status === 201) {
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("ACCESS_OWNER_TOKEN", data.owner_access_token);
        sendDataToParent(false);
        toast.success("Register successfully!");
        localStorage.setItem("ACCESS_TOKEN", data.user_access_token);
        const redirect = localStorage.getItem('redirect');
        const bookingLogin = localStorage.getItem('bookingLogin');
        if (redirect) {
            navigate(redirect);
            localStorage.removeItem('redirect');
        } else if (!bookingLogin) {
            navigate("/dashboard")
        } 
        localStorage.removeItem('bookingLogin');
        setIsRegistered(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          mobile: "",
        });

        dispatch(
          saveUser({
            data: {
              isLoggedIn: true,
              username: data.user.name,
              email: data.user.email,
              token: data.user_access_token,
              mobile: data.user.mobile,
              spotLength: data.spot_length
            },
          })
        );
      }
      if (status !== 201) {
        sendDataToParent(false);
        console.log("message", message);
        localStorage.clear();
        setLoading(false);
        setError(message);
      }
    } catch (error) {
      sendDataToParent(false);
      setLoading(false);
      localStorage.clear();
      console.log("Error:", error);
      if (error.response && error.response.status === 409) {
        setError("Email already exists. Please use a different email.");
      } else {
        setError("Internal server error. Please try again later.");
      }
    } finally {
     
    }
  };

  // const ownerHandleSubmit = async (e) => {
  //   setError(null);
  //   e.preventDefault();
  //   const validationErrors = validateForm(formData);
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }
  //   try {
  //     setLoading(true); // Set loading state to true when API call sta
  //     await OwnerAxiosClient.get("/sanctum/csrf-cookie");
  //     const { name, email, password, password_confirmation, mobile } =
  //       formData;
  //     const { data, statusText, message, error, status } =
  //       await OwnerAxiosClient.post("/api/auth/adminregister", {
  //         username: name,
  //         email: email,
  //         password: password,
  //         //   password_confirmation,
  //         //   mobile,
  //       });
  //     console.log("errior response", error);
  //     if (error) {
  //       sendDataToParent(false);
  //       setError(error);
  //       setLoading(false); 
  //       return;
  //     }
  //     if (status === 201) {
  //       localStorage.setItem("isAuthenticated", true);
  //       localStorage.setItem("ACCESS_OWNER_TOKEN", data.access_token);
  //       await handleSubmit(e);
  //     }
  //     if (status !== 201) {
  //       sendDataToParent(false);
  //       console.log("message", message);
  //       localStorage.clear();
  //       setLoading(false);
  //       setError(message);
  //     }
  //   } catch (error) {
  //     sendDataToParent(false);
  //     setLoading(false);
  //     localStorage.clear();
  //     console.log("Error:", error);
  //     if (error.response && error.response.status === 409) {
  //       setError("Email already exists. Please use a different email.");
  //     } else {
  //       setError("Internal server error. Please try again later.");
  //     }
  //   } finally {
     
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   setError(null);
  //   e.preventDefault();

  //   const validationErrors = validateForm(formData);
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }
  //   try {
  //     setUsername(formData.name);
  //     setLoading(true); // Set loading state to true when API call sta
  //     await AxiosClient.get("/sanctum/csrf-cookie");
  //     const { name, email, password, password_confirmation, mobile } = formData;
  //     const { data, statusText, message, status } = await AxiosClient.post(
  //       "/api/auth/register",
  //       {
  //         name,
  //         email,
  //         password,
  //         password_confirmation,
  //         mobile,
  //       }
  //     );

  //     if (status === 201) {
  //       sendDataToParent(false);
  //       toast.success("Register successfully!");
  //       console.log("message", message);
  //       console.log("response data", data);
  //       localStorage.setItem("ACCESS_TOKEN", data.accessToken);
  //       const redirect = localStorage.getItem('redirect');
  //       const bookingLogin = localStorage.getItem('bookingLogin');
  //       if (redirect) {
  //           navigate(redirect);
  //           localStorage.removeItem('redirect');
  //       } else if (!bookingLogin) {
  //           navigate("/dashboard")
  //       } 
  //       localStorage.removeItem('bookingLogin');
  //       setIsRegistered(true);
  //       setFormData({
  //         name: "",
  //         email: "",
  //         password: "",
  //         password_confirmation: "",
  //         mobile: "",
  //       });

  //       dispatch(
  //         saveUser({
  //           data: {
  //             isLoggedIn: true,
  //             username: formData.name,
  //             email: formData.email,
  //             token: data.accessToken,
  //             mobile: data.mobile,
  //             spotLength: 0
  //           },
  //         })
  //       );
  //       // navigate(`/review-booking/${params}`);
  //       // history.push("/review-booking");
  //     }
  //     if (status !== 201) {
  //       sendDataToParent(false);
  //       setLoading(false);
  //       console.log("message", message);
  //       localStorage.clear();
  //       setError(message);
  //     }
  //   } catch (err) {
  //     sendDataToParent(false);
  //     setLoading(false);
  //     localStorage.clear();
  //     console.error("catching error", err);
  //     setError("Interval server error");
  //   } finally {
  //     setLoading(false); // Set loading state to false when API call completes
  //   }
  // };

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = (formData) => {
    let errors = {};
    if (!formData.name) {
      errors.name = "Name is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.mobile) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!formData.password_confirmation) {
      errors.password_confirmation = "Confirm Password is required";
    } else if (formData.password_confirmation !== formData.password) {
      errors.password_confirmation = "Passwords do not match";
    }
    return errors;
  };

  return (
    <>
      {isRegistered && (
        <div className="text-success medium text-center">
          Successfully user registered!
        </div>
      )}
      {!isRegistered && (
        <div className="card">
          <div className="registerBg">
            <form onSubmit={handleRegister}>
              <div className="row">
                <div className="">
                  <div className="row mb-2">
                    <label
                      htmlFor="inputEmail3"
                      className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
                    >
                      Name<span className="text-danger">*</span>
                    </label>
                    <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder=""
                        value={formData.name}
                        name="name"
                        // pattern="[A-Za-z]+"
                        onChange={handleInput}
                      />
                      {errors.name && (
                        <div className="text-danger small">{errors.name}</div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-2">
                    <label
                      htmlFor="inputEmail3"
                      className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
                    >
                      Email Id<span className="text-danger">*</span>
                    </label>
                    <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
                      <input
                        type="email"
                        className="form-control"
                        placeholder=""
                        value={formData.email}
                        name="email"
                        onChange={handleInput}
                      />
                      {errors.email && (
                        <div className="text-danger small">{errors.email}</div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-2">
                    <label
                      htmlFor="inputEmail3"
                      className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
                    >
                      Mobile<span className="text-danger">*</span>
                    </label>
                    <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder=""
                        value={formData.mobile}
                        name="mobile"
                        onChange={handleInput}
                      />
                      {errors.mobile && (
                        <div className="text-danger small">{errors.mobile}</div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-2">
                    <label
                      htmlFor="inputEmail3"
                      className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
                    >
                      Password<span className="text-danger">*</span>
                    </label>
                    <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
                      <input
                        type="password"
                        className="form-control"
                        placeholder=""
                        value={formData.password}
                        name="password"
                        onChange={handleInput}
                      />
                      {errors.password && (
                        <div className="text-danger small">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-2">
                    <label
                      htmlFor="inputEmail3"
                      className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
                    >
                      Confirm Password
                      <span className="text-danger">*</span>
                    </label>
                    <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
                      <input
                        type="password"
                        className="form-control"
                        placeholder=""
                        value={formData.password_confirmation}
                        name="password_confirmation"
                        onChange={handleInput}
                      />
                      {errors.password_confirmation && (
                        <div className="text-danger small">
                          {errors.password_confirmation}
                        </div>
                      )}
                    </div>
                  </div>
                  {error && <div className="text-danger small">{error}</div>}

                  <div className="row mb-2">
                    <div className="col-lg-12 col-lg-12 col-sm-12 col-md-12 ">
                      <button
                        className="btn btn-primary btn-lg btn-block"
                        type="submit"
                      >
                        {/* Loader */}
                        {loading ? (
                          <div className="loader">
                            <Loader />
                          </div>
                        ) : (
                          "Register"
                        )}
                      </button>
                      {/* <p>
                              Already Registered,
                              <NavLink to="/login">Login Here?</NavLink>
                            </p> */}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
