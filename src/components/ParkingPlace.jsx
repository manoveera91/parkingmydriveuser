import { useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ListImg from "../assets/images/listimage.jpg";
import AxiosClient from "../axios/AxiosClient";
import Slider from "react-slick";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const ParkingPlace = () => {
  const [loading, setLoading] = useState(false);
  const [parkingListData, setParkingListData] = useState([]);

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getApi();
    // fetchPhoto();
  }, []);

  const getApi = async () => {
    setParkingListData([]);
    setError(null);
    try {
      setLoading(true); // Set loading state to true when fetching data
      await AxiosClient.get("/sanctum/csrf-cookie");
      const { data, status } = await AxiosClient.get("/api/getParkingSpots");
      if (status === 200) {
        console.log("Response parking data UI", data);
        setParkingListData(data);
      }
    } catch (error) {
      setError("Internal Server Error");
      console.error("Error fetching data from the API:", error);
    } finally {
      setLoading(false); // Set loading state to false when fetching is done
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const handleClick = (id) => {
    navigate(`/booking-detail/${id}`);
    // navigate(`/review-booking/${id}`);
    // navigate(`/find-parking-spot`);
  };

  return (
    <>
      <div className="slider-container">
        <div className="container searchOuter">
          <h2>Parking Places</h2>
          {loading ? (
            <div
              style={{
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loader />
            </div>
          ) : (
            <Slider {...settings}>
              {parkingListData
                .filter((data) => data.status === 0)
                .map((item) => (
                  <div key={item.id}>
                    <div className="newsItemBlock card homecard">
                      <div className="listImage">
                        {/* <span>{item.available_slots} Available</span> */}
                        <a>
                          <img
                            style={{ width: "500px", height: "300px" }}
                            src={`${
                              import.meta.env.VITE_APP_BASE_URL
                            }/storage/${item.photos[0].photo_path?.slice(6)}`}
                            className="img-fluid"
                          />
                          {/* <img src={ListImg} className="img-fluid" /> */}
                        </a>
                      </div>
                      <div className="listingContent">
                        <h3>
                          <a>{item.slot_name}</a>
                        </h3>
                        {/* <div className="location">1.5 km away, California</div> */}
                        <div className="time">
                          Available Time Slot : {item.available_time}
                        </div>

                        <div className="listingBottom">
                          <strong>$ {item.vehicle_fees}/hr</strong>

                          {/* <a
                            onClick={() => handleClick(item.id)}
                            className="btn btn-outline-primary"
                          >
                            Book Now
                          </a> */}
                          <a
                            onClick={() => handleClick(item.id)}
                            className="btn btn-outline-primary"
                          >
                            Book Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </Slider>
          )}
          {/* <div className="mt-5 text-center">
            <a
              onClick={() => handleParkingList(parkingListData)}
              className="btn btn-primary"
            >
              View all parking Slots
            </a>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ParkingPlace;
