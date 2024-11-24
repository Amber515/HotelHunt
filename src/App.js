import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Header from "./components/header/header";
import Home from "./components/home";
import Booking from "./components/booking";
import History from "./components/history";
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
      path: "/booking",
      element: <Booking />,
    },
    {
      path: "/history",
      element: <History />,
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
