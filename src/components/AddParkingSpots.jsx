import { useEffect, useState } from "react";
import BreadCrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import Header from "./Header";
import { formatDate } from "../utils/DateTime";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import DatePicker from "react-datepicker";
import Loader from "./Loader";
import { getLatLong } from "../utils/GoogleApi";
import { toast } from "react-toastify";
import OwnerAxiosClient from "../axios/OwnerAxiosClient";
import { useDispatch } from "react-redux";
import { saveUser } from "../redux/userSlice";

const AddParkingSpots = () => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [apiValue, setApiValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState(null);
  const navigate = useNavigate();
  const [fileError, setFileError] = useState('');
  useEffect(() => {
    console.log("Api value", apiValue);
    console.log("placeId api", apiValue?.value?.place_id);
    const getUtil = async () => {
      if (apiValue !== null) {
        const { lat, lng } = await getLatLong(apiValue?.value?.place_id);
        console.log("callback", lat, lng);
        setValue("google_map", apiValue?.label);

        if (lat && lng) {
          setValue("latitude", lat);
          setValue("longitude", lng);
        }
      }
    };
    getUtil();
  }, [apiValue]);

  useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  const onSubmit = async (data) => {
    console.log("errors", errors);
    setBackendError(null);
    setLoading(true);

    // Check if the google_map field is empty
    if (!apiValue) {
      setBackendError("Google Map field is required");
      return; // Stop form submission
    }

    console.log("submttted data", data);
    try {
      const formData = new FormData();
      // Append form data
      formData.append("slot_name", data.slot_name);
      formData.append("available_time", "24/7");
      formData.append("google_map", data.google_map);
      formData.append("latitude", data.latitude);
      formData.append("longitude", data.longitude);
      formData.append("available_slots", "1");
      formData.append("from_date_time", formatDate(data.from_date_time));
      formData.append("to_date_time", formatDate(data.to_date_time));
      formData.append("nearby_places", data.nearby_places);
      formData.append("vehicle_types", data.vehicle_types);
      formData.append("vehicle_fees", data.vehicle_fees);
      // Append image files
      for (let i = 0; i < data.photos.length; i++) {
        formData.append("photos[]", data.photos[i]);
      }

      const response = await OwnerAxiosClient.post(
        "/api/owner-parking-spots",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // if (!response.ok) {
      //   throw new Error("Error occurred while submitting the form");
      // }

      // const responseData = await response.json();
      console.log("Add parking Spot ", response);

      if (response.status === 200 || response.status === 201) {
        dispatch(
          saveUser({
            data: {
              spotLength: 1
            },
          })
        );
        toast.success("Parking spot added successfully!");
        setLoading(false);
        navigate("/my-parking-spot");
      }
      if (response?.error?.status === 422) {
        setError('photos', { type: 'required', message: 'Invalid file type. Only image files are allowed.' });
      } else if (response.status !== 200 && response.status !== 201) {
        console.log("backend error", response.data, response);
        setBackendError("Internal server error");
      }
    } catch (error) {
      // toast.error("Something went wrong!");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const CustomDatePickerInput = ({ value, onClick }) => {
    console.log("date ", value);
    return (
      <>
        <div className="input-group date picker-date" id="datepicker">
          <input
            required
            type="text"
            className="form-control style-2 border-right"
            value={value || ""}
            onClick={onClick}
            placeholder="Choose Date "
          />
          <span className="input-group-append" onClick={onClick}>
            <span className="input-group-text bg-white d-block">
              <i className="fa fa-calendar"></i>
            </span>
          </span>
        </div>
      </>
    );
  };

  const handleFileChange = (e) => {
    console.log("errors", errors);
    const files = Array.from(e.target.files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];

    let isValid = true;
    files.forEach(file => {
      if (!validImageTypes.includes(file.type)) {
        isValid = false;
      }
    });

    if (!isValid) {
      setFileError('Only image files are allowed.');
      setError('photos', { type: 'required', message: 'Invalid file type. Only image files are allowed.' });
    } else {
      setFileError('');
      clearErrors('photos');
    }
  };

  return (
    <div>
      {/* <Header /> */}
      <BreadCrumbs title="Add Slot" />
      <div className="loginOuter afterownerLogin">
        <div className="container">
          <div className="dashboardList">
            <div className="row">
              <div className="col-lg-8 col-md-12 mx-auto">
                <div className="card mb-4 p-5">
                  <div className="card-body corporateMenu">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {/* Slot Name */}
                      <div className="form-group row">
                        <label
                          htmlFor="slot_name"
                          className="control-label col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12"
                        >
                          Slot Name
                        </label>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12">
                          <input
                            type="text"
                            id="slot_name"
                            name="slot_name"
                            {...register("slot_name", { required: true })}
                            className="form-control"
                          />
                          {errors?.slot_name && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Google Map */}
                      <div className="form-group row">
                        <label
                          htmlFor="google_map"
                          className="control-label col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12"
                        >
                          Address
                        </label>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12">
                          <GooglePlacesAutocomplete
                            apiKey={import.meta.env.VITE_APP_GOOGLE_API_KEY}
                            selectProps={{
                              apiValue,
                              onChange: setApiValue,
                            }}
                            {...register("google_map", { required: true })}
                          />

                          {errors?.google_map && !apiValue && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Latitude */}
                      {/* <div className="form-group row">
                        <label
                          htmlFor="latitude"
                          className="control-label col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12"
                        >
                          Latitude
                        </label>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12">
                          <input
                            type="text"
                            id="latitude"
                            disabled
                            name="latitude"
                            {...register("latitude", {
                              required: true,
                            })}
                            className="form-control"
                          />
                          {errors?.latitude && !apiValue && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div> */}

                      {/* Longitude */}
                      {/* <div className="form-group row">
                        <label
                          htmlFor="longitude"
                          className="control-label col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12"
                        >
                          Longitude
                        </label>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12">
                          <input
                            type="text"
                            id="longitude"
                            disabled
                            name="longitude"
                            {...register("longitude", {
                              required: true,
                            })}
                            className="form-control"
                          />
                          {errors?.longitude && !apiValue && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div> */}



                      {/* From Date */}
                      <div className="form-group row">
                        <label
                          htmlFor="from_date_time"
                          className="control-label col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12"
                        >
                          Available From Date
                        </label>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12">
                          <DatePicker
                            minDate={new Date()}
                            selected={fromDate} // Pass the selected date here
                            name="from_date_time"
                            customInput={<CustomDatePickerInput />}
                            onChange={(date) => {
                              setFromDate(date);
                              // setError("from_date_time", { required: true });
                              // Handle date change and set the value using setValue
                              setValue("from_date_time", date);
                              setValue("to_date_time", "");
                              setToDate(null);
                            }}
                          // {...register("from_date_time", {
                          //   required: "From Date is required",
                          // })}
                          // {...register("from_date_time", {
                          //   required: true,
                          // })}
                          />
                          {errors?.from_date_time && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>

                      {/* To Date */}
                      <div className="form-group row">
                        <label
                          htmlFor="to_date_time"
                          className="control-label col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12"
                        >
                          Available To Date
                        </label>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12">
                          <DatePicker
                            minDate={new Date(fromDate)}
                            selected={toDate} // Pass the selected date here
                            name="to_date_time"
                            customInput={<CustomDatePickerInput />}
                            onChange={(date) => {
                              setToDate(date);
                              // setError("to_date_time", {
                              //   types: {
                              //     required: true,
                              //   },
                              // });

                              // Handle date change and set the value using setValue
                              setValue("to_date_time", date);
                            }}
                          // {...register("to_date_time", {
                          //   required: true,
                          // })}
                          />
                          {errors?.to_date_time && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>

                      {/* <div className="form-group row">
                          <label
                            htmlFor="vehicle_types"
                            className="control-label col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12"
                          >
                            Vehicle Types
                          </label>
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12">
                            <input
                              type="text"
                              id="vehicle_types"
                              name="vehicle_types"
                              {...register("vehicle_types", { required: true })}
                              className="form-control"
                            />
                            {errors?.vehicle_types && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>*/}

                      {/* Vehicle Fees*/}
                      <div className="form-group row">
                        <label
                          htmlFor="vehicle_fees"
                          className="control-label col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12"
                        >
                          Fees
                        </label>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12">
                          <input
                            type="text"
                            id="vehicle_fees"
                            name="vehicle_fees"
                            {...register("vehicle_fees", { required: true })}
                            className="form-control"
                          />
                          {errors?.vehicle_fees && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Nearby Places or comment */}
                      <div className="form-group row">
                        <label
                          htmlFor="nearby_places"
                          className="control-label col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12"
                        >
                          Comment
                        </label>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12">
                          <input
                            type="text"
                            id="nearby_places"
                            name="nearby_places"
                            {...register("nearby_places", { required: true })}
                            className="form-control"
                          />
                          {errors?.nearby_places && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Available Time */}
                      {/* <div className="form-group row">
                        <label
                          htmlFor="available_time"
                          className="control-label col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12"
                        >
                          Parking Spots Available
                        </label>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12">
                          <select
                            id="available_time"
                            name="available_time"
                            {...register("available_time", {
                              required: true,
                            })}
                            className="form-control"
                          >
                            <option value="24/7">24/7</option>
                          </select>
                          {errors?.available_time && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div> */}

                      {/* Available Slots */}
                      {/* <div className="form-group row">
                        <label
                          htmlFor="available_slots"
                          className="control-label col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12"
                        >
                          Parking Spots Available
                        </label>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12">
                          <input
                            type="text"
                            id="available_slots"
                            name="available_slots"
                            {...register("available_slots", {
                              required: "Invalid numeric format",
                              validate: (value) =>
                                !isNaN(value) || "Invalid numeric format",
                            })}
                            className="form-control"
                          />
                          {errors?.available_slots && (
                            <span className="text-danger">
                              Invalid numeric format
                            </span>
                          )}
                        </div>
                      </div> */}

                      {/* Photos */}
                      <div className="form-group row">
                        <label
                          htmlFor="photos"
                          className="control-label col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12"
                        >
                          Photos
                        </label>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12">
                          <input
                            type="file"
                            id="photos"
                            multiple
                            name="photos"
                            accept="image/*"

                            {...register("photos", { required: true, message: fileError })}
                            className="form-control"
                            onChange={handleFileChange}
                          />
                          {errors?.photos && (
                            <span className="text-danger">
                              {/* {fileError || 'This field is required'}  */}
                              {errors?.photos?.message == '' ? 'This field is required' : errors?.photos?.message}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="form-group row">
                        <div className="col-md-12 offset-lg-3">
                          <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                          >
                            {loading ? (
                              <div className="loader">
                                <Loader />
                              </div>
                            ) : (
                              "Add"
                            )}
                          </button>
                          <NavLink
                            to="/my-parking-spot"
                            className="btn btn-outline"
                            style={{ marginLeft: "50px" }}
                          >
                            Cancel
                          </NavLink>
                        </div>
                      </div>

                      {backendError && (
                        <span className="text-danger">
                          Internal server error
                        </span>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddParkingSpots;
