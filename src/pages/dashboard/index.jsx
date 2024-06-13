import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import BreadCrumbs from "../../components/BreadCrumbs";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { useEffect, useState } from "react";
const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleClick = () => {
      navigate("/add-parking-spots");
    };

    return (
      <>
        {/* <Header /> */}
        <BreadCrumbs title="Welcome to Park In My Driveway" />
        <div className="loginOuter afterownerLogin">
          <div className="container">
            <div className="dashboardList">
              <div className="row">
                <div className="mb-5 col-xl-7 col-md-7 mx-auto">
                  <div className="py-2 shadow card border-left-primary h-100">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="mr-2 col">
                          <div className="text-center text-xs font-weight-bold text-primary">
                            <h3>Start Your Driveway</h3>
                            <div className="d-flex justify-content-center gap-8">
                            <button
                              className="btn btn-primary btn-block"
                            onClick={() => navigate('/add-parking-spots')}
                            //   onClick={handleBooking}
                            //   disabled={!userRedux.isLoggedIn}
                            >
                              {loading ? (
                                <div className="loader">
                                  <Loader />
                                </div>
                              ) : (
                                "List your driveway"
                              )}
                            </button>
                            <button
                              className="btn btn-primary btn-block"
                              onClick={() => navigate('/find-parking-spot')}
                            //   disabled={!userRedux.isLoggedIn}
                            >
                              {loading ? (
                                <div className="loader">
                                  <Loader />
                                </div>
                              ) : (
                                "find a spot to park"
                              )}
                            </button>
                            </div>
                            {/* You dont have slots, please{" "}
                            <a
                              onClick={handleClick}
                              style={{ cursor: "pointer" }}
                              className="cursor text-underline"
                            >
                              add slots
                            </a>
                            to get bookings. */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  };
  
  export default Dashboard;