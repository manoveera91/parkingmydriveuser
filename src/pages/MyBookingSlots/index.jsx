import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import BreadCrumbs from "../../components/BreadCrumbs";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
import { NavLink, useNavigate } from "react-router-dom";
const MyBookingSlots = () => {
  const [bookingCount, setBookingCount] = useState(0);
  const [cancelledBookingsCount, setCancelledBookingsCount] = useState(0);
  const [confirmedBookingsCount, setConfirmedBookingsCount] = useState(0);
  const [bookingLists, setBookingLists] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");

  useEffect(() => {
    fetchData();

    // setBookingCount(
    //   data.filter((item) => {
    //     return item;
    //   }).length
    // );
    // setCancelledBookingsCount(
    //   data.filter((item) => {
    //     return item.status === "cancelled";
    //   }).length
    // );
    // setConfirmedBookingsCount(
    //   data.filter((item) => {
    //     return item.status === "confirmed";
    //   }).length
    // );
  }, []);

  useEffect(() => {

    // Recent
    setBookingCount(
      bookingLists.filter((item) => {
        const expirationDate = new Date(item.from_datetime);
        const now = new Date();
        return item.status === "Booked" && expirationDate >= now;
      }).length
    );

    // Cancelled
    setCancelledBookingsCount(
      bookingLists.filter((item) => {
        return item.status === "Cancelled";
      }).length
    );

    // Completed
    setConfirmedBookingsCount(
      bookingLists.filter((item) => {
        const expirationDate = new Date(item.from_datetime);
        const now = new Date();
        return item.status != "Cancelled" && expirationDate < now;
      }).length
    );
  }, [bookingLists]);

  const handleDateChange = (date) => {
    setSelectedFromDate(date);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await OwnerAxiosClient.get("/api/owner-bookings");
      console.log("Bookingresponse data", response.data);
      if (response.data) {
        setLoading(false);
        setBookingLists(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (data) => {
    navigate("/view-booking-slot", { state: data });
  };

  const handleEdit = (data) => {
    navigate("/edit-booking-slot", { state: data });
  };

  const handleCancelClick = (data) => {
    navigate("/view-cancelled-booking", { state: data });
  };

  return (
    <div>
      {/* <Header /> */}
      {/* <div className="parking-slot-header">
        <NavLink className="parking-slots non-active" to="/my-parking-spot">
          My Driveways
        </NavLink>
        <NavLink className="parking-slots  active" to="/my-slot-bookings">
          Driveway Bookings
          <div className="sub-head-arrow"><div className="sub-label-arrow"></div></div>
        </NavLink>

        <NavLink className="parking-slots non-active" to="/earnings">
          My Earnings
        </NavLink>
      </div> */}
      <BreadCrumbs title="Driveway Bookings" />
      <div className="loginOuter afterownerLogin">
        <div className="container">
          <div className="dashboardList">
            <Tabs
              defaultActiveKey="recent"
              id="fill-tab-example"
              className="mb-3"
            >
              <Tab eventKey="recent" title={`Recent Booking (${bookingCount})`}>
                <div className="row">
                  <div className="col-lg-12 col-xs-12">
                    {loading ? (
                      <div className="loader row">
                        <div
                          className="col-lg-12 col-xs-12 "
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "500px",
                          }}
                        >
                          <Loader />
                        </div>
                      </div>
                    ) : (
                      <div className="tableListing table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Sl no</th>
                              <th> Name</th>
                              <th>From Date & Time </th>
                              <th>To Date & Time </th>
                              <th>Booked on</th>
                              <th>Vehicle Number</th>
                              <th>Slot</th>
                              <th>Amount</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {bookingLists
                              ?.filter((item) => {
                                const expirationDate = new Date(item.from_datetime);
                                const now = new Date();
                                return item.status === "Booked" && expirationDate >= now;
                              })
                              .map((booking, index) => (
                                <tr key={booking.id}>
                                  <td>{index + 1}</td>
                                  <td>{booking.user.name}</td>
                                  <td>{booking.from_datetime}</td>
                                  <td>{booking.to_datetime}</td>
                                  <td>{booking.booked_on}</td>
                                  <td>{booking.vehicle_number}</td>
                                  <td>{booking.slot}</td>
                                  <td>{booking.amount_paid}</td>

                                  <td>
                                    <i
                                      className="fa fa-eye"
                                      style={{
                                        marginRight: "5px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleClick(booking)}
                                    ></i>

                                    <i
                                      style={{
                                        marginRight: "5px",
                                        cursor: "pointer",
                                      }}
                                      className="fa fa-pencil text-success "
                                      onClick={() => handleEdit(booking)}
                                    ></i>
                                    {/* <i
                                  className="fa fa-trash text-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDelete(parkingSpot.id)}
                                ></i> */}
                                  </td>
                                </tr>
                              ))}
                            {bookingCount === 0 && (
                              <tr>
                                <td colSpan={8} style={{ textAlign: "center" }}>
                                  No Record found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div> </div>
                  </div>
                </div>
              </Tab>
              <Tab
                eventKey="completed"
                title={`Completed(${confirmedBookingsCount})`}
              >
                <div className="row">
                  <div className="col-lg-12 col-xs-12">
                    {loading ? (
                      <div className="loader row">
                        <div
                          className="col-lg-12 col-xs-12 "
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "500px",
                          }}
                        >
                          <Loader />
                        </div>
                      </div>
                    ) : (
                      <div className="tableListing table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Sl no</th>
                              <th> Name</th>
                              <th>From Date & Time</th>
                              <th>To Date & Time</th>
                              {/* <th>Vehicle Name</th> */}
                              <th>Vehicle Number</th>
                              <th>Slot</th>
                              <th>Amount</th>
                            </tr>
                          </thead>

                          <tbody>
                            {bookingLists
                              ?.filter((item) => {
                                console.log("item", item);
                                const expirationDate = new Date(item.from_datetime);
                                const now = new Date();
                                return item.status != "Cancelled" && expirationDate < now;
                              })
                              .map((booking, index) => (
                                <tr key={booking.id}>
                                  <td>{index + 1}</td>

                                  <td>{booking.user.name}</td>

                                  <td>{booking.from_datetime}</td>

                                  <td> {booking.to_datetime}</td>
                                  {/* <td>{booking.vehicle_name}</td> */}
                                  <td>{booking.vehicle_number}</td>
                                  <td>{booking.slot}</td>
                                  <td>{booking.amount_paid}</td>
                                </tr>
                              ))}
                            {confirmedBookingsCount === 0 && (
                              <tr>
                                <td colSpan={8} style={{ textAlign: "center" }}>
                                  No Record found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div> </div>
                  </div>
                </div>
              </Tab>
              <Tab
                eventKey="cancelled"
                title={`Cancelled(${cancelledBookingsCount})`}
              >
                <div className="row">
                  <div className="col-lg-12 col-xs-12">
                    {loading ? (
                      <div className="loader row">
                        <div
                          className="col-lg-12 col-xs-12 "
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "500px",
                          }}
                        >
                          <Loader />
                        </div>
                      </div>
                    ) : (
                      <div className="tableListing table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Sl no</th>
                              <th> Name</th>
                              <th>From Date & Time </th>
                              <th>To Date & Time</th>
                              <th>Booked On</th>
                              <th>Vehicle Number</th>
                              <th>Slot</th>
                              <th>Cancelled Date</th>
                              <th>Amount</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {bookingLists
                              ?.filter((item) => {
                                return item.status === "Cancelled";
                              })
                              .map((booking, index) => (
                                <tr key={booking.id}>
                                  <td>{index + 1}</td>

                                  <td>{booking.user.name}</td>

                                  <td>{booking.from_datetime}</td>

                                  <td> {booking.to_datetime}</td>

                                  <td>{booking.booked_on}</td>
                                  <td>{booking.vehicle_number}</td>

                                  <td>{booking.slot}</td>
                                  <td>
                                    {booking.cancelled_booking
                                      ? booking.cancelled_booking.cancelled_date
                                      : ""}
                                  </td>
                                  <td>{booking.amount_paid}</td>
                                  <td>
                                    <i
                                      className="fa fa-eye"
                                      style={{
                                        marginRight: "5px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleCancelClick(booking)}
                                    ></i>
                                  </td>
                                </tr>
                              ))}
                            {cancelledBookingsCount === 0 && (
                              <tr>
                                <td colSpan={8} style={{ textAlign: "center" }}>
                                  No Record found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div> </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyBookingSlots;
