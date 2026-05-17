import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  UserPlus,
  Search,
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';

import {
  getTeachersByClassGrade
} from '../../services/teacher.service';

import {
  getAllClassGrades
} from '../../services/classGrade.service';

const Teachers = () => {

  const [teachers, setTeachers] = useState([]);

  const [grades, setGrades] = useState([]);

  const [selectedGradeId, setSelectedGradeId] =
    useState('');

  const [searchTerm, setSearchTerm] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const navigate = useNavigate();

  // =========================
  // Fetch Grades
  // =========================
  useEffect(() => {

    const fetchGrades = async () => {

      try {

        const data =
          await getAllClassGrades();

        setGrades(data);

        if (data.length > 0) {
          setSelectedGradeId(data[0].id);
        }

      } catch (err) {

        setError(
          'فشل في تحميل المراحل الدراسية'
        );
      }
    };

    fetchGrades();

  }, []);

  // =========================
  // Fetch Teachers
  // =========================
  useEffect(() => {

    if (selectedGradeId) {
      fetchTeachers(selectedGradeId);
    }

  }, [selectedGradeId]);

  const fetchTeachers = async (gradeId) => {

    setLoading(true);

    setError('');

    try {

      const data =
        await getTeachersByClassGrade(
          gradeId
        );

      setTeachers(data);

    } catch (err) {

      setError(
        'فشل في تحميل قائمة المعلمين'
      );

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // Filtered Teachers
  // =========================
  const filteredTeachers =
    teachers.filter((t) =>

      `${t.firstName} ${t.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      ||

      (t.phoneNumber || '')
        .includes(searchTerm)
    );

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

          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1e293b'
            }}
          >
            قائمة المعلمين
          </h1>

          <p
            style={{
              color: '#64748b',
              fontSize: '0.875rem'
            }}
          >
            إدارة بيانات المعلمين
          </p>

        </div>

        <button
          onClick={() =>
            navigate('/dashboard/add-teacher')
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >

          <UserPlus size={18} />

          إضافة معلم جديد

        </button>

      </div>

      {/* =========================
          Filters
      ========================= */}

      <div
        style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.75rem',
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          boxShadow:
            '0 1px 3px rgba(0,0,0,0.1)',
          flexWrap: 'wrap'
        }}
      >

        <div
          style={{
            flex: 1,
            position: 'relative',
            minWidth: '250px'
          }}
        >

          <Search
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}
            size={18}
          />

          <input
            type="text"
            placeholder="بحث..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            style={{
              width: '100%',
              padding:
                '0.625rem 2.5rem 0.625rem 0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              outline: 'none'
            }}
          />

        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >

          <Filter
            size={18}
            color="#64748b"
          />

          <select
            value={selectedGradeId}
            onChange={(e) =>
              setSelectedGradeId(
                e.target.value
              )
            }
            style={{
              padding: '0.625rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              outline: 'none',
              minWidth: '200px'
            }}
          >

            {grades.map((grade) => (

              <option
                key={grade.id}
                value={grade.id}
              >
                {grade.name}
              </option>

            ))}

          </select>

        </div>

      </div>

      {/* =========================
          Content
      ========================= */}

      {loading ? (

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '4rem'
          }}
        >

          <Loader2
            className="animate-spin"
            size={40}
            color="#2563eb"
          />

        </div>

      ) : error ? (

        <div
          style={{
            backgroundColor: '#fef2f2',
            color: '#ef4444',
            padding: '1rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >

          <AlertCircle size={20} />

          {error}

        </div>

      ) : filteredTeachers.length === 0 ? (

        <div
          style={{
            textAlign: 'center',
            padding: '4rem',
            color: '#64748b',
            backgroundColor: 'white',
            borderRadius: '0.75rem'
          }}
        >

          لا يوجد معلمين حالياً

        </div>

      ) : (

        <div
          style={{
            overflowX: 'auto'
          }}
        >

          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              boxShadow:
                '0 1px 3px rgba(0,0,0,0.1)',
              minWidth: '900px'
            }}
          >

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'right'
              }}
            >

              <thead
                style={{
                  backgroundColor: '#f8fafc',
                  borderBottom:
                    '1px solid #e2e8f0'
                }}
              >

                <tr>

                  <th style={{ padding: '1rem' }}>
                    الاسم
                  </th>

                  <th style={{ padding: '1rem' }}>
                    الدور
                  </th>

                  <th style={{ padding: '1rem' }}>
                    الهاتف
                  </th>

                  <th style={{ padding: '1rem' }}>
                    الميلاد
                  </th>

                  <th style={{ padding: '1rem' }}>
                    العنوان
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredTeachers.map(
                  (teacher, index) => (

                    <tr
                      key={teacher.id || index}
                      style={{
                        borderBottom:
                          '1px solid #f1f5f9'
                      }}
                    >

                      <td style={{ padding: '1rem' }}>
                        {teacher.firstName}
                        {' '}
                        {teacher.lastName}
                      </td>

                      <td style={{ padding: '1rem' }}>
                        {teacher.serviceRole}
                      </td>

                      <td style={{ padding: '1rem' }}>
                        {teacher.phoneNumber}
                      </td>

                      <td style={{ padding: '1rem' }}>
                        {teacher.birthDate}
                      </td>

                      <td style={{ padding: '1rem' }}>
                        {teacher.address}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

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

export default Teachers;