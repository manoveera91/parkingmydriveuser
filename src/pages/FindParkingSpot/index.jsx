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

const FindParkingSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formIsValid, setFormIsValid] = useState(false);
  const [apiValue, setApiValue] = useState(null);
  const [latValue, setLatValue] = useState("");
  const [lngValue, setLngValue] = useState("");

  const [formData, setFormData] = useState({
    from: new Date(),
    to: new Date(),

    selectedFromTime: "",
    selectedToTime: "",
    event: "",
    destination: JSON.parse(localStorage.getItem('addressComponent')),
    vehicle_type: "",
  });
  console.log("form data", formData);

  const roundOffStartTime = () => {
    const now = new Date();
    const minutes = now.getMinutes();

    if (minutes > 0) {
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
    } else {
      now.setMinutes(0);
    }

    const formattedTime = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
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

    navigate("/list-parking-spot");

    // if (location.pathname === "/listing") {
    //   handleApi();
    // }
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
      <BreadCrumbs title={"Find A Parking Spot"} />
      <div className="loginOuter">
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
                              {Array.from({ length: 24 }, (_, index) => {
                                const hour = index % 12 || 12; // Get hour in 12-hour format
                                const ampm = index < 12 ? "AM" : "PM"; // Determine AM or PM
                                const formattedHour = ("0" + hour).slice(-2); // Ensure double-digit formatting
                                const formattedTime = `${formattedHour}:00 ${ampm}`; // Concatenate hour and AM/PM
                                return (
                                  <option key={index} value={formattedTime}>
                                    {formattedTime}
                                  </option>
                                );
                              })}
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
                              minDate={new Date(formData.from)}
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
                              {Array.from({ length: 24 }, (_, index) => {
                                const hour = index % 12 || 12; // Get hour in 12-hour format
                                const ampm = index < 12 ? "AM" : "PM"; // Determine AM or PM
                                const formattedHour = ("0" + hour).slice(-2); // Ensure double-digit formatting
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
                            Find Parking Slots
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
