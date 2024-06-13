import { useEffect, useState } from "react";
import BreadCrumbs from "../../components/BreadCrumbs";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { searchSubmit } from "../../redux/searchSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { getLatLong } from "../../utils/MapUtils";
import AxiosClient from "../../axios/AxiosClient";
import { combineDateTime } from "../../utils/DateTime";
import { filterNearbyPoints } from "../../utils/MapUtils";
import Loader from "../../components/Loader";
const FindParkingSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nearByPlaceLength, setNearByPlaceLength] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [apiValue, setApiValue] = useState(null);
  const [latValue, setLatValue] = useState("");
  const [lngValue, setLngValue] = useState("");
  const [fromHours, setfromHours] = useState([]);
  const [toHours, setToHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentDate = new Date();
  const fromDate = new Date(currentDate);
  const toDate = new Date(currentDate);
  fromDate.setHours(fromDate.getHours() + 1);
  toDate.setHours(toDate.getHours() + 2);
  const [formData, setFormData] = useState({
    from: fromDate,
    to: toDate,
    selectedFromTime: "",
    selectedToTime: "",
    event: "",
    destination: JSON.parse(localStorage.getItem('addressComponent')),
    vehicle_type: "",
  });
  console.log("form data", formData);

  useEffect(() => {
    const currentDate = new Date();
    const fromDate = new Date(currentDate);
    const toDate = new Date(currentDate);
    fromDate.setHours(fromDate.getHours() + 1);
    toDate.setHours(fromDate.getHours() + 2);
    setFormData({ ...formData, from: fromDate, to: toDate });
    setfromHours(generateFutureTimeList(new Date(), 'from'));
    setToHours(generateFutureTimeList(new Date(), 'to'));
  }, []); // Empty dependency array means this runs once when the component mounts


  const generateFutureTimeList = (date, type) => {
    const times = [];
    const currentDateFormat = convertDateTimeFormat(new Date());
    const dateFormat = convertDateTimeFormat(date);
    // Round to the next hour
    const now = new Date(date);
    if ((currentDateFormat == dateFormat) && type == 'from' ) {
      now.setHours(now.getHours() + 1);
    }
    now.setMinutes(0, 0, 0);
    const currentHour = now.getHours();

    for (let i = currentHour; i < 24; i++) {
      let hours = i;
      const minutes = '00';
      const ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const hoursStr = hours < 10 ? '0' + hours : hours;

      const timeStr = hoursStr + ':' + minutes + ' ' + ampm;
      times.push(timeStr);
    }
    // if (date > formData.to) {
    if (type == 'from') {
      setFormData({ ...formData, from: date, to: date, selectedFromTime: times[0], selectedToTime: times[1] });
    } else if (type == 'to') {
      setFormData({ ...formData, to: date, selectedToTime: times[0] });
    }

    console.log(formData);
    return times;
  };

  const roundOffStartTime = () => {
    const now = new Date();
    const minutes = now.getMinutes();

    if (minutes > 0) {
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
    } else {
      now.setMinutes(0);
    }

    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFormData(prevState => ({
      ...prevState,
      selectedFromTime: handleFromTimeChange(formattedTime)
    }));
  }

  useEffect(() => {
    setApiValue(formData.destination);
  }, [formData.destination]);

  const [error, setError] = useState({
    from: "",
    to: "",
    event: "",
    destination: "",
    selectedToTime: "",
    selectedFromTime: "",
  });

  const onChange = (name, value) => {
    console.log("on change value", name, value);
    if (name === "from" || name === "to") {
      // Convert the selected date to a string representation
      value = value ? new Date(value).toISOString() : ""; // Handle the case when the date is null
    }

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
    roundOffStartTime();
    console.log("Api value", formData.destination);
    console.log("Api value1", formData.destination);
    console.log("placeId api", formData.destination?.value?.place_id);
    const getUtil = async () => {
      if (formData.destination !== null) {
        const { lat, lng } = await getLatLong(
          formData.destination?.value?.place_id
        );
        console.log("callback", lat, lng);
        // setValue("google_map", formData.destination?.label);
        if (lat && lng) {
          setLatValue(lat);
          setLngValue(lng);

          // setApiValue("longitude", lng);
        } else {
          setLatValue(localStorage.getItem('currentLat'));
          setLngValue(localStorage.getItem('currentLong'));
        }
      }
    };
    getUtil();
  }, [formData.destination]);

  const onSubmit = async (e) => {
    setLoading(true);
    setNearByPlaceLength(false);
    e.preventDefault();
    console.log("formData", formData);
    // Validate form fields
    const newErrorState = { ...error };

    if (!formData.from) {
      newErrorState.from = "From date is required";
    }

    if (!formData.to) {
      newErrorState.to = "To date is required";
    }

    if (!formData.destination) {
      newErrorState.destination = "Destination is required";
    }

    if (!formData.selectedFromTime) {
      newErrorState.selectedFromTime = "Time is required";
    }

    if (!formData.selectedToTime) {
      newErrorState.selectedToTime = "Time is required";
    }
    // if (!formData.vehicle_type) {
    //   newErrorState.vehicle_type = "Vehicle Type is required";
    // }

    // Check if there are any errors
    if (Object.values(newErrorState).some((value) => value !== "")) {
      console.log("new errorstate", newErrorState);
      setError((state) => newErrorState);
      setFormIsValid(false);
      return;
    }

    // If all fields are valid, set formIsValid to true
    setFormIsValid(true);
    // Add your logic for handling form submission here

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

    dispatch(
      searchSubmit({
        data: {
          ...formData,
          lat: latValue,
          lng: lngValue,
        },
      })
    );
    localStorage.setItem("latitude", latValue);
    localStorage.setItem("longitude", lngValue);

    await AxiosClient.get("/sanctum/csrf-cookie");
    const { data, status } = await AxiosClient.post(
      "/api/getParkingSpotsByDateTime",
      {
        from_datetime: combineDateTime(
          formData.from,
          formData.selectedFromTime
        ),
        to_datetime: combineDateTime(
          formData.to,
          formData.selectedToTime
        ),
      }
    );
    if (status === 200) {
      const storedLatitude = localStorage.getItem("latitude");
      const storedLongitude = localStorage.getItem("longitude");
      // Example usage
      const baseLat = storedLatitude; // Base latitude
      const baseLng = storedLongitude; // Base longitude
      const maxDistance = 10; // Maximum distance in km
      const spotsArray = Object.values(data);
      const newPoints = spotsArray.map((item, index) => ({
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
      }));

      // Filter nearby points
      const nearbyPoints = filterNearbyPoints(
        baseLat,
        baseLng,
        newPoints,
        maxDistance
      );

      console.log("vc Nearby Points:", nearbyPoints);
      if (nearbyPoints.length > 0) {
        navigate("/list-parking-spot");
      } else {
        setNearByPlaceLength(true);
      }
    }

    // if (location.pathname === "/listing") {
    //   handleApi();
    // }
    setLoading(false);
  };

  const CustomDatePickerInput = ({ value, onClick }) => (
    <>
      <div className="input-group date picker-date" id="datepicker">
        <input
          type="text"
          className="form-control style-2 border-right"
          value={value}
          onClick={onClick}
          placeholder="Choose Date"
        />
        <span className="input-group-append" onClick={onClick}>
          <span className="input-group-text bg-white d-block">
            <i className="fa fa-calendar"></i>
          </span>
        </span>
      </div>
    </>
  );

  const handleFromDateChange = (date) => {
    const currentDateFormat = convertDateTimeFormat(new Date());
    const dateFormat = convertDateTimeFormat(date);
    if (currentDateFormat == dateFormat) {
      setfromHours(generateFutureTimeList(new Date(), 'from'));
      setToHours(generateFutureTimeList(new Date(), 'from'));
    } else {
      date.setHours(0, 0, 0, 0);
      setfromHours(generateFutureTimeList(date, 'from'));
      setToHours(generateFutureTimeList(date, 'from'));
    }
  };

  const convertDateTimeFormat = (date) => {
    const currentDate = new Date();

    // Extract the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Convert to string in the format YYYY-MM-DD
    const currentDateString = `${year}-${month}-${day}`;
    return currentDateString;
  }

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
      // toAmPm = ampm === "AM" ? "PM" : "AM";
    }

    // Format the "To" time
    const formattedToTime = `${toTimeHour
      .toString()
      .padStart(2, "0")}:00 ${toAmPm}`;
    if (time == '11:00 PM') {
      const tomorrow = new Date(formData.from);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      setToHours(generateFutureTimeList(tomorrow, 'to'));
      setFormData({
        ...formData,
        to: tomorrow,
        selectedFromTime: time,
        selectedToTime: formattedToTime,
      });
    } else {
      const currentDateFormat = convertDateTimeFormat(formData.from);
      const dateFormat = convertDateTimeFormat(formData.to);
      if (currentDateFormat == dateFormat) {
        const hours = generateFutureTimeList(formData.to, 'to');
        const fromTimeIndex = hours.indexOf(time);
        const filteredToHours = fromTimeIndex !== -1 ? hours.slice(fromTimeIndex + 1) : hours;
        setToHours(filteredToHours);
        setFormData({
          ...formData,
          selectedFromTime: time,
          selectedToTime: formattedToTime,
        });
      } else {
        setFormData({
          ...formData,
          selectedFromTime: time,
          selectedToTime: toHours[0],
        });
      }
    }
    // Update the form data with the new "From" and "To" times

  };

  const handleToDateChange = (date) => {
    // if (date < formData.from) {
    //   setFormData({ ...formData, to: formData.from });
    // } else {
    //   setFormData({ ...formData, to: date });
    // }
    const currentDateFormat = convertDateTimeFormat(new Date());
    const dateFormat = convertDateTimeFormat(date);
    if (currentDateFormat == dateFormat) {
      setToHours(generateFutureTimeList(new Date(), 'to'));
    } else {
      date.setHours(0, 0, 0, 0);
      setToHours(generateFutureTimeList(date, 'to'));
    }

  };

  const minToDate = () => {
    if (formData.selectedFromTime == '11:00 PM') {
      const ddd = new Date(formData.from);
      let nextDate = new Date(ddd);
      return nextDate.setDate(currentDate.getDate() + 1);
    } else {
      return new Date(formData.from);
    }
  }

  return (
    <>
      {/* <Header /> */}
      <BreadCrumbs title={"Find A Parking Spot"} />
      <div className="loginOuter">
        {nearByPlaceLength && (
          <p className="no-spot-found">No spots found for the location. Please find more...</p>
        )}
        <div className="container">
          <form onSubmit={onSubmit}>
            <div className="row">
              <div className="col-lg-6 col-md-12 mx-auto">
                <div className="card mb-4">
                  <div className="registerBg">
                    <h4 className="">The clever approach to locate parking</h4>
                    <div className="row">
                      <div className="form-group mb-3 col-12">
                        <label>Search Parking Slot</label>
                        <GooglePlacesAutocomplete
                          apiKey={import.meta.env.VITE_APP_GOOGLE_API_KEY}
                          selectProps={{
                            value: apiValue,
                            placeholder: 'Address',
                            apiValue: formData.destination,
                            onChange: (value) => {
                              setApiValue(value);
                              onChange("destination", value);
                            },
                          }}
                        />

                        {error.destination && (
                          <span className="text-danger">
                            {error.destination}
                          </span>
                        )}
                      </div>

                      <div className="form-group mb-3 col-lg-6 col-md-6">
                        <label>From</label>
                        <div className="input-group date" id="datepicker">
                          <div className="picker">
                            <DatePicker
                              minDate={new Date()}
                              selected={formData.from}
                              customInput={<CustomDatePickerInput />}
                              onChange={handleFromDateChange}
                            // onChange={
                            //   (date) => onChange("from", date)
                            //    }
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
                              {/* {Array.from({ length: 24 }, (_, index) => {
                                const hour = index % 12 || 12; // Get hour in 12-hour format
                                const ampm = index < 12 ? "AM" : "PM"; // Determine AM or PM
                                const formattedHour = ("0" + hour).slice(-2); // Ensure double-digit formatting
                                const forTime = `${formattedHour}:00 ${ampm}`;
                                const formattedTime = fromHours.filter((item) => {
                                return item === forTime
                                });
                                // const formattedTime = `${formattedHour}:00 ${ampm}`; // Concatenate hour and AM/PM
                                return (
                                  <option key={index} value={formattedTime}>
                                    {formattedTime}
                                  </option>
                                );
                              })} */}
                              {fromHours.map((time, index) => {
                                return (
                                  <option key={index} value={time}>
                                    {time}
                                  </option>
                                );
                              }
                              )}
                            </select>
                          </div>
                          {error.from && (
                            <span className="text-danger">{error.from}</span>
                          )}
                          &nbsp;
                          {error.selectedFromTime && (
                            <span className="text-danger">
                              {error.selectedFromTime}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="form-group mb-3 col-lg-6 col-md-6">
                        <label>To</label>
                        <div className="input-group date" id="datepicker1">
                          <div className="picker">
                            <DatePicker
                              minDate={minToDate()}
                              selected={formData.to}
                              customInput={<CustomDatePickerInput />}
                              onChange={handleToDateChange}
                            // onChange={(date) => onChange("to", date)}
                            />
                            <select
                              className="form-control style-2"
                              value={formData.selectedToTime}
                              // onChange={(e) =>
                              //   handleToTimeChange(e.target.value)
                              // }
                              onChange={(e) =>
                                onChange("selectedToTime", e.target.value)
                              }
                            >
                              {/* Populate options for time selection */}
                              {/* {Array.from({ length: 24 }, (_, index) => {
                                const hour = index % 12 || 12; // Get hour in 12-hour format
                                const ampm = index < 12 ? "AM" : "PM"; // Determine AM or PM
                                const formattedHour = ("0" + hour).slice(-2); // Ensure double-digit formatting
                                const formattedTime = `${formattedHour}:00 ${ampm}`; // Concatenate hour and AM/PM
                                return (
                                  <option key={index} value={formattedTime}>
                                    {formattedTime}
                                  </option>
                                );
                              })} */}
                              {toHours.map((time, index) => (
                                <option key={index} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                          {error.to && (
                            <span className="text-danger">{error.to}</span>
                          )}
                          &nbsp;
                          {error.selectedToTime && (
                            <span className="text-danger">
                              {error.selectedToTime}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="d-grid">
                          <button type="submit" className="btn btn-primary">
                            {loading ? (
                              <div className="loader">
                                <Loader />
                              </div>
                            ) : (
                              "Find Parking Slots"
                            )}

                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FindParkingSpot;
