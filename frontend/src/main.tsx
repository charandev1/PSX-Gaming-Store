import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './contexts/auth.context.tsx';
import { UserProvider } from './contexts/user.context.tsx';
import { FilterProvider } from './contexts/filter.context.tsx';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <UserProvider>
        <FilterProvider>
          <App />

          <ToastContainer
            position="bottom-center"
            autoClose={2000}
            pauseOnHover={false}
            draggable={false}
          />
        </FilterProvider>
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
)