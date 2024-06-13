import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import BreadCrumbs from "../../components/BreadCrumbs";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
import {
  getYesterdayFormatted,
  isToday,
  isYesterday,
} from "../../utils/DateTime";
import { NavLink } from "react-router-dom";

const Earnings = () => {
  const [bookingLists, setBookingLists] = useState([]);
  const [paymentLists, setPaymentLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [yesterdayDate, setYesterdayDate] = useState();
  const [todayDate, setTodayDate] = useState();
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  let pendingTotal = 0;
  let total = 0;
  useEffect(() => {
    fetchData();
    fetchPaymentData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await OwnerAxiosClient.get("/api/owner-bookings");
      console.log("Earnings response data", response.data);
      if (response.data) {
        setLoading(false);

        const filteredBooking = response.data.filter(
          (booking) => booking.status === "Booked"
        );
        total = filteredBooking.reduce((accumulator, currentValue) => {
          return accumulator + Number(currentValue.amount_paid);
        }, 0);
        setTotalAmount(total);
        setBookingLists(filteredBooking);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await OwnerAxiosClient.get("/api/owner-payment-received");
      console.log("Earnings response data", response.data);
      if (response.data) {
        setLoading(false);
        pendingTotal = response.data.reduce((accumulator, currentValue) => {
          return accumulator + Number(currentValue.amount_paid);
        }, 0);
        setReceivedAmount(pendingTotal);
        setPendingAmount(total - pendingTotal);
        setPaymentLists(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    setTodayDate(currentDate.toISOString().split("T")[0]);
    setYesterdayDate(getYesterdayFormatted());

    let totalYesterdayAmount = 0.0;
    let totalTotalAmount = 0.0;

    // bookingLists.forEach((booking) => {
    //   const createdAt = new Date(booking.created_at);
    //   if (isYesterday(createdAt)) {
    //     totalYesterdayAmount += parseFloat(booking.amount_paid);
    //   }
    //   if (isToday(createdAt)) {
    //     totalTotalAmount += parseFloat(booking.amount_paid); // Accumulate amount_paid for bookings made today
    //   }
    // });

    // Set the total amount for yesterday and today after looping through all bookings
    setYesterdayTotal(totalYesterdayAmount);
    setTodayTotal(totalTotalAmount);
  }, [bookingLists]); // Ensure that this effect runs whenever bookingLists changes

  return (
    <div>
      {/* <Header /> */}
      {/* <div className="parking-slot-header">
        <NavLink className="parking-slots non-active" to="/my-parking-spot">
          My Driveways
        </NavLink>
        <NavLink className="parking-slots non-active" to="/my-slot-bookings">
          Driveway Bookings
        </NavLink>
        <NavLink className="parking-slots active" to="/earnings">
          My Earnings
          <div className="sub-head-arrow"><div className="sub-label-arrow"></div></div>
        </NavLink>
      </div> */}
      <BreadCrumbs title="Earnings" />
      <div className="loginOuter afterownerLogin">
        <div className="container">
          <div className="dashboardList">
            <Tabs
              defaultActiveKey="total"
              id="fill-tab-example"
              className="mb-3"
            >
              <Tab eventKey="total" title={`Total Payment`}>
                <div>
                  <div className="earningHeader">
                    {/* <span>Date : {todayDate}</span> */}
                     <span></span>
                    <span> Total: ${totalAmount}</span>
                  </div>
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
                                <th>Name</th>
                                <th>From Date & Time</th>
                                <th>To Date & Time </th>

                                <th>Vehicle Number</th>
                                <th>Amount</th>
                              </tr>
                            </thead>

                            <tbody>
                              {bookingLists.map((booking, index) => {
                                const createdAt = new Date(booking.created_at);

                                // Filter bookings made yesterday
                                // if (isToday(createdAt)) {
                                  return (
                                    <tr key={booking.id}>
                                      <td>{index + 1}</td>
                                      <td>{booking.user.name}</td>
                                      <td>{booking.from_datetime}</td>
                                      <td>{booking.to_datetime}</td>

                                      <td>{booking.vehicle_number}</td>
                                      <td>{booking.amount_paid}</td>
                                    </tr>
                                  );
                                // } else {
                                //   return null; // Skip if not from yesterday
                                // }
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* <div className="earningHeader">
                    <span>Date : {yesterdayDate}</span>

                    <span> Total: ${yesterdayTotal}</span>
                  </div> */}

                  {/* <div className="row">
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
                                <th>To Date & Time </th>

                                <th>Vehicle Number</th>
                                <th>Amount</th>
                              </tr>
                            </thead>

                            <tbody>
                              {bookingLists.map((booking) => {
                                const createdAt = new Date(booking.created_at);

                                // Filter bookings made yesterday
                                if (isYesterday(createdAt)) {
                                  return (
                                    <tr key={booking.id}>
                                      <td>{booking.id}</td>
                                      <td>{booking.user.name}</td>
                                      <td>{booking.from_datetime}</td>
                                      <td>{booking.to_datetime}</td>

                                      <td>{booking.vehicle_number}</td>
                                      <td>{booking.amount_paid}</td>
                                    </tr>
                                  );
                                } else {
                                  return null; // Skip if not from yesterday
                                }
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div> </div>
                    </div>
                  </div> */}
                </div>
              </Tab>
              <Tab eventKey="received" title={`Payment Details`}>
                <div>
                  <div className="earningHeader">
                    <span>Received: ${receivedAmount}</span><br />
                    <span>Pending: ${pendingAmount}</span><br />
                    <span> Total: ${totalAmount}</span>
                  </div>
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
                                <th>Amount Received</th>
                                <th>Received Date</th>
                                <th>Remarks</th>
                              </tr>
                            </thead>

                            <tbody>
                              {paymentLists.map((payment, index) => {
                                // Filter bookings made yesterday
                                return (
                                  <tr key={payment.id}>
                                    <td>{index + 1}</td>
                                    <td>{payment.amount_paid}</td>
                                    <td>{payment.paid_date}</td>
                                    <td>{payment.remarks}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
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

export default Earnings;
