import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AppContext";
import AppRoutes from "./AppRoutes";
import Header from "./components/Header";

function App() {
  const headerRef = useRef();

  useEffect(() => {
    // Function to handle click events
    const handleClick = (event) => {

        if (headerRef.current) {
          console.log('Clicked inside Header component');
          // headerRef.current.handleHeaderClick();
        } 
      
      if (event.target.id == 'profileImg') {
        console.log('Clicked on: ', event.target);
        headerRef.current.handleActiveClick();
      } else {
        console.log('Clicked on: ', event.target);
        headerRef.current.handleCloseClick();
      }
      // You can add your custom logic here
    };

    // Attach the event listener to the document
    document.addEventListener('click', handleClick);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Header ref={headerRef} />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
