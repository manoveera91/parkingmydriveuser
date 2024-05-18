import { useState } from "react";
import AxiosClient from "../../axios/AxiosClient";
import Loader from "../../components/Loader";
import { useDispatch } from "react-redux";
import { saveUser } from "../../redux/userSlice";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
const Login = () => {
  // const auth = useAuthContext();
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
    form: "",
  });
  const [errors, setErrors] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setError({
      email: "",
      password: "",
      form: "",
    });
    try {
      setError({ ...error, vehicle_number: "" });

      setLoading(true);
      await AxiosClient.get("/sanctum/csrf-cookie");
      const { email, password } = formData;
      const { data, status } = await AxiosClient.post("api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("ACCESS_TOKEN", data.accessToken);
      toast.success(data.message);
      if (status === 200) {
        dispatch(
          saveUser({
            data: {
              isLoggedIn: true,
              username: data.user.name,
              email: data.user.email,
              token: data.accessToken,
            },
          })
        );
        // navigate("/booking-history");
      }
      if (status !== 200) {
        setError({
          ...error,
          form: "OOPS! Check your username and password",
        });
      }
    } catch (err) {
      console.error("catching error", err);
      setErrors("OOPS! Check your username and password");
    } finally {
      setLoading(false); // Set loading state to false when API call completes
    }
  };

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="card">
      <form onSubmit={handleLoginSubmit}>
        <div className="registerBg">
          <div className="row">
            <div className="">
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
                    required
                  />
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
                    required
                  />
                </div>
              </div>

              <div className="row mb-2">
                {error.form && (
                  <span className="text-danger small">{error.form}</span>
                )}

                {errors && <span className="text-danger small">{errors}</span>}
                <div className="col-lg-8 col-lg-12 col-sm-12 col-md-12 offset-lg-4">
                  <button className="btn btn-primary" type="submit">
                    {/* Loader */}
                    {loading ? (
                      <div className="loader">
                        <Loader />
                      </div>
                    ) : (
                      "Login"
                    )}
                  </button>
                  <br />
                  <NavLink to="/forgetPassword">forget Password?</NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
