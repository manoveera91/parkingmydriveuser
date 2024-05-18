import React, { useEffect } from "react";
import Banner from "../assets/images/banner.jpg";
import Banner2 from "../assets/images/banner2.jpg";
import Banner3 from "../assets/images/banner3.jpg";
import { useNavigate } from "react-router-dom";

function Slider() {
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        let storedLoc = localStorage.getItem('currentLat');
        if (navigator.geolocation && storedLoc == null) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            localStorage.setItem('currentLat', latitude);
            localStorage.setItem('currentLong', longitude);
            // Fetch full address using reverse geocoding
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_APP_GOOGLE_API_KEY}`);
            const data = await response.json();
            if (data.results.length > 0) {
              const addressComponents = data.results[0].address_components;
              const filteredComponents = addressComponents.filter(component =>
                !component.types.includes('postal_code') && !component.types.includes('plus_code')
              );
              const formattedAddress = filteredComponents.map(component => component.long_name).join(', ');
              localStorage.setItem('addressComponent', JSON.stringify({
                label: formattedAddress,
                value: {
                  description: formattedAddress,
                  place_id: data.results[0].place_id
                }
              }));
            }
          });
        } else {
          console.error('Geolocation is not supported by this browser.');
          localStorage.removeItem('currentLat');
          localStorage.removeItem('currentLong');
          localStorage.removeItem('addressComponent');
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    fetchLocation();
  }, []);
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
