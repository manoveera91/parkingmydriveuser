import Footer from "../../components/Footer";
import Header from "../../components/Header";
import PopularParking from "../../components/PopularParking";
import ParkingSpace from "../../components/ParkingSpace";
import Search from "../../components/Search";
import ParkingList from "../../components/ParkingListOld";
import { useEffect, useState } from "react";
import AxiosClient from "../../axios/AxiosClient";
import { combineDateTime } from "../../utils/DateTime";
import Loader from "../../components/Loader";

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Listing = () => {
  const searchState = useSelector((state) => {
    return state.search.value;
  });
  const { state } = useLocation();

  const [loading, setLoading] = useState(false);
  const [parkingListData, setParkingListData] = useState([]);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    event: "",
    destination: "",
    vehicle_type: "",
  });
  const [error, setError] = useState(null);

  const getApi = async () => {
    console.log("getapi", searchState.from);
    setParkingListData([]);
    setError(null);
    try {
      setLoading(true); // Set loading state to true when fetching data
      await AxiosClient.get("/sanctum/csrf-cookie");
      const { data, status } = await AxiosClient.post(
        "/api/getParkingSpotsByDateTime",
        {
          from_datetime: combineDateTime(
            searchState.from,
            searchState.selectedFromTime
          ),
          to_datetime: combineDateTime(
            searchState.to,
            searchState.selectedToTime
          ),
        }
      );
      if (status === 200) {
        setParkingListData(data);
      }
    } catch (error) {
      setError("Internal Server Error");
      console.error("Error fetching data from the API:", error);
    } finally {
      setLoading(false); // Set loading state to false when fetching is done
    }
  };

  useEffect(() => {
    console.log("getapi useeffect", searchState.from);
    setFormData((state) => ({
      from: searchState.from,
      to: searchState.to,
      event: "",
      destination: searchState.destination,
      vehicle_type: "",
    }));
    if (searchState.from !== "" && searchState.to !== "") {
      getApi();
    } else {
      setFormData((state) => ({
        from: new Date(),
        to: new Date(),
        event: "",
        destination: "OMR",
        vehicle_type: "",
      }));
    }
  }, [searchState.from, searchState.to, searchState.destination, searchState]);

  useEffect(() => {
    if (searchState.from !== "" && searchState.to !== "") {
      getApi();
    }
    if (state) {
      console.log(state);
      setParkingListData(state);
    }
    getParkingList();
  }, []);

  const getParkingList = async () => {
    setParkingListData([]);
    setError(null);
    try {
      setLoading(true); // Set loading state to true when fetching data
      await AxiosClient.get("/sanctum/csrf-cookie");
      const { data, status } = await AxiosClient.get("/api/getParkingSpots");
      if (status === 200) {
        console.log("response data", data);
        setParkingListData(data);
      }
    } catch (error) {
      setError("Internal Server Error");
      console.error("Error fetching data from the API:", error);
    } finally {
      setLoading(false); // Set loading state to false when fetching is done
    }
  };

  return (
    <>
      {/* <Header /> */}

      <Search title="Refine Your Parking Selection" />
      {loading ? (
        <div
          style={{
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      ) : (
        <>
          {error && (
            <div
              style={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="text-danger">{error}</span>
            </div>
          )}
          {parkingListData.length > 0 ? (
            <ParkingList data={parkingListData} />
          ) : (
            <div
              style={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p>No spots found for the location. Please <a href="/find-parking-spot">click</a> here to find more...</p>
            </div>
          )}
        </>
      )}
      <ParkingSpace />
      <PopularParking />
      <Footer />
    </>
  );
};

export default Listing;
