import { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import {
  ChevronRight,
  Save,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Check
} from 'lucide-react';

import {
  getStudentsByClassGradeId
} from '../../services/classGrade.service';

import {
  getLastLessonByClassGrade
} from '../../services/lesson.service';

import {
  addAttendance
} from '../../services/attendance.service';

const AddAttendance = () => {

  const { classGradeId } =
    useParams();

  const navigate =
    useNavigate();

  const [students, setStudents] =
    useState([]);

  const [lesson, setLesson] =
    useState(null);

  const [attendance, setAttendance] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState(false);

  // =========================
  // Fetch Data
  // =========================
  useEffect(() => {

    const fetchData = async () => {

      setLoading(true);

      setError('');

      try {

        const lessonData =
          await getLastLessonByClassGrade(
            classGradeId
          );

        const studentsData =
          await getStudentsByClassGradeId(
            classGradeId
          );

        setLesson(lessonData);

        setStudents(studentsData);

        const initialAttendance = {};

        studentsData.forEach((student) => {

          initialAttendance[student.id] =
            false;
        });

        setAttendance(initialAttendance);

      } catch (err) {

        setError(
          'فشل في تحميل بيانات الطلاب أو الدرس الأخير'
        );

        console.error(err);

      } finally {

        setLoading(false);
      }
    };

    fetchData();

  }, [classGradeId]);

  // =========================
  // Toggle Attendance
  // =========================
  const handleToggle = (studentId) => {

    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  // =========================
  // Submit Attendance
  // =========================
  const handleSubmit = async () => {

    if (!lesson) return;

    setSubmitting(true);

    setError('');

    try {

      const payload =
        students.map((student) => ({

          userId: student.id,

          lessonId: lesson.id,

          status: attendance[student.id]

        }));

      // IMPORTANT:
      // backend accepts ONE attendance at a time
      await Promise.all(

        payload.map((item) =>
          addAttendance(item)
        )
      );

      setSuccess(true);

      setTimeout(() => {

        navigate('/attendance');

      }, 1500);

    } catch (err) {

      setError(
        'حدث خطأ أثناء حفظ سجل الحضور'
      );

      console.error(err);

    } finally {

      setSubmitting(false);
    }
  };

  // =========================
  // Loading State
  // =========================
  if (loading) {

    return (

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh'
        }}
      >

        <Loader2
          className="animate-spin"
          size={40}
          color="#2563eb"
        />

      </div>
    );
  }

  return (

    <div
      className="page-container"
      style={{
        direction: 'rtl',
        fontFamily: 'Cairo, sans-serif'
      }}
    >

      {/* =========================
          Header
      ========================= */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}
      >

        <div>

          <button
            onClick={() =>
              navigate('/attendance')
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#2563eb',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >

            <ChevronRight size={16} />

            العودة للسجلات

          </button>

          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1e293b'
            }}
          >
            تسجيل حضور الطلاب
          </h1>

          {lesson && (

            <p
              style={{
                color: '#64748b',
                fontSize: '0.875rem',
                marginTop: '0.25rem'
              }}
            >

              الدرس:
              {' '}

              <span
                style={{
                  color: '#2563eb',
                  fontWeight: '700'
                }}
              >
                {lesson.title}
              </span>

            </p>

          )}

        </div>

        <button
          onClick={handleSubmit}
          disabled={
            submitting ||
            students.length === 0
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '700',
            cursor:
              submitting
                ? 'not-allowed'
                : 'pointer'
          }}
        >

          {submitting ? (

            <Loader2
              className="animate-spin"
              size={20}
            />

          ) : (

            <Save size={20} />

          )}

          حفظ الحضور

        </button>

      </div>

      {/* =========================
          Error
      ========================= */}

      {error && (

        <div
          style={{
            backgroundColor: '#fef2f2',
            color: '#ef4444',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >

          <AlertCircle size={20} />

          <span>
            {error}
          </span>

        </div>

      )}

      {/* =========================
          Success
      ========================= */}

      {success && (

        <div
          style={{
            backgroundColor: '#f0fdf4',
            color: '#16a34a',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >

          <CheckCircle size={20} />

          تمت عملية الحفظ بنجاح

        </div>

      )}

      {/* =========================
          Students
      ========================= */}

      <div
        style={{
          display: 'grid',
          gap: '1rem'
        }}
      >

        {students.map((student) => (

          <div
            key={student.id}
            onClick={() =>
              handleToggle(student.id)
            }
            style={{
              backgroundColor: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow:
                '0 1px 3px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              border: '2px solid',
              borderColor:
                attendance[student.id]
                  ? '#dcfce7'
                  : 'transparent'
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >

              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >

                <User size={20} />

              </div>

              <div>

                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: '#1e293b'
                  }}
                >
                  {student.firstName}
                  {' '}
                  {student.lastName}
                </h3>

                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8'
                  }}
                >
                  كود:
                  {' '}
                  {student.studentCode}
                </p>

              </div>

            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor:
                  attendance[student.id]
                    ? '#f0fdf4'
                    : '#f8fafc',
                color:
                  attendance[student.id]
                    ? '#16a34a'
                    : '#94a3b8',
                fontWeight: '700'
              }}
            >

              {attendance[student.id] ? (

                <>
                  <Check size={18} />
                  حاضر
                </>

              ) : (

                <>
                  <XCircle size={18} />
                  غائب
                </>

              )}

            </div>

          </div>

        ))}

      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .animate-spin {
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `
        }}
      />

    </div>
  );
};

export default AddAttendance;