import { useEffect, useState, useRef } from "react";
import Logo from "../assets/images/logo.png";
import MobileLogo from "../assets/images/mobile-logo.jpg";
import ProfileLogo from "../assets/images/profile.png";
import { NavLink, useNavigate } from "react-router-dom";
import AxiosClient from "../axios/AxiosClient";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "../redux/userSlice";
import { Popover, ArrowContainer } from 'react-tiny-popover'
import { toast } from "react-toastify";
function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const userRedux = useSelector((state) => {
    return state.user.value;
  });
  // const dropdownRef = useRef(null);
  // const handleClickOutside = (event) => {

  //   if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //     setIsPopoverOpen(false);
  //   }
  // }

  // useEffect(() => {
  //   if (isPopoverOpen) {
  //     document.addEventListener('click', handleClickOutside);
  //   } else {
  //     document.removeEventListener('click', handleClickOutside);
  //   }
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, [isPopoverOpen]);

  const handleLogout = async () => {
    const res = await AxiosClient.post("/api/auth/logout");
    console.log("logut response", res);
    toast.success("Logged out successfully!");
    navigate("/");

    dispatch(
      saveUser({
        data: {
          isLoggedIn: false,
          username: "",
          email: "",
          token: "",
          spotLength: 0,
          mobile: ''
        },
      })
    );
    localStorage.clear();

  };
  return (
    <>
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
              <ul className="navbar-nav d-flex align-items-center">
                <NavLink
                  exact
                  to="/"
                  className="nav-item"
                  // activeClassName="active"
                >
                  <a
                    onClick={() => { localStorage.removeItem('redirect') }}
                    className="nav-link anchor-link">Home</a>
                </NavLink>

                <NavLink
                  to="/find-parking-spot"
                  className="nav-item"
                >
                  <a
                    onClick={() => { localStorage.removeItem('redirect') }}
                    className="nav-link anchor-link">reserve a parking space</a>
                </NavLink>

                {userRedux.spotLength == 0 && (
                  <NavLink
                    to={userRedux.isLoggedIn ? '/add-parking-spots' : '/userlogin'}
                    className="nav-item">
                    <a
                      onClick={() => { !userRedux.isLoggedIn ? localStorage.setItem('redirect', '/add-parking-spots') : '' }}
                      //  className="nav-item"
                      //  activeClassName="active"
                      // href={import.meta.env.VITE_OWNER_URL}
                      className="nav-link anchor-link">offer a parking space</a>
                  </NavLink>
                )}

                {/* {userRedux.isLoggedIn && (
                <NavLink className="nav-item" activeClassName="">
                  <a
                    // href="http://localhost:3001/"
                    className="nav-link"
                    onClick={handleLogout}
                  >
                    LOGOUT
                  </a>
                </NavLink>
              )} */}

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

                {/* <a
                href={import.meta.env.VITE_OWNER_URL}
                // href="http://localhost:3001/"
                className="btn btn-secondary"
                // target="_blank"
                rel="noopener noreferrer"
              >
                Parking Slot Owner
              </a> */}

                <Popover
                  className='popover-main-container'
                  isOpen={isPopoverOpen}
                  positions={['right', 'bottom']}
                  transform={{ top: 0, left: -84 }}
                  transformMode='relative'
                  padding={1}
                  onClickOutside={() => setIsPopoverOpen(false)}
                  content={({ position, childRect, popoverRect }) => (
                    <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                      position={position}
                      childRect={childRect}
                      popoverRect={popoverRect}
                      arrowColor={'#ff7902'}
                      arrowSize={7}
                      arrowStyle={{ opacity: 0.7 }}
                      className='popover-arrow-container'
                      arrowClassName='popover-arrow'
                    >
                      <div className="common-menu-item"
                        onClick={() => {setIsPopoverOpen(!isPopoverOpen), localStorage.removeItem('redirect')}}
                      >
                        {!userRedux.isLoggedIn && (
                          <NavLink
                            to="/userlogin"
                            className="nav-item"
                          >
                            <a href="">
                              <div className="login_btn">Login/Register</div>
                            </a>
                          </NavLink>
                        )}

                        {userRedux.isLoggedIn && (
                          <NavLink
                            to="/dashboard"
                            className="nav-item"
                          >
                            <a href="">
                              <div className="login_btn">Dashboard</div>
                            </a>
                          </NavLink>
                        )}

                        {userRedux.isLoggedIn && (
                          <NavLink
                            to="/booking-history"
                            className="nav-item"
                          >
                            <a href="">
                              <div className="login_btn">My Bookings</div>
                            </a>
                          </NavLink>
                        )}

                        {userRedux.isLoggedIn && (
                          <NavLink
                            to="/my-parking-spot"
                            className="nav-item"
                          >
                            <a href="">
                              <div className="login_btn">Driveway Bookings</div>
                            </a>
                          </NavLink>
                        )}

                        {userRedux.isLoggedIn && (
                          <NavLink
                            to="/change-password"
                            className="nav-item"
                          >
                            <a href="">
                              <div className="login_btn">Change Password</div>
                            </a>
                          </NavLink>
                        )}
                        {userRedux.isLoggedIn && (
                          <NavLink
                            to="/profile"
                            className="nav-item"
                          >
                            <a>
                              <div className="login_btn">Profile</div>
                            </a>
                          </NavLink>
                        )}
                        {userRedux.isLoggedIn && (
                          <NavLink
                            className="nav-item"
                          >
                            <a
                              onClick={handleLogout}>
                              <div className="login_btn">Logout</div>
                            </a>
                          </NavLink>
                        )}
                      </div>
                    </ArrowContainer>
                  )}
                >
                  <button className="profile-icon-btn" onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                    <img src={ProfileLogo} />
                  </button>
                </Popover>
                <div>

                </div>
              </ul>
              {/* <div className="menu-btn-group-new">
              <button className="profile-icon-btn" onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                <img src={ProfileLogo} />
              </button>
              {isPopoverOpen && (
                <div className="common-menu-item"
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                >
                  {!userRedux.isLoggedIn && (
                    <NavLink
                      to="/userlogin"
                      className="nav-item"
                    >
                      <a href="">
                        <div className="login_btn">Login/Register</div>
                      </a>
                    </NavLink>
                  )}

                  {userRedux.isLoggedIn && (
                    <NavLink
                      to="/dashboard"
                      className="nav-item"
                    >
                      <a href="">
                        <div className="login_btn">Dashboard</div>
                      </a>
                    </NavLink>
                  )}

                  {userRedux.isLoggedIn && (
                    <NavLink
                      to="/booking-history"
                      className="nav-item"
                    >
                      <a href="">
                        <div className="login_btn">My Bookings</div>
                      </a>
                    </NavLink>
                  )}

                  {userRedux.isLoggedIn && (
                    <NavLink
                      to="/my-parking-spot"
                      className="nav-item"
                    >
                      <a href="">
                        <div className="login_btn">My Slot and Bookings</div>
                      </a>
                    </NavLink>
                  )}

                  {userRedux.isLoggedIn && (
                    <NavLink
                      className="nav-item"
                    >
                      <a href="">
                        <div className="login_btn">Change Password</div>
                      </a>
                    </NavLink>
                  )}
                  {userRedux.isLoggedIn && (
                    <NavLink
                      className="nav-item"
                    >
                      <a href="">
                        <div className="login_btn">Profile</div>
                      </a>
                    </NavLink>
                  )}
                  {userRedux.isLoggedIn && (
                    <NavLink
                      className="nav-item"
                    >
                      <a
                        onClick={handleLogout}>
                        <div className="login_btn">Logout</div>
                      </a>
                    </NavLink>
                  )}
                </div>
              )}
            </div> */}
            </div>
          </nav>
        </div>
      </section>
      {userRedux.spotLength > 0 && (
        <section>
          <div className="parking-slot-header">
            <NavLink className="parking-slots non-active" to="/my-parking-spot">
              My Driveways
              <div className="sub-head-arrow"><div className="sub-label-arrow"></div></div>
            </NavLink>
            <NavLink className="parking-slots non-active" to="/my-slot-bookings">
              Driveway Bookings
              <div className="sub-head-arrow"><div className="sub-label-arrow"></div></div>
            </NavLink>
            <NavLink className="parking-slots non-active" to="/earnings">
              My Earnings
              <div className="sub-head-arrow"><div className="sub-label-arrow"></div></div>
            </NavLink>
          </div>
        </section>
      )}
    </>
  );
}

export default Header;
