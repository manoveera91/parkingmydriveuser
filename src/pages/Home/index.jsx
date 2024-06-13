import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Slider from "../../components/Slider";
import OtherHome from "../../components/OtherHome";

import ParkingPlace from "../../components/ParkingPlace";

function HomePage() {
  return (
    <>
      {/* <Header /> */}
      <Slider />
      {/* <Search title={"Find a parking place"} /> */}
      <ParkingPlace title="Find a parking place" />
      <OtherHome />
      <Footer />
    </>
  );
}

export default HomePage;
