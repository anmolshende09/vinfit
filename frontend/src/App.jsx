import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";
import MealTracker from "./pages/MealTracker";
import Checkins from "./pages/Checkins";
import Progress from "./pages/Progress";
import TrainerDashboard from "./pages/TrainerDashboard";
import Landing from "./pages/Landing";
import ResetPassword from "./pages/ResetPassword";

// 🔥 NEW
import AppLayout from "./components/AppLayout";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* 🔥 APP ROUTES WITH LAYOUT */}
          <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/meals" element={<MealTracker />} />
            <Route path="/checkins" element={<Checkins />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/trainer" element={<TrainerDashboard />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}