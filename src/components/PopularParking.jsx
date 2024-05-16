import React from "react";

const PopularParking = () => {
  return (
    <div className="popularParkingOuter">
      <div className="container">
        <h2>Popular Parking with Drives and Private Spaces </h2>
        <div className="row">
          <div className="col-lg-4">
            <div className="popularParkingOuterList">
              <ul>
                <li>Wembley parking</li>
                <li>Twickenham parking</li>
                <li>Arsenal, Emirates Parking</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="popularParkingOuterList">
              <ul>
                <li>Chelsea, Stamford Bridge Parking</li>
                <li>Southampton Parking</li>
                <li>Bristol Airport Parking</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="popularParkingOuterList">
              <ul>
                <li>London Parking</li>
                <li>Wimbledon parking</li>
                <li>Richmond parking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularParking;
