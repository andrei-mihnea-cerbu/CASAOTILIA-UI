import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { SessionProvider } from './context/SessionContext';

import LayoutWrapper from './wrappers/LayoutWrapper';

import WelcomePage from './pages/user/WelcomePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import OldSchoolGaragePage from './pages/user/OldSchoolGaragePage';
import InventoryDetailsPage from './pages/user/InventoryDetailsPage';
import InventoryPage from './pages/user/InventoryPage';

const App: React.FC = () => {
  return (
    <Router>
      <SessionProvider>
        <Routes>
          <Route element={<LayoutWrapper />}>
            {/* Public site */}
            <Route index element={<WelcomePage />} />
            <Route path="cars" element={<InventoryPage />} />
            <Route path="used-car-parts" element={<InventoryPage />} />
            <Route path="old-school-garage" element={<OldSchoolGaragePage />} />
            <Route path="inventory">
              <Route path="cars" element={<InventoryDetailsPage />} />
              <Route path="used-car-parts" element={<InventoryDetailsPage />} />
            </Route>

            {/* Admin section */}
            <Route path="admin">
              <Route index element={<AdminLoginPage />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </SessionProvider>
    </Router>
  );
};

export default App;
