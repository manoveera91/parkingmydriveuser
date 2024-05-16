import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookingImg1 from "../../assets/images/bookingimg1.png";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ParkingSpace from "../../components/ParkingSpace";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CardBookingHistory from "../../components/CardBookingHistory";
import AxiosClient from "../../axios/AxiosClient";
import ReturnStatus from "../../components/ReturnStatus";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { convertToMySQLDate } from "../../utils/DateTime";
import { toast } from "react-toastify";

const BookingHistory = () => {
  const userRedux = useSelector((state) => {
    return state.user.value;
  });
  // const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [selectedCancelItem, setSelectedCancelItem] = useState({});
  const [bookingCount, setBookingCount] = useState(0);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelledBookingsCount, setCancelledBookingsCount] = useState(0);
  const [confirmedBookingsCount, setConfirmedBookingsCount] = useState(0);

  const [comment, setComment] = useState("");
  const [paymentChecked, setPaymentChecked] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // if (searchParams.has("paypal") && searchParams.has("booking")) {
    if (searchParams.has("paypal")) {
      if (searchParams.get("paypal") == "cancel") {
        //
        // navigate("/review-booking");
        // setSuccess(false);
        toast.error(" Booking  Failed. ");
      }
      if (searchParams.get("paypal") == "success") {
        console.log("calling success");
        // setSuccess(true);
        // showSuccessStatus();

        const checkPayment = async () => {
          setPaymentChecked(true);
          try {
            const response = await AxiosClient.post("/api/payment-return", {
              booking_id: searchParams.get("booking"),
              token: searchParams.get("token"),
              status: searchParams.get("paypal"),
            });

            console.log("payment response", response);
            if (response.status === 200) {
              // setLoading(true);
              fetchData();
              toast.success(" Your parking is confirmed. ");

              setShow(false);
            }
            // else {
            //   toast.error(" Payment is not successful ");
            // }
            // Handle success response
          } catch (error) {
            console.error("Error Cancel booking:", error);
            // Handle error
          }
        };
        paymentChecked !== true && checkPayment();
      }
      console.log(searchParams);
      console.log(searchParams.get("booking"));
      console.log(searchParams.get("paypal"));
      console.log(searchParams.get("token"));
    }
  }, [searchParams]);

  const handleClose = () => setShow(false);

  const handleShow = (data) => {
    console.log("handleShow data", data);
    setSelectedCancelItem(data);
    setShow(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setBookingCount(
      bookingData.filter((item) => {
        return item.status === "Booked";
      }).length
    );
    setCancelledBookingsCount(
      bookingData.filter((item) => {
        return item.status === "Cancelled";
      }).length
    );
    setConfirmedBookingsCount(
      bookingData.filter((item) => {
        return item.status === "Confirmed";
      }).length
    );
  }, [bookingData]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosClient.get("/api/bookings");
      console.log("response booking data", response.data);

      if (response.data) {
        setLoading(false);
        const filteredUser = response.data.filter(
          (item) => item.user.email === userRedux.email
        );

        setBookingData(filteredUser);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const response = await AxiosClient.post("/api/cancel-booking", {
        booking_id: selectedCancelItem.id,
        cancelled_by: "User",
        total_hours: selectedCancelItem.time,
        cancelled_date: convertToMySQLDate(new Date()),
        refund_status: "Pending",
        reason_for_cancellation: comment, // Assuming this is defined elsewhere
      });

      console.log("Cancel Booking data", response.data);

      if (response.data) {
        setLoading(false);

        fetchData(); // Assuming this function fetches updated data
      }

      setShow(false);

      // Handle success response
    } catch (error) {
      console.error("Error Cancel booking:", error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="graybg">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>Booking History</h2>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className="loader"
          style={{
            height: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      ) : (
        <div className="loginOuter">
          <div className="container">
            {/* <div id="thank">
              <ReturnStatus
                status={searchParams.get("paypal") == "success" ? true : false}
              />
            </div> */}

            <div className="row">
              <div className="col-lg-12 mx-auto">
                <Tabs
                  defaultActiveKey="recent"
                  id="fill-tab-example"
                  className="mb-3"
                >
                  <Tab
                    eventKey="recent"
                    title={`Recent Booking (${bookingCount})`}
                  >
                    {bookingData
                      ?.sort(
                        (a, b) => new Date(b.booked_on) - new Date(a.booked_on)
                      )
                      .slice(0, 10)
                      .filter((item) => {
                        return item.status === "Booked";
                      })
                      .map((item) => (
                        <CardBookingHistory
                          key={item.id}
                          id={item.id}
                          img={item.parking_spots.photos}
                          time={item.total_hours}
                          amount={item.amount_paid}
                          date={item.from_datetime}
                          vehicle_number={item.vehicle_number}
                          location={item.parking_spots.google_map}
                          title={item.slot}
                          payed_on={item.payed_on}
                          onClick={handleShow}
                          status={item.status}
                          booked_on={item.booked_on}
                          // img={BookingImg1}
                        />
                      ))}
                    {bookingData?.filter((item) => item.status === "Booked")
                      .length === 0 && <div>No records found</div>}
                  </Tab>
                  <Tab
                    eventKey="completed"
                    title={`Completed(${confirmedBookingsCount})`}
                  >
                    {bookingData
                      ?.filter((item) => {
                        return item.status === "Confirmed";
                      })
                      .map((item) => (
                        <CardBookingHistory
                          key={item.id}
                          id={item.id}
                          time={item.time}
                          amount={item.amount_paid}
                          date={item.from_datetime}
                          vehicle_number={item.vehicle_number}
                          location={item.parking_spots.google_map}
                          title={item.slot}
                          payed_on={item.payed_on}
                          onClick={handleShow}
                          status={item.status}
                          img={item.parking_spots.photos}
                          booked_on={item.booked_on}
                        />
                      ))}
                    {bookingData?.filter((item) => item.status === "Confirmed")
                      .length === 0 && <div>No records found</div>}
                  </Tab>
                  <Tab
                    eventKey="cancelled"
                    title={`Cancelled(${cancelledBookingsCount})`}
                  >
                    {bookingData
                      ?.filter((item) => {
                        return item.status === "Cancelled";
                      })
                      .map((item) => (
                        <CardBookingHistory
                          key={item.id}
                          id={item.id}
                          time={item.time}
                          amount={item.amount_paid}
                          date={item.from_datetime}
                          vehicle_number={item.vehicle_number}
                          location={item.parking_spots.google_map}
                          title={item.slot}
                          payed_on={item.payed_on}
                          onClick={handleShow}
                          status={item.status}
                          img={item.parking_spots.photos}
                          booked_on={item.booked_on}
                          cancelled_booking={item.cancelled_booking}
                        />
                      ))}
                    {bookingData?.filter((item) => item.status === "Cancelled")
                      .length === 0 && <div>No records found</div>}
                  </Tab>
                </Tabs>

                {/* Modal content starts */}
              </div>
            </div>
          </div>
        </div>
      )}

      <ParkingSpace />
      <Footer />
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <div className=" booklistingContent">
            <img
              src={
                selectedCancelItem.img &&
                selectedCancelItem.img.length > 0 &&
                selectedCancelItem.img[0].photo_path &&
                `${
                  import.meta.env.VITE_APP_BASE_URL
                }/storage/${selectedCancelItem.img[0].photo_path.slice(6)}`
              }
              className="img-fluid"
            />
            <h3>
              <a>{selectedCancelItem.title}</a>
            </h3>
            <div className="location">{selectedCancelItem.location}</div>

            <div className="time">
              Booked on :{selectedCancelItem.booked_on}
            </div>

            <div className="dollar">
              <span>Total Cost:</span> ${selectedCancelItem.amount}
            </div>

            <div className="row mb-2">
              <label
                htmlFor="inputEmail3"
                className="col-xl-12 col-lg-12 col-sm-12 col-md-12 col-form-label"
              >
                Comments
              </label>
              <div className="col-lg-12 col-lg-12 col-sm-12 col-md-12">
                <textarea
                  id="commentInput"
                  className="form-control"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
            </div>
            {/* <div className="amount">$ {selectedCancelItem.amount}</div> */}
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <Button variant="primary" onClick={handleCancel}>
            {loading ? (
              <div className="loader">
                <Loader />
              </div>
            ) : (
              " Cancel Booking"
            )}
          </Button>

          <Button
            variant="primary"
            style={{
              background: "#333",
              border: "1px solid #eee",
              color: "#fff",
            }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BookingHistory;
