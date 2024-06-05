import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from "./components/Layout.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import SignInForm from "./components/SignInForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
import MainPage from "./pages/MainPage.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import StatisticsPage from "./pages/admin/StatisticsPage.jsx";
import UserListPage from "./pages/admin/UserListPage.jsx";
import RegisterUserPage from "./pages/admin/RegisterUserPage.jsx";
import { Loader } from "./components/Loader.jsx";

import { useAuth } from "./context/AuthContext.jsx";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const { jwt, user, loading } = useAuth();

  if (jwt && loading) {
    return <Loader />
  }

  return (
    <Layout>
      <Routes>
        {jwt && user ? (
          <>
            {user.role === "admin" && (
              <Route element={<AdminLayout />}>
                <Route path="/admin/statistics" element={<StatisticsPage />} />
                <Route path="/admin/users" element={<UserListPage />} />
                <Route path="/admin/users/register" element={<RegisterUserPage />} />
              </Route>
            )}
          </>
        ) : (
            <Route element={<AuthPage />}>
            <Route path="login" element={<SignInForm />} />
            <Route path="registration" element={<SignUpForm />} />
          </Route>
        )}
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin/statistics" element={<StatisticsPage />} />
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/users/register" element={<RegisterUserPage />} />
        </Route>
      </Routes>

      <ToastContainer position='bottom-right'
        progressStyle={{ background: "#DB4C40" }} // Стили для прогресс-бара />
      />
    </Layout >
  );
}

export default App;
