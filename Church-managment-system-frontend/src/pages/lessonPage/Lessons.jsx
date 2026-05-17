import { useEffect, useState } from 'react';

import {
  useNavigate,
  useSearchParams
} from 'react-router-dom';

import {
  Search,
  Filter,
  Loader2,
  AlertCircle,
  FileText,
  ExternalLink,
  Plus
} from 'lucide-react';

import {
  getLessonsByClassGrade
} from '../../services/lesson.service';

import {
  getAllClassGrades
} from '../../services/classGrade.service';

const Lessons = () => {

  const [lessons, setLessons] =
    useState([]);

  const [grades, setGrades] =
    useState([]);

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
  // Query Params
  // =========================
  const [searchParams] =
    useSearchParams();

  const classGradeIdFromUrl =
    searchParams.get('classGradeId');

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

          setSelectedGradeId(
            classGradeIdFromUrl ||
            data[0].id
          );
        }

      } catch (err) {

        setError(
          'فشل في تحميل المراحل الدراسية'
        );
      }
    };

    fetchGrades();

  }, [classGradeIdFromUrl]);

  // =========================
  // Fetch Lessons
  // =========================
  useEffect(() => {

    if (selectedGradeId) {
      fetchLessons(selectedGradeId);
    }

  }, [selectedGradeId]);

  const fetchLessons = async (gradeId) => {

    setLoading(true);

    setError('');

    try {

      const data =
        await getLessonsByClassGrade(
          gradeId
        );

      setLessons(data);

    } catch (err) {

      setError(
        'فشل في تحميل قائمة الدروس'
      );

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // Filter Lessons
  // =========================
  const filteredLessons =
    lessons.filter((lesson) =>
      lesson.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  // =========================
  // Open PDF
  // =========================
  const handleOpenPdf = (pdfFilePath) => {

    if (!pdfFilePath) return;

    const fullUrl =
      pdfFilePath.startsWith('http')
        ? pdfFilePath
        : `http://localhost:8080${pdfFilePath}`;

    window.open(fullUrl, '_blank');
  };

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
            منهج الدروس
          </h1>

          <p
            style={{
              color: '#64748b',
              fontSize: '0.875rem'
            }}
          >
            إدارة وتحميل الدروس
          </p>

        </div>

        <button
          onClick={() =>
            navigate('/add-lesson')
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

          <Plus size={18} />

          إضافة درس جديد

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
            placeholder="بحث عن درس..."
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

      ) : filteredLessons.length === 0 ? (

        <div
          style={{
            textAlign: 'center',
            padding: '4rem',
            color: '#64748b',
            backgroundColor: 'white',
            borderRadius: '0.75rem'
          }}
        >

          لا توجد دروس حالياً

        </div>

      ) : (

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}
        >

          {filteredLessons.map((lesson) => (

            <div
              key={lesson.id}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                boxShadow:
                  '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '0.75rem'
                }}
              >

                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    borderRadius: '0.75rem'
                  }}
                >

                  <FileText size={24} />

                </div>

                <div style={{ flex: 1 }}>

                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: '#1e293b'
                    }}
                  >
                    {lesson.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}
                  >
                    بتاريخ:
                    {' '}
                    {lesson.date}
                  </p>

                </div>

              </div>

              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              >

                <span
                  style={{
                    color: '#64748b'
                  }}
                >
                  المدرس:
                </span>

                {' '}

                <span
                  style={{
                    color: '#1e293b',
                    fontWeight: '600'
                  }}
                >
                  {lesson.teacherName || '---'}
                </span>

              </div>

              <button
                onClick={() =>
                  handleOpenPdf(
                    lesson.pdfFilePath
                  )
                }
                disabled={!lesson.pdfFilePath}
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor:
                    lesson.pdfFilePath
                      ? '#f1f5f9'
                      : '#f8fafc',
                  color:
                    lesson.pdfFilePath
                      ? '#1e293b'
                      : '#cbd5e1',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor:
                    lesson.pdfFilePath
                      ? 'pointer'
                      : 'not-allowed',
                  fontWeight: '600'
                }}
              >

                <ExternalLink size={18} />

                عرض الملف (PDF)

              </button>

            </div>

          ))}

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

export default Lessons;