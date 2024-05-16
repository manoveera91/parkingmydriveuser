import Logo from "../assets/images/logo.png";
import MobileLogo from "../assets/images/mobile-logo.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import AxiosClient from "../axios/AxiosClient";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "../redux/userSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRedux = useSelector((state) => {
    return state.user.value;
  });
  const handleLogout = async () => {
    const res = await AxiosClient.post("/api/auth/logout");
    console.log("logut response", res);
    dispatch(
      saveUser({
        data: {
          isLoggedIn: false,
          username: "",
          email: "",
          token: "",
        },
      })
    );
    localStorage.clear();
    navigate("/");
  };
  return (
    <section className="main-header">
      <div className="container">
        <nav className="navbar navbar-default navbar-expand-lg ">
          <div className="navbar-header">
            <a className="navbar-brand">
              <NavLink to="/">
                <img src={Logo} className="logo" />
              </NavLink>
              <NavLink to="/">
                <img src={MobileLogo} className="mobile-logo" />
              </NavLink>
            </a>
            <button
              type="button"
              className="navbar-toggle collapsed navbar-toggler"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
              aria-expanded="false"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div
            className="collapse navbar-collapse lateral-left"
            id="bs-example-navbar-collapse-1"
          >
            <ul className="navbar-nav">
              <NavLink
                exact
                to="/"
                className="nav-item"
                activeClassName="active"
              >
                <a className="nav-link anchor-link">Home</a>
              </NavLink>

              <NavLink
                to="/find-parking-spot"
                className="nav-item"
                activeClassName="active"
              >
                <a className="nav-link anchor-link">Find a parking spot</a>
              </NavLink>
              {userRedux.isLoggedIn && (
                <NavLink className="nav-item" activeClassName="">
                  <a
                    // href="http://localhost:3001/"
                    className="nav-link"
                    onClick={handleLogout}
                  >
                    LOGOUT
                  </a>
                </NavLink>
              )}

              {/* <NavLink
                to="/events"
                className="nav-item"
                activeClassName="active"
              >
                <a className="nav-link anchor-link">Events Near Me</a>
              </NavLink>

              <NavLink
                to="/contact"
                className="nav-item"
                activeClassName="active"
              >
                <a className="nav-link anchor-link">Contact Us</a>
              </NavLink> */}

              <a
                href={import.meta.env.VITE_OWNER_URL}
                // href="http://localhost:3001/"
                className="btn btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Parking Slot Owner
              </a>
            </ul>
            <div className="menu-btn-group">
              {/* <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline"
              >
                Logout
              </button> */}
              {/* <button type="button" className="btn btn-primary">
                List your Driveway
              </button>
              <button type="button" className="btn btn-secondary">
                Parking Owners Logins
              </button> */}
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
}

export default Header;
