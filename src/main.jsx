import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router';
import RootLayout from './Layout/RootLayout.jsx';
import ErrorPage from './Layout/ErrorPage.jsx';
import PublicRoute from './Layout/PublicRoute.jsx';
import PrivateRoute from './Layout/PrivateRoute.jsx';
import Home from './Components/Home/Home.jsx';
import AuthProvider from './Contexts/AuthProvider.jsx';
import Register from './Components/Home/Register.jsx';
import Login from './Components/Home/Login.jsx';
import DashboardLayout from './Components/DashBoard/DashBoardLayout.jsx';
import DonorHome from './Components/DashBoard/DonorHome.jsx';
import ProfilePage from './Components/DashBoard/ProfilePage.jsx';
import MyDonationRequests from './Components/DashBoard/MyDonationRequests.jsx';
import CreateDonationRequest from './Components/DashBoard/CreateDonationRequest.jsx';
import AllUsersPage from './Components/DashBoard/AllUsersPage.jsx';
import AllDonationRequestsPage from './Components/DashBoard/AllDonationRequestsPage.jsx';
import AdminHome from './Components/DashBoard/AdminHome.jsx';
import { AdminOrVolunteerRoute } from './Layout/AdminOrVolunteerRoute.jsx';
import AdminRoute from "../src/Layout/AdminRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },

      {
        element: <PublicRoute />,
        children: [
          { path: "register", element: <Register /> },
          { path: "login", element: <Login /> },
        ],
      },

      {
        element: <PrivateRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DonorHome /> },
              { path: "profile", element: <ProfilePage /> },
              { path: "my-donation-requests", element: <MyDonationRequests /> },
              { path: "create-donation-request", element: <CreateDonationRequest /> },

              // Admin only
              { path: "admin", element: <AdminRoute><AdminHome /></AdminRoute> },
              { path: "all-users", element: <AdminRoute><AllUsersPage /></AdminRoute> },

              // Volunteer + Admin can see requests
              {
                path: "all-blood-donation-request",
                element: (
                  <AdminOrVolunteerRoute>
                    <AllDonationRequestsPage />
                  </AdminOrVolunteerRoute>
                )
              }  
            
            ],
          },
        ],
      },

      { path: "*", element: <ErrorPage /> },
    ],
  },
]);






createRoot(document.getElementById('root')).render(
  <StrictMode>
     
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    
  </StrictMode>,
)

