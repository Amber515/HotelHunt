import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Header from "./components/header/header";
import Home from "./components/home";
import Checkout from "./components/checkout/checkout";
import Booking from "./components/booking";
import ResetPassword from './components/auth/reset'; // Adjust path as necessary

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function App() {
  const routesArray = [
    {
      path: "*",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/reset",
      element: <ResetPassword />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/checkout",
      element: <Checkout />,
    },
    {
      path: "/booking",
      element: <Booking />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
