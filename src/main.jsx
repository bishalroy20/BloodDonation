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


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout/>,
    errorElement : <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      
      
      {
        element: <PublicRoute />,
        children: [
          
        ],
      },

      
      {
        element: <PrivateRoute />,
        children: [
          
          
        ],
      },
      {
        path : '*' ,
        Component : <ErrorPage />
      }
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

