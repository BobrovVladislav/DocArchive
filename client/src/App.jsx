import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from "./components/Layout.jsx";
import AuthForm from "./pages/AuthForm.jsx";
import SignInForm from "./components/SignInForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
import MainPage from "./pages/MainPage.jsx";
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
              {/* <Route path="/admin" element={<AdminPage />} /> */}
            )}
          </>
        ) : (
          <Route element={<AuthForm />}>
            <Route path="login" element={<SignInForm />} />
            <Route path="registration" element={<SignUpForm />} />
          </Route>
        )}
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer position='bottom-right'
        progressStyle={{ background: "#DB4C40" }} // Стили для прогресс-бара />
      />
    </Layout >
  );
}

export default App;
