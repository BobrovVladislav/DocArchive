import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from "./components/layouts/Layout.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import PersonalAccountLayout from './components/layouts/PersonalAccountLayout.jsx';
import PersonalAccountDocumentsPage from './pages/personalAccount/PersonalAccountDocumentsPage.jsx';
import PersonalAccountSettingsPage from './pages/personalAccount/PersonalAccountSettingsPage.jsx';
import PersonalAccountPage from './pages/personalAccount/PersonalAccountPage.jsx';
import MainPage from "./pages/MainPage.jsx";
import ArchivePage from './pages/ArchivePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactsPage from './pages/ContactsPage.jsx';
import AdminLayout from "./components/layouts/AdminLayout.jsx";
import StatisticsPage from "./pages/admin/StatisticsPage.jsx";
import UserListPage from "./pages/admin/UserListPage.jsx";
import RegisterUserPage from "./pages/admin/RegisterUserPage.jsx";
import AddDocumentsPage from './pages/AddDocumentsPage.jsx';
import DocumentDetailsPage  from './pages/DocumentDetailsPage.jsx';
import ViewDocument from './components/ViewDocument.jsx';
import HistoryDocument from './components/HistoryDocument.jsx';
import DiscussionDocument from './components/DiscussionDocument.jsx';

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
            <Route element={<PersonalAccountLayout />}>
              <Route path="/user/personalAccount" element={<PersonalAccountPage />} />
              <Route path="/user/settings" element={<PersonalAccountSettingsPage />} />
              <Route path="/user/documents" element={<PersonalAccountDocumentsPage />} />
            </Route>
            {user.role === "admin" && (
              <Route element={<AdminLayout />}>
                <Route path="/admin/statistics" element={<StatisticsPage />} />
                <Route path="/admin/users" element={<UserListPage />} />
                <Route path="/admin/users/register" element={<RegisterUserPage />} />
              </Route>
            )}
          </>
        ) : (
          <Route path="login" element={<AuthPage />}>
          </Route>
        )}
        <Route path="/" element={<MainPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/archive/add-documents" element={<AddDocumentsPage />} />
        <Route element={<DocumentDetailsPage />} > 
          <Route path="/archive/:id/view" element={<ViewDocument />} />
          <Route path="/archive/:id/history" element={<HistoryDocument />} />
          <Route path="/archive/:id/discussion" element={<DiscussionDocument />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* ******************** */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/statistics" element={<StatisticsPage />} />
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/users/register" element={<RegisterUserPage />} />
        </Route>
        {/* ******************** */}
      </Routes>

      <ToastContainer position='bottom-right'
        progressStyle={{ background: "#243FD6" }} // Стили для прогресс-бара />
      />
    </Layout >
  );
}

export default App;
