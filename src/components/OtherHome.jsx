import React from "react";
import Icon1 from "../assets/images/icon1.png";
import Icon2 from "../assets/images/icon2.png";
import Icon3 from "../assets/images/icon3.png";
import Icon4 from "../assets/images/icon4.png";
import Icon5 from "../assets/images/icon5.png";
import Icon6 from "../assets/images/icon6.png";
import Icon7 from "../assets/images/icon7.png";
import PopularParking from "./PopularParking";

function OtherHome() {
  return (
    <>
      <div className="parkmydriveBenefits">
        <div className="parkmydriveBenefitsLeft">
          <div className="parkmydriveBenefitsInner">
            <div className="row">
              <div className="col-lg-9 offset-lg-2">
                <h2>Park in my drive Benefits</h2>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error siaccusantium
                  doloaudanum, totam rem aperiam eaque ipsa qeab illo inventore
                  veritatisor sivtatem accusantium doloremque laudantium.
                </p>

                <div className="row parkmydriveBenefitsList">
                  <div className="col-lg-6 col-md-6">
                    <img src={Icon1} />
                    <h3>Stress Free Booking</h3>
                    <p>
                      Sed ut perspiciatis unde omnis iste natus error saee
                      ntium.
                    </p>
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <img src={Icon3} />
                    <h3>24 Hr Services</h3>
                    <p>
                      Sed ut perspiciatis unde omnis iste natus error saee
                      ntium.
                    </p>
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <img src={Icon2} />
                    <h3>Save Money & Time</h3>
                    <p>
                      Sed ut perspiciatis unde omnis iste natus error saee
                      ntium.
                    </p>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <img src={Icon4} />
                    <h3>Best Parking Management</h3>
                    <p>
                      Sed ut perspiciatis unde omnis iste natus error saee
                      ntium.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PopularParking />

      <div className="rentOut">
        <div className="parkmydriveBenefitsLeft">
          <div className="rentOutInner">
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                <h2>Rent Out Your Parking Space</h2>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error siaccusantium
                  doloaudanum, totam rem aperiam eaque ipsa qeab illo inventore
                  veritatisor sivtatem accusantium doloremque laudantium.
                </p>

                <div className="row parkmydriveBenefitsList rentOutList">
                  <div className="col-lg-12">
                    <div className="image-box-wrapper">
                      <figure className="image-box-img">
                        <img src={Icon5.png} />
                      </figure>
                      <div className="image-box-content">
                        <h3>Create Your Listing</h3>
                        <p>
                          Sed ut perspiciatis unde omnis iste natus error saee
                          ntium.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="image-box-wrapper">
                      <figure className="image-box-img">
                        <img src={Icon6.png} />
                      </figure>
                      <div className="image-box-content">
                        <h3>Manage Your Motorists</h3>
                        <p>
                          Sed ut perspiciatis unde omnis iste natus error saee
                          ntium.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="image-box-wrapper">
                      <figure className="image-box-img">
                        <img src={Icon7.png} />
                      </figure>
                      <div className="image-box-content">
                        <h3>Get Paid For Your Service</h3>
                        <p>
                          Sed ut perspiciatis unde omnis iste natus error saee
                          ntium.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <a href="" className="btn btn-secondary">
                      Get Started
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OtherHome;
