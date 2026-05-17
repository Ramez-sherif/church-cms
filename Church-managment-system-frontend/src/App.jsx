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
import AddClassGrade from './pages/classGradePage/AddClassGrade.jsx';

import LandingPage from './pages/LandingPage.jsx';
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
          const response = await axiosInstance.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error("Session restoration failed:", error);
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
            Public Website Routes
        ========================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<LandingPage />} />
        <Route path="/services" element={<LandingPage />} />
        <Route path="/activities" element={<LandingPage />} />
        <Route path="/contact" element={<LandingPage />} />
        
        <Route
          path="/login"
          element={
            accessToken ? <Navigate to="/dashboard/home" replace /> : <LoginPage />
          }
        />

        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />

        {/* =========================
            Internal Dashboard Routes (/dashboard/*)
        ========================= */}
        <Route
          path="/dashboard"
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
            {/* Dashboard Home */}
            <Route
              path="home"
              element={<Home />}
            />

            {/* Admin only dashboard routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route
                path="teachers"
                element={<Teachers />}
              />
              <Route
                path="add-teacher"
                element={<AddTeacher />}
              />
            </Route>

            {/* Admin + Teacher dashboard routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']} />}>
              <Route
                path="class-grades"
                element={<ClassGrades />}
              />
              <Route
                path="add-class-grade"
                element={<AddClassGrade />}
              />
              <Route
                path="students"
                element={<Students />}
              />
              <Route
                path="class-grades/:classGradeId/students"
                element={<Students />}
              />
              <Route
                path="lessons"
                element={<Lessons />}
              />
              <Route
                path="add-lesson"
                element={<AddLesson />}
              />
              <Route
                path="add-student"
                element={<AddStudent />}
              />
            </Route>

            {/* Admin + Teacher + Father dashboard routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'FATHER']} />}>
              <Route
                path="attendance"
                element={<Attendance />}
              />
              <Route
                path="add-attendance/:classGradeId"
                element={<AddAttendancePage />}
              />
            </Route>
          </Route>
        </Route>

        {/* =========================
            Legacy Redirects for Backward Compatibility
        ========================= */}
        <Route path="/home" element={<Navigate to="/dashboard/home" replace />} />
        <Route path="/teachers" element={<Navigate to="/dashboard/teachers" replace />} />
        <Route path="/add-teacher" element={<Navigate to="/dashboard/add-teacher" replace />} />
        <Route path="/class-grades" element={<Navigate to="/dashboard/class-grades" replace />} />
        <Route path="/add-class-grade" element={<Navigate to="/dashboard/add-class-grade" replace />} />
        <Route path="/students" element={<Navigate to="/dashboard/students" replace />} />
        <Route path="/class-grades/:classGradeId/students" element={<Navigate to="/dashboard/class-grades/:classGradeId/students" replace />} />
        <Route path="/lessons" element={<Navigate to="/dashboard/lessons" replace />} />
        <Route path="/add-lesson" element={<Navigate to="/dashboard/add-lesson" replace />} />
        <Route path="/add-student" element={<Navigate to="/dashboard/add-student" replace />} />
        <Route path="/attendance" element={<Navigate to="/dashboard/attendance" replace />} />
        <Route path="/add-attendance/:classGradeId" element={<Navigate to="/dashboard/add-attendance/:classGradeId" replace />} />

        {/* =========================
            Default Redirects & 404
        ========================= */}
        <Route
          path="*"
          element={
            accessToken
              ? <Navigate to="/dashboard/home" replace />
              : <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;