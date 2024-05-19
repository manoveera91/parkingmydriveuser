import { useNavigate, useParams } from "react-router-dom";
import DetailImage from "../../assets/images/detailimage.jpg";
import DetailImage1 from "../../assets/images/detailimage1.jpg";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import AxiosClient from "../../axios/AxiosClient";
import Loader from "../../components/Loader";
import BreadCrumbs from "../../components/BreadCrumbs";
import { useDispatch } from "react-redux";
import { calculateTotalDuration, formatDateYear } from "../../utils/DateTime";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { searchSubmit } from "../../redux/searchSlice";

const BookingDetail = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [item, setItem] = useState(null);
  const [totalHours, setTotalHours] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [map, setMap] = useState(null); // To access map instance
  const [markers, setMarkers] = useState([]);


  const searchRedux = useSelector((state) => {
    return state.search.value;
  });

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const [formData, setFormData] = useState({
    from: new Date(),
    to: new Date(),
    // from: "",
    // to: "",

    // no_of_vehicle: "1",
    // hours: "1",
    vehicle_type: "SUV",
    selectedFromTime: "12:00 AM",
    selectedToTime: "01:00 AM",
  });

  const [error, setError] = useState({
    from: "",
    to: "",
    no_of_vehicle: "",
    hours: "",
    vehicle_type: "",
  });

  const onChange = (name, value) => {
    console.log("on change value", name, value);

    // if (name === "from" || name === "to") {
    //   // Convert the selected date to a string representation
    //   value = value ? new Date(value).toISOString() : ""; // Handle the case when the date is null
    // }

    setFormData({
      ...formData,
      [name]: value,
    });
    // Reset error message for the field
    setError({
      ...error,
      [name]: "",
    });
  };

  useEffect(() => {
    if (searchRedux.selectedFromTime != '' && searchRedux.selectedToTime != '') {
      setFormData({
        ...formData,
        from: searchRedux.from,
        to: searchRedux.to,
        selectedFromTime: searchRedux.selectedFromTime,
        selectedToTime: searchRedux.selectedToTime
      })
    }
    if (params) {
      const getApi = async () => {
        try {
          setLoading(true); // Set loading state to true when fetching data

          const { data, status } = await AxiosClient.get(
            `/api/booking-detail/${params.id}`
          );
          if (status === 200) {
            console.log("response Item data", data);
            setItem(data);
          }
        } catch (error) {
          console.error("Error fetching data from the API:", error);
        } finally {
          setLoading(false); // Set loading state to false when fetching is done
        }
      };

      getApi();
    }
  }, []);

  // const handleNoOfVehiclesChange = (e) => {
  //   setSelectedNoOfVehicles(e.target.value);
  //   // You can call your existing onChange function here if needed
  //   onChange("no_of_vehicle", e.target.value);
  // };

  // Render input fields based on the selected number of vehicles
  // In the renderInputFields function
  // const renderInputFields = () => {
  //   const inputs = [];
  //   for (let i = 0; i < parseInt(selectedNoOfVehicles); i++) {
  //     inputs.push(
  //       <div className="form-group mb-3 col-lg-6 col-md-6" key={i}>
  //         <label>{`Enter Vehicle Number ${i + 1}`}</label>
  //         <input
  //           type="text"
  //           className="form-control style-2 border-right"
  //           value={formData[`vehicle_number_${i}`] || ""}
  //           onChange={(e) => onChange(`vehicle_number_${i}`, e.target.value)}
  //           required
  //         />
  //       </div>
  //     );
  //   }
  //   return inputs;
  // };
  const handleSubmit = (e) => {
    let isoFormData;
    e.preventDefault();
    // Convert the from and to dates to ISO string format

    if (formData.to < formData.from) {
      setError({
        ...error,
        to: "To date cannot be less than the from date",
      });
      return; // Prevent form submission if validation fails
    } else {
      setError({
        ...error,
        to: "", // Clear the error message if validation passes
      });
    }

    const fromDate = typeof formData.from;
    const toDate = typeof formData.to;

    isoFormData = {
      ...formData, // Spread the remaining data in formData
      from: fromDate != 'string' ? formData.from.toISOString() : formData.from, // Override from with ISO string format
      to: toDate != 'string' ? formData.to.toISOString() : formData.to, // Override to with ISO string format
    };

    console.log("hc formData", isoFormData);

    dispatch(
      searchSubmit({
        data: {
          ...isoFormData, // Spread isoFormData into the searchSubmit data
        },
      })
    );

    navigate(`/review-booking/${item.id}`);
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("save time", formData.selectedFromTime);
  //   // Set booking details to localStorage
  //   if (
  //     searchState.from &&
  //     searchState.to &&
  //     searchState.selectedFromTime &&
  //     searchState.selectedToTime
  //   ) {
  //     localStorage.setItem("from", searchState.from);
  //     localStorage.setItem("to", searchState.to);
  //     localStorage.setItem("from_time", searchState.selectedFromTime);
  //     localStorage.setItem("to_time", searchState.selectedToTime);
  //     localStorage.setItem("no_of_vehicle", formData.no_of_vehicle);

  //     // Retrieve and set vehicle numbers to localStorage
  //     const vehicleNumbers = [];
  //     for (let i = 0; i < parseInt(formData.no_of_vehicle); i++) {
  //       const vehicleNumber = formData[`vehicle_number_${i}`];
  //       if (vehicleNumber.trim() !== "") {
  //         vehicleNumbers.push(vehicleNumber.trim());
  //       }
  //     }
  //     localStorage.setItem("vehicle_numbers", JSON.stringify(vehicleNumbers));
  //     localStorage.setItem("hours", totalHours);
  //     localStorage.setItem("vehicle_fees", item.vehicle_fees);
  //     localStorage.setItem("parking_id", item.id);
  //     navigate("/review-booking");
  //   } else {
  //     localStorage.setItem("from", formData.from);
  //     localStorage.setItem("to", formData.to);
  //     localStorage.setItem("from_time", formData.selectedFromTime);
  //     localStorage.setItem("to_time", formData.selectedToTime);
  //     localStorage.setItem("no_of_vehicle", formData.no_of_vehicle);

  //     // Retrieve and set vehicle numbers to localStorage
  //     const vehicleNumbers = [];
  //     for (let i = 0; i < parseInt(formData.no_of_vehicle); i++) {
  //       const vehicleNumber = formData[`vehicle_number_${i}`];
  //       if (vehicleNumber.trim() !== "") {
  //         vehicleNumbers.push(vehicleNumber.trim());
  //       }
  //     }
  //     localStorage.setItem("vehicle_numbers", JSON.stringify(vehicleNumbers));
  //     localStorage.setItem("hours", totalHours);
  //     localStorage.setItem("vehicle_fees", item.vehicle_fees);
  //     localStorage.setItem("parking_id", item.id);

  //     navigate("/review-booking");
  //   }
  // };

  const CustomDatePickerInput = ({ value, onClick }) => (
    <>
      <div className="input-group date picker-date" id="datepicker">
        <input
          type="text"
          className="form-control style-2 border-right"
          value={value}
          onClick={onClick}
          placeholder="Date"
        />
        <span className="input-group-append" onClick={onClick}>
          <span className="input-group-text bg-white d-block">
            <i className="fa fa-calendar"></i>
          </span>
        </span>
      </div>
    </>
  );

  useEffect(() => {
    let totalDuration = 0;
    if (
      formData.from !== "" &&
      formData.to !== "" &&
      formData.selectedFromTime !== "" &&
      formData.selectedToTime !== ""
    ) {
      let fromTimeWithoutSpace = formData.selectedFromTime.replace(/\s/g, "");
      let toTimeWithoutSpace = formData.selectedToTime.replace(/\s/g, "");

      totalDuration = calculateTotalDuration(
        formatDateYear(formData.from),
        fromTimeWithoutSpace,
        formatDateYear(formData.to),
        toTimeWithoutSpace
      );
    }
    setTotalHours(totalDuration);
  }, [formData]);

  // google map
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
  });

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  // Fit bounds to all markers whenever markers change
  useEffect(() => {
    if (map && markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(({ position }) => {
        bounds.extend(position);
      });
      map.fitBounds(bounds);
    }
  }, [map, markers]);

  useEffect(() => {
    console.log("hc item set marker", item);
    if (item) {
      setMarkers({
        id: item.id,
        name: item.slot_name,
        position: {
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
        },
      });
    }
  }, [item]);

  const handleFromDateChange = (date) => {
    if (date > formData.to) {
      setFormData({ ...formData, from: date, to: date });
    } else {
      setFormData({ ...formData, from: date });
    }
  };

  const handleFromTimeChange = (time) => {
    console.log("time from", time);
    // Parse time string to extract hour and AM/PM
    const hour = parseInt(time.split(":")[0]);
    const ampm = time.split(" ")[1];

    // Calculate the "To" time
    let toTimeHour = hour + 1;
    let toAmPm = ampm;

    // Adjust hour and AM/PM if necessary
    if (toTimeHour === 12) {
      // If the hour becomes 12, toggle AM/PM
      toAmPm = ampm === "AM" ? "PM" : "AM";
    } else if (toTimeHour === 13) {
      // If the hour becomes 13 (after noon), reset it to 1 and toggle AM/PM
      toTimeHour = 1;
      toAmPm = ampm === "AM" ? "PM" : "AM";
    }

    // Format the "To" time
    const formattedToTime = `${toTimeHour
      .toString()
      .padStart(2, "0")}:00 ${toAmPm}`;

    // Update the form data with the new "From" and "To" times
    setFormData({
      ...formData,
      selectedFromTime: time,
      selectedToTime: formattedToTime,
    });
  };

  const handleToDateChange = (date) => {
    if (date < formData.from) {
      setFormData({ ...formData, to: formData.from });
    } else {
      setFormData({ ...formData, to: date });
    }
  };

  return (
    <>
      <Header />
      <BreadCrumbs title="Parking Spot Details" />
      {loading ? (
        <div
          className="row"
          style={{
            height: "500px",
            marginLeft: "48%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Loader />
        </div>
      ) : (
        <>
          {item ? (
            <div className="detailsOuter">
              <div className="container">
                <div className="card">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-4 col-md-12">
                        <div className="viewdetailImage">
                          {/* <span className="available">
                            {item.available_slots} Available
                          </span> */}

                          <div
                            id="carouselExampleFade"
                            className="carousel slide carousel-fade"
                          >
                            <div className="carousel-inner">
                              <div className="carousel-item active">
                                {item.photos &&
                                  item.photos.length > 0 &&
                                  item.photos[0].photo_path && (
                                    <img
                                      src={`${
                                        import.meta.env.VITE_APP_BASE_URL
                                      }/storage/${item.photos[0].photo_path.slice(
                                        6
                                      )}`}
                                      className="img-fluid"
                                    />
                                  )}
                              </div>
                              <div className="carousel-item">
                                <img src={DetailImage1} className="img-fluid" />
                              </div>
                              <div className="carousel-item">
                                <img src={DetailImage} className="img-fluid" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12">
                        <div className="detailsRight1">
                          <br />
                          <h3>
                            <a>{item.slot_name}</a>
                          </h3>
                          {/* <div className="location">
                            1.5 km away, California
                          </div> */}

                          <div className="shortDescp">
                            <p>
                              {isExpanded
                                ? `This locations central proximity to all of the major
                            companies, non profit organizations, and Federal
                            agencies in the area make it ideal for those
                            business executives on the move. With easy access to transportation hubs
                            and key amenities, professionals can navigate their
                            workday seamlessly while enjoying the vibrant pulse
                            of the city.`
                                : `This locations central proximity to all of the major
                                companies, non profit organizations, and Federal
                                agencies in the area make it ideal for those
                                business executives on the... `}
                            </p>
                            {!isExpanded && (
                              <a
                                onClick={toggleExpansion}
                                className="cursor-pointer"
                              >
                                Read More
                              </a>
                            )}
                            {isExpanded && (
                              <a
                                onClick={toggleExpansion}
                                className="cursor-pointer"
                              >
                                Read Less
                              </a>
                            )}
                          </div>

                          <div className="row">
                            <div className="form-group mb-3 col-lg-12 col-md-12">
                              {/* <label>From</label>
                              <div className="input-group date" id="datepicker">
                                <input
                                  type="text"
                                  className=" form-control style-2 border-right"
                                  id="date"
                                  value={`${
                                    searchState.from
                                      ? `${formatDate(searchState.from)} ${
                                          searchState.selectedFromTime
                                        }`
                                      : `${formData.from}`
                                  }`}
                                  // value={`${formatDate(searchState.from)} ${
                                  //   searchState.selectedFromTime
                                  // }`}
                                  disabled
                                />
                              </div> */}
                              <label>
                                From<span className="text-danger">*</span>
                              </label>
                              <div className="picker">
                                <DatePicker
                                  // key={searchState.from}
                                  minDate={new Date()}
                                  selected={formData.from}
                                  customInput={<CustomDatePickerInput />}
                                  onChange={handleFromDateChange}

                                  // onChange={(date) =>
                                  //   setFormData({ ...formData, from: date })
                                  // }
                                />
                                <select
                                  className="form-control style-2"
                                  value={formData.selectedFromTime}
                                  onChange={(e) =>
                                    handleFromTimeChange(e.target.value)
                                  }
                                  // onChange={(e) =>
                                  //   onChange("selectedFromTime", e.target.value)
                                  // }
                                >
                                  {/* Populate options for time selection */}
                                  {Array.from({ length: 24 }, (_, index) => {
                                    const hour = index % 12 || 12; // Get hour in 12-hour format
                                    const ampm = index < 12 ? "AM" : "PM"; // Determine AM or PM
                                    const formattedHour = ("0" + hour).slice(
                                      -2
                                    ); // Ensure double-digit formatting
                                    const formattedTime = `${formattedHour}:00 ${ampm}`; // Concatenate hour and AM/PM
                                    return (
                                      <option key={index} value={formattedTime}>
                                        {formattedTime}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                            <div className="form-group mb-3 col-lg-12 col-md-12">
                              <label>
                                To<span className="text-danger">*</span> &nbsp;
                                &nbsp;
                              </label>
                              <div className="picker">
                                <DatePicker
                                  minDate={new Date(formData.from)}
                                  selected={formData.to}
                                  customInput={<CustomDatePickerInput />}
                                  onChange={handleToDateChange}

                                  // onChange={(date) => {
                                  //   setFormData({ ...formData, to: date });
                                  //   setError({ ...error, to: "" });
                                  // }}
                                  // onChange={(date) => onChange("to", date)}
                                />
                                <select
                                  className="form-control style-2"
                                  value={formData.selectedToTime}
                                  onChange={(e) =>
                                    onChange("selectedToTime", e.target.value)
                                  }
                                >
                                  {Array.from({ length: 24 }, (_, index) => {
                                    const hour = index % 12 || 12; // Get hour in 12-hour format
                                    const ampm = index < 12 ? "AM" : "PM"; // Determine AM or PM
                                    const formattedHour = ("0" + hour).slice(
                                      -2
                                    ); // Ensure double-digit formatting
                                    const formattedTime = `${formattedHour}:00 ${ampm}`; // Concatenate hour and AM/PM
                                    return (
                                      <option key={index} value={formattedTime}>
                                        {formattedTime}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              {error.to && (
                                <span className="text-danger small">
                                  {error.to}
                                </span>
                              )}
                            </div>

                            {/* <div className="form-group mb-3 col-lg-4 col-md-6">
                              <label>Vehicle Type</label>
                              <select
                                className="form-control style-2"
                                onChange={(e) =>
                                  onChange("vehicle_type", e.target.value)
                                }
                                name="vehicle_type"
                                value={formData.vehicle_type}
                              >
                                <option value={""}>Select Vehicle Type</option>
                                <option value={"SUV"}>SUV</option>
                              </select>
                            </div> */}

                            {/* <div className="form-group mb-3 col-lg-4 col-md-6">
                              <label>No of Vehicles</label>
                              <select
                                className="form-control style-2"
                                value={selectedNoOfVehicles}
                                onChange={handleNoOfVehiclesChange}
                              
                              >
                                {Array.from(
                                  { length: item.available_slots },
                                  (_, index) => (
                                    <option key={index + 1} value={index + 1}>
                                      {index + 1}
                                    </option>
                                  )
                                )}
                              </select>
                            </div> */}
                            {/* Display input fields based on selected number of vehicles */}
                            {/* <div className="row"> {renderInputFields()}</div> */}
                            {/* <div className="form-group mb-3 col-lg-4 col-md-6">
                              <label>Hours</label>
                              <select
                                className="form-control style-2"
                                name="hours"
                                value={formData.hours}
                                onChange={(e) =>
                                  onChange("hours", e.target.value)
                                }
                              >
                                {[...Array(24)].map((_, index) => (
                                  <option key={index + 1} value={index + 1}>
                                    {index + 1} Hr
                                  </option>
                                ))}
                              </select>
                            </div> */}
                          </div>

                          <div className="detailContinueButton">
                            <div>Parking Fees = ${item.vehicle_fees}/hr</div>
                            <div>Total Duration = {totalHours} Hours</div>
                            <p>
                              <strong>Total Cost = </strong>
                              <strong>${totalHours * item.vehicle_fees}</strong>
                            </p>
                          </div>

                          <div className="detailContinueButton mt-4">
                            <button type="submit" className="btn btn-primary  ">
                              Book Now
                            </button>
                          </div>
                        </div>
                        <br />
                      </div>
                      <div className="col-lg-4 col-md-12">
                        <div className="reviewDetails">
                          {isLoaded && (
                            <GoogleMap
                              // onLoad={(map) => setMap(map)}
                              center={{
                                // lat: 0,
                                // lng: 0,
                                lat: markers?.position?.lat,
                                lng: markers?.position?.lng,
                              }} // Adjust center if needed
                              zoom={12}
                              // onLoad={onLoad}
                              // onUnmount={onUnmount}
                              mapContainerStyle={{
                                width: "23vw",
                                height: "50vh",
                              }}
                            >
                              <Marker
                                key={markers.id}
                                position={markers.position}
                                onClick={() => handleActiveMarker(markers.id)}
                              >
                                {activeMarker === markers.id && (
                                  <InfoWindow
                                    onCloseClick={() => setActiveMarker(null)}
                                  >
                                    <div>{markers.name}</div>
                                  </InfoWindow>
                                )}
                              </Marker>
                            </GoogleMap>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="detailsOuter">
              <div className="container">
                <div className="card">
                  <div className="row">
                    <h2>No data found!!</h2>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <Footer />
    </>
  );
};

export default BookingDetail;
