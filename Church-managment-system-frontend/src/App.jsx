import "./index.css";
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import Attendance from './pages/attendancePage/Attendance.jsx';
import AddAttendancePage from './pages/attendancePage/AddAttendance.jsx';

import Teachers from './pages/teacherPage/Teachers.jsx';
import AddTeacher from './pages/teacherPage/AddTeacher.jsx';

import Students from './pages/studentPage/Students.jsx';
import AddStudent from './pages/studentPage/AddStudent.jsx';

import Lessons from './pages/lessonPage/Lessons.jsx';
import AddLesson from './pages/lessonPage/AddLesson.jsx';

import Home from './pages/Home.jsx';

import ClassGrades from './pages/classGradePage/ClassGrades.jsx';

import LoginPage from './pages/LoginPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';

import MainLayout from './components/layout/MainLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

import useAuthStore from './store/useAuthStore';

import axiosInstance from './api/axiosInstance';

function App() {

  const {
    accessToken,
    setUser,
    logout
  } = useAuthStore();

  // =========================
  // Restore Session On Startup
  // =========================
  useEffect(() => {

    const restoreSession = async () => {

      if (accessToken) {

        try {

          const response =
            await axiosInstance.get('/auth/me');

          setUser(response.data);

        } catch (error) {

          console.error(
            "Session restoration failed:",
            error
          );

          // interceptor handles 401
          if (error.response?.status !== 401) {
            logout();
          }
        }
      }
    };

    restoreSession();

  }, [accessToken, setUser, logout]);

  return (

    <Router>

      <Routes>

        {/* =========================
            Public Routes
        ========================= */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />

        {/* =========================
            Shared Protected Routes
        ========================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                'ADMIN',
                'TEACHER',
                'FATHER'
              ]}
            />
          }
        >

          <Route element={<MainLayout />}>

            <Route
              path="/home"
              element={<Home />}
            />

          </Route>

        </Route>

        {/* =========================
            ADMIN Routes
        ========================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={['ADMIN']}
            />
          }
        >

          <Route element={<MainLayout />}>

            <Route
              path="/teachers"
              element={<Teachers />}
            />

            <Route
              path="/add-teacher"
              element={<AddTeacher />}
            />

          </Route>

        </Route>

        {/* =========================
            ADMIN + TEACHER
        ========================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                'ADMIN',
                'TEACHER'
              ]}
            />
          }
        >

          <Route element={<MainLayout />}>

            <Route
              path="/class-grades"
              element={<ClassGrades />}
            />

            <Route
              path="/students"
              element={<Students />}
            />

            <Route
              path="/class-grades/:classGradeId/students"
              element={<Students />}
            />

            <Route
              path="/lessons"
              element={<Lessons />}
            />

            <Route
              path="/add-lesson"
              element={<AddLesson />}
            />

            <Route
              path="/add-student"
              element={<AddStudent />}
            />

          </Route>

        </Route>

        {/* =========================
            ADMIN + TEACHER + FATHER
        ========================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                'ADMIN',
                'TEACHER',
                'FATHER'
              ]}
            />
          }
        >

          <Route element={<MainLayout />}>

            <Route
              path="/attendance"
              element={<Attendance />}
            />

            <Route
              path="/add-attendance/:classGradeId"
              element={<AddAttendancePage />}
            />

          </Route>

        </Route>

        {/* =========================
            Default Redirects
        ========================= */}

        <Route
          path="/"
          element={
            accessToken
              ? <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="*"
          element={
            accessToken
              ? <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />

      </Routes>

    </Router>
  );
}

export default App;