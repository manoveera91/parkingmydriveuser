import React from "react";
import Banner from "../assets/images/banner.jpg";
import Banner2 from "../assets/images/banner2.jpg";
import Banner3 from "../assets/images/banner3.jpg";
import { useNavigate } from "react-router-dom";

function Slider() {
  const navigate = useNavigate();
  const goToFind = () => {
    navigate("/find-parking-spot");
  };
  return (
    <div
      id="bootstrap-touch-slider"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
      data-bs-pause="hover"
      data-bs-interval="5000"
    >
      <ol className="carousel-indicators">
        <li
          data-bs-target="#bootstrap-touch-slider"
          data-bs-slide-to="0"
          className="active"
        ></li>
        <li data-bs-target="#bootstrap-touch-slider" data-bs-slide-to="1"></li>
        <li data-bs-target="#bootstrap-touch-slider" data-bs-slide-to="2"></li>
      </ol>

      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={Banner} alt="parking" className="d-block w-100" />
          <div className="carousel-overlay"></div>

          <div className="carousel-caption text-start">
            <h1 data-bs-animation="animate__animated animate__zoomInRight">
              Find Amazing Parking Space Near You
            </h1>
            <p data-bs-animation="animate__animated animate__fadeInLeft">
              Uncover convenient spots for hassle-free parking nearby.
            </p>
            <a
              onClick={() => goToFind()}
              className="btn btn-primary"
              data-bs-animation="animate__animated animate__fadeInLeft"
            >
              Show Parking Spaces
            </a>
          </div>
        </div>

        <div className="carousel-item">
          <img src={Banner2} alt="parking" className="d-block w-100" />
          <div className="carousel-overlay"></div>

          <div className="carousel-caption text-start">
            <h1 data-bs-animation="animate__animated animate__flipInX">
              Find Amazing Parking Space Near You
            </h1>
            <p data-bs-animation="animate__animated animate__lightSpeedIn">
              Uncover convenient spots for hassle-free parking nearby.
            </p>
            <a
              target="_blank"
              className="btn btn-primary"
              data-bs-animation="animate__animated animate__fadeInUp"
            >
              Show Parking Spaces
            </a>
          </div>
        </div>

        <div className="carousel-item">
          <img src={Banner3} alt="parking" className="d-block w-100" />
          <div className="carousel-overlay"></div>

          <div className="carousel-caption text-start">
            <h1 data-bs-animation="animate__animated animate__zoomInLeft">
              Find Amazing Parking Space Near You
            </h1>
            <p data-bs-animation="animate__animated animate__fadeInRight">
              Uncover convenient spots for hassle-free parking nearby.
            </p>
            <a
              target="_blank"
              className="btn btn-primary"
              data-bs-animation="animate__animated animate__fadeInLeft"
            >
              Show Parking Spaces
            </a>
          </div>
        </div>
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#bootstrap-touch-slider"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#bootstrap-touch-slider"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Slider;
