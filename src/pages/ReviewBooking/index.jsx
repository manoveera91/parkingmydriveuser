import BreadCrumbs from "../../components/BreadCrumbs";
import Apple from "../../assets/images/apple.png";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AxiosClient from "../../axios/AxiosClient";
import DatePicker from "react-datepicker";
import GoogleLogin from "../googleLogin/index"
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from "react";
import { useDispatch } from "react-redux";
import { saveUser } from "../../redux/userSlice";
import FacebookLogin from 'react-facebook-login';
import Streetview from 'react-google-streetview';
import { combineDateTime } from "../../utils/DateTime";
import {
  calculateTotalDuration,
  convertToMySQLDate,
  convertToMySQLDatetime,
  formatDate,
  formatDateYear,
} from "../../utils/DateTime";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import Login from "../Login";
import Register from "../Register";
import Loader from "../../components/Loader";
import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
import { toast } from "react-toastify";
const ReviewBooking = () => {
  const apiKey = import.meta.env.VITE_APP_GOOGLE_API_KEY;
  const streetViewPanoramaOptions = {
    position: { lat: 46.9171876, lng: 17.8951832 },
    pov: { heading: 0, pitch: 0 },
    zoom: 1,
  };
  const handleDataChange = (newData) => {
    setLoading(newData);
  };
  const dispatch = useDispatch();
  const searchRedux = useSelector((state) => {
    return state.search.value;
  });
  const userRedux = useSelector((state) => {
    return state.user.value;
  });

  console.log("userredux", userRedux);
  console.log("searchstate", searchRedux);
  const [searchParams] = useSearchParams();

  const [logginClicked, setLogginClicked] = useState(false);

  const [signUpClicked, setSignUpClicked] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [totalHours, setTotalHours] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [map, setMap] = useState(null); // To access map instance
  const [markers, setMarkers] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [bookingId, setBookingId] = useState();
  const [bookNow, setBookNow] = useState(false);

  const [formData, setFormData] = useState({
    from: null,
    to: null,
    from_time: "12:00AM",
    to_time: "01:00AM",
    no_of_vehicle: "",
    hours: "",
    vehicle_type: "",
    vehicle_fees: "",
    vehicle_number: "",
  });

  useEffect(() => {
    localStorage.setItem('bookingLogin', true);
    setFormData({
      from: searchRedux?.from,
      to: searchRedux?.to,
      from_time: searchRedux?.selectedFromTime,
      to_time: searchRedux?.selectedToTime,
    });
  }, [searchRedux]);
  const [error, setError] = useState({
    from: "",
    to: "",
    no_of_vehicle: "",
    hours: "",
    vehicle_type: "",
    vehicle_number: "",
  });

  useEffect(() => {
    console.log("item", item);
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


  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
  });

  const responseFacebook = (response) => {
    console.log(response);
    onwerSubmit(response.name, response.email, response.id);
  }

  const handleGoogleResponse = (response) => {
    // Perform actions with the received data
    console.log('Received data from GoogleLogin:', response);
    loginSubmit(response.name, response.email, response.sub);
  };

  const loginSubmit = async (name, email, pass) => {
    try {
      setLoading(true); // Set loading state to true when API call sta
      await OwnerAxiosClient.get("/sanctum/csrf-cookie");
      const { data, error, status } =
        await OwnerAxiosClient.post("/api/auth/ownersociallogin", {
          username: name,
          email: email,
          password: pass,
          mobile: '9999999999'
        });
      if (error) {
        localStorage.clear();
        setError(error);
        setLoading(false);
        return;
      }
      if (status === 200) {
        localStorage.setItem('spotLength', data.spot_length);
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("ACCESS_OWNER_TOKEN", data.owner_access_token);
        localStorage.setItem("ACCESS_TOKEN", data.user_access_token);
        toast.success("Login successfully!");
        setLoading(false);
        dispatch(
          saveUser({
            data: {
              isLoggedIn: true,
              username: data.user.name,
              email: data.user.email,
              token: data.user_access_token,
              mobile: data.user.mobile,
              spotLength: data.spot_length ? data.spot_length : 0
            },
          })
        );
      } else {
        localStorage.clear();
        setError(error);
        setLoading(false);
        return;
      }
    } catch (error) {
      setLoading(false);
      console.log("Error:", error);
      if (error.response && error.response.status === 409) {
        setError("Email already exists. Please use a different email.");
      } else {
        setError("Internal server error. Please try again later.");
      }
    }
  }

  const onwerSubmit = async (name, email, pass) => {
    try {
      setLoading(true); // Set loading state to true when API call sta
      await OwnerAxiosClient.get("/sanctum/csrf-cookie");
      const { data, error, status } =
        await OwnerAxiosClient.post("/api/auth/ownersociallogin", {
          username: name,
          email: email,
          password: pass
        });
      if (error) {
        localStorage.clear();
        setError(error);
        setLoading(false);
        return;
      }
      if (status === 201 || status === 200) {
        localStorage.setItem('spotLength', data.spot_length);
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("ACCESS_OWNER_TOKEN", data.access_token);
        userSubmit(name, email, pass, data.spot_length);
      } else {
        localStorage.clear();
        setError(error);
        return;
      }
    } catch (error) {
      setLoading(false);
      console.log("Error:", error);
      if (error.response && error.response.status === 409) {
        setError("Email already exists. Please use a different email.");
      } else {
        setError("Internal server error. Please try again later.");
      }
    }
  };

  const userSubmit = async (name, email, pass, spotLength) => {
    try {
      const { data, error, status } =
        await AxiosClient.post("/api/auth/sociallogin", {
          name: name,
          email: email,
          password: pass,
          mobile: '9999999999'
        });
      console.log("errior response", error);
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      if (status === 201 || status === 200) {
        toast.success("Login successfully!");
        localStorage.setItem("ACCESS_TOKEN", data.accessToken);
        dispatch(
          saveUser({
            data: {
              isLoggedIn: true,
              username: data.user.name,
              email: data.user.email,
              token: data.accessToken,
              mobile: data.user.mobile,
              spotLength: spotLength ? spotLength : 0
            },
          })
        );
      }
    } catch (error) {
      setLoading(false);
      console.log("Error:", error);
      if (error.response && error.response.status === 409) {
        setError("Email already exists. Please use a different email.");
      } else {
        setError("Internal server error. Please try again later.");
      }
    } finally {
      setLoading(false); // Set loading state to false when API call completes
    }
  }

  const onLoad = React.useCallback(
    function callback(map) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      if (item?.latitude && item?.longitude) {
        const bounds = new window.google.maps.LatLngBounds({
          lat: item?.latitude,
          lng: item?.longitude,
        });
        map.fitBounds(bounds);

        setMap(map);
      }
    },
    [item?.latitude, item?.longitude]
  );

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  // const { isLoaded } = useJsApiLoader({
  //   id: "google-map-script",
  //   googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
  // });

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
    console.log("id", params);
    if (params) {
      const getApi = async () => {
        try {
          setLoading(true); // Set loading state to true when fetching data

          const { data, status } = await AxiosClient.get(
            `/api/booking-detail/${params.id}`
          );
          if (status === 200) {
            console.log("vctc response data", data);
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

  const handleBooking = async () => {
    console.log("formdata", formData, item);
    if (!vehicleNumber.trim()) {
      setError({ ...error, vehicle_number: "Vehicle number is required" });
      return; // Return early if vehicle number is empty
    }

    const bookingData = {
      parking_spot_id: item.id.toString(),
      from_datetime: combineDateTime(formData.from, formData.from_time),
      to_datetime: combineDateTime(formData.to, formData.to_time),
      vehicle_name: "SUV",
      vehicle_number: vehicleNumber,
      slot: item.slot_name,
      amount_paid: totalHours * item.vehicle_fees,
      booked_on: convertToMySQLDate(new Date()),
      total_hours: totalHours,
      location: "Location Name",
      status: "Pending",
    };
    console.log("booking details", bookingData);
    setLoading(true);
    try {
      setError({ ...error, vehicle_number: "" });
      const { data, status } = await AxiosClient.post(
        "/api/add-booking",
        bookingData
      );
      if (status === 201) {
        console.log("response booking data", data);
        setBookingId(data?.booking.id);
        // setLoading(false);
        // setBookNow(true);
        handlePayment(data?.booking.id)
        // navigate("/booking-history");
      } else {
        // Handle error response
        console.error("Failed to create booking");
      }
    } catch (error) {
      // Handle fetch error
      setLoading(false);
      console.error("Error creating booking:", error);
    }
  };

  const onChange = (name, value) => {
    console.log("onchange", name, value);
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

  const CustomDatePickerInput = ({ value, onClick }) => (
    <>
      <div className="input-group date picker-date" id="datepicker">
        <input
          disabled
          type="text"
          className="form-control style-2 border-right"
          value={value}
          onClick={onClick}
          placeholder="Choose Date"
        />
        {/* <span className="input-group-append" onClick={onClick}>
          <span className="input-group-text bg-white d-block">
            <i className="fa fa-calendar"></i>
          </span>
        </span> */}
      </div>
    </>
  );

  useEffect(() => {
    let totalDuration = 0;
    if (
      searchRedux?.from !== "" &&
      searchRedux?.to !== "" &&
      searchRedux?.selectedFromTime !== "" &&
      searchRedux?.selectedToTime !== ""
    ) {
      let fromTimeWithoutSpace = searchRedux?.selectedFromTime.replace(
        /\s/g,
        ""
      );
      let toTimeWithoutSpace = searchRedux?.selectedToTime.replace(/\s/g, "");
      totalDuration = calculateTotalDuration(
        formatDateYear(searchRedux?.from),
        fromTimeWithoutSpace,
        formatDateYear(searchRedux?.to),
        toTimeWithoutSpace
      );
      console.log("Total Duration", totalDuration);
    } else {
      let fromTimeWithoutSpace = formData.selectedFromTime.replace(/\s/g, "");
      let toTimeWithoutSpace = formData.selectedToTime.replace(/\s/g, "");

      totalDuration = calculateTotalDuration(
        formatDateYear(formData.from),
        fromTimeWithoutSpace,
        formatDateYear(formData.to),
        toTimeWithoutSpace
      );
      console.log(
        "value formdata ",
        formData.from,
        formatDateYear(formData.from),
        fromTimeWithoutSpace,
        formatDateYear(formData.to),
        toTimeWithoutSpace
      );

      console.log("Total Duration", totalDuration);
    }
    setTotalHours(totalDuration);
  }, [formData, searchRedux]);

  if (searchParams.has("paypal") && searchParams.has("booking")) {
    if (searchParams.get("paypal") == "cancel") {
      //
    }
    if (searchParams.get("paypal") == "success") {
      try {
        const response = AxiosClient.post("/api/payment-return", {
          booking_id: searchParams.get("booking"),
          token: searchParams.get("token"),
          status: searchParams.get("paypal"),
        });
        console.log(response.data);
        // fetchData();
        navigate("/booking-history");

        // Handle success response
      } catch (error) {
        console.error("Error Cancel booking:", error);
        // Handle error
      }
    }
    console.log(searchParams);
    console.log(searchParams.get("booking"));
    console.log(searchParams.get("paypal"));
    console.log(searchParams.get("token"));
  }

  const handlePayment = async (bookId) => {
    // setLoading(true);
    try {
      const response = await AxiosClient.post("/api/payment-booking", {
        booking_id: bookId, // Assuming selectedBooking contains the booking ID
      });
      console.log("payment booking response", response.data);
      if (response.data.link) {
        location.href = response.data.link;
        setLoading(false);
      }
      // Handle success response
    } catch (error) {
      setLoading(false);

      console.error("Error Cancel booking:", error);
      // Handle error
    }
  };

  return (
    <>
      {/* <Header /> */}
      <BreadCrumbs title={"Review Booking"} />
      <div className="loginOuter">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h4 className="">Confirm your Booking and pay</h4>
              <div className="card px-3">
                <div className="row reviewBookingOuter">
                  <div className="col-lg-7 col-md-12 card-body border-end">
                    <div className="reviewDetails mb-3">
                      <h4 className="mb-2">Parking Slot Details</h4>
                      <div className="row information">
                        <form>
                          <div className="col-lg-12 col-lg-12 col-sm-12 col-md-12">
                            <p>
                              <strong>Arriving on</strong>
                              {/* <span>Monday, March 25, 2024 8.00 PM</span> */}
                              <div className="picker">
                                <DatePicker
                                  disabled
                                  key={searchRedux.from}
                                  minDate={new Date()}
                                  selected={formData.from}
                                  customInput={<CustomDatePickerInput />}
                                  onChange={(date) =>
                                    setFormData({ ...formData, from: date })
                                  }
                                />
                                <select
                                  disabled
                                  className="form-control style-2"
                                  value={formData.from_time}
                                  onChange={(e) =>
                                    onChange("selectedFromTime", e.target.value)
                                  }
                                >
                                  {/* Populate options for time selection */}
                                  {Array.from({ length: 91 }, (_, index) => {
                                    const time = new Date(
                                      0,
                                      0,
                                      0,
                                      0,
                                      60 * index
                                    );
                                    const formattedTime =
                                      time.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      });
                                    return (
                                      <option key={index} value={formattedTime}>
                                        {formattedTime}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </p>
                          </div>

                          <div className="col-lg-12 col-lg-12 col-sm-12 col-md-12">
                            <p>
                              <strong>Leaving on</strong>
                              {/* <span>Monday, March 25, 2024 10:00 PM </span> */}
                              <div className="picker">
                                <DatePicker
                                  disabled
                                  minDate={new Date(formData.from)}
                                  selected={formData.to}
                                  customInput={<CustomDatePickerInput />}
                                  onChange={(date) =>
                                    setFormData({ ...formData, to: date })
                                  }
                                />
                                <select
                                  disabled
                                  className="form-control style-2"
                                  value={formData.to_time}
                                  onChange={(e) =>
                                    onChange("selectedToTime", e.target.value)
                                  }
                                >
                                  {/* Populate options for time selection */}
                                  {Array.from({ length: 91 }, (_, index) => {
                                    const time = new Date(
                                      0,
                                      0,
                                      0,
                                      0,
                                      60 * index
                                    );
                                    const formattedTime =
                                      time.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      });
                                    return (
                                      <option key={index} value={formattedTime}>
                                        {formattedTime}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </p>
                          </div>
                          <div className="col-lg-12 col-lg-12 col-sm-12 col-md-12">
                            <p>
                              <strong>Duration</strong> {totalHours} Hrs
                            </p>
                          </div>
                        </form>
                      </div>
                    </div>
                    {loading ? (
                      <div className="loader"> <Loader /></div>
                    ) : ''}
                    {!userRedux.isLoggedIn && (
                      <div
                        id="form-credit-card"
                        className="bg-lighter rounded  mb-3"
                      >
                        <h4 className="">Let's gets started</h4>
                        {/* <form> */}
                        <div className={loading ? 'form-disabled' : ''}>
                          <div className="row">
                            <div className="col-lg-4 mb-2">
                              <div className="loginasIcon" onClick={() => {
                                setLogginClicked(false);
                                setSignUpClicked(false);
                              }}>
                                <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GG_APP_ID}>
                                  <GoogleLogin onGoogleResponse={handleGoogleResponse} />
                                </GoogleOAuthProvider>
                              </div>
                            </div>

                            <div className="col-lg-4 mb-2">
                              <div className="facebookloginicon loginasIcon">
                                <a onClick={() => {
                                  setLogginClicked(false);
                                  setSignUpClicked(false);
                                }}>
                                  <FacebookLogin
                                    appId={import.meta.env.VITE_APP_FB_APP_ID}
                                    fields="name,email,id"
                                    textButton=""
                                    icon="fa-facebook"
                                    tag={'div'}
                                    cssClass="facebooklogin"
                                    callback={responseFacebook} />
                                </a>
                              </div>
                            </div>

                            <div className="col-lg-4 mb-2">
                              <div className="loginasIcon form-disabled">
                                <a>
                                  <img src={Apple} />
                                </a>
                              </div>
                            </div>

                            {!logginClicked && (
                              <div className="col-xl-12 col-md-12 mb-2">
                                <div className="loginasIcon cursor-pointer">
                                  <a
                                    onClick={() => {
                                      setLogginClicked(true);
                                      setSignUpClicked(false);
                                    }}
                                  >
                                    Login with email
                                  </a>
                                </div>
                              </div>
                            )}

                            {!userRedux.isLoggedIn && logginClicked && <Login onDataChange={handleDataChange} />}
                            {!userRedux.isLoggedIn && signUpClicked && (
                              <Register onDataChange={handleDataChange} />
                            )}
                            {!signUpClicked && (
                              <>
                                <div className="col-xl-12 col-md-12 mb-2">
                                  <div className="loginasIcon text-center">
                                    or
                                  </div>
                                </div>
                                <div className="col-xl-12 col-md-12 mb-2">
                                  <div className="loginasIcon">
                                    <a
                                      onClick={() => {
                                        setSignUpClicked(true);
                                        setLogginClicked(false);
                                      }}
                                    >
                                      Signup with email
                                    </a>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {userRedux.isLoggedIn && (
                      <div
                        id="form-credit-card"
                        className="bg-lighter rounded  mb-3"
                      >
                        <p className="pb-1">
                          Hi <strong>{userRedux.username}</strong>, Welcome back
                          to <a>Park-in-mydriveway.com</a>
                          <br />
                          Please fill the below detail and proceed
                        </p>
                      </div>
                    )}

                    <div
                      id="form-credit-card"
                      className={`bg-lighter rounded  mb-3 ${userRedux.isLoggedIn ? "opacity-100" : "opacity-25"
                        } `}
                    >
                      <h4 className="">Vehicle Information</h4>

                      <div className="row">
                        <div className="col-12 mb-2">
                          <p>
                            Your vehicle registration number will be shared with
                            the parking space owner/operator
                          </p>
                        </div>

                        <div className="col-xl-12  col-md-12 mb-2">
                          <label
                            className="form-label"
                            htmlFor="billings-card-num"
                          >
                            Add a Vehicle Number
                          </label>
                          <div className="input-group input-group-merge">
                            <input
                              type="text"
                              id="billings-card-num"
                              className="form-control billing-card-mask"
                              placeholder=""
                              value={vehicleNumber}
                              onChange={(e) => {
                                setVehicleNumber(e.target.value);
                              }}
                              disabled={!userRedux.isLoggedIn}
                            />
                            <br />
                          </div>
                          {error?.vehicle_number && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                          <br />
                          {!bookNow ? (
                            <button
                              className="btn btn-primary btn-block"
                              onClick={handleBooking}
                              disabled={!userRedux.isLoggedIn}
                            >
                              {loading ? (
                                <div className="loader">
                                  <Loader />
                                </div>
                              ) : (
                                "Book Now"
                              )}
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary"
                              onClick={handlePayment}
                            >
                              {loading ? (
                                <div className="loader">
                                  <Loader />
                                </div>
                              ) : (
                                "Make a payment"
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 card-body">
                  {isLoaded && (
                      <div className="street-view">
                        <Streetview
                          apiKey={import.meta.env.VITE_APP_GOOGLE_API_KEY}
                          streetViewPanoramaOptions={{
                            position: { lat: markers?.position?.lat, lng: markers?.position?.lng },
                            pov: { heading: 0, pitch: 0 },
                            zoom: 1,
                          }}
                        />
                      </div>)}


                    <div className="reviewDetails">
                      {/* {isLoaded && (
                        <GoogleMap
                          // onLoad={(map) => setMap(map)}
                          center={{
                            // lat: 0,
                            // lng: 0,
                            lat: markers?.position?.lat,
                            lng: markers?.position?.lng,
                          }} // Adjust center if needed
                          zoom={12}
                          onLoad={onLoad}
                          onUnmount={onUnmount}
                          mapContainerStyle={{
                            width: "23vw",
                            height: "50vh",
                          }}>
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
                      )} */}

                      <h4 className="mb-2 mt-2">{item?.slot_name}</h4>
                      <div id="map"></div>
                      <div id="pano"></div>
                      <div className="row information">
                        <div className="col-lg-12 col-lg-12 col-sm-12 col-md-12">
                          <p>
                            <strong>Parking Fees</strong>
                            <span>${item?.vehicle_fees} / Hour</span>
                          </p>
                        </div>

                        <div className="col-lg-12 col-lg-12 col-sm-12 col-md-12">
                          <p>
                            <strong>Final Price</strong>
                            <strong>${item?.vehicle_fees * totalHours}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div> </div>
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

export default ReviewBooking;
