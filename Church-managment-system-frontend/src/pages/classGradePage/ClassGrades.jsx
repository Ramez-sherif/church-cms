import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Users,
  BookOpen,
  UserCheck,
  GraduationCap,
  Layers
} from 'lucide-react';
import { getAllClassGrades, getStageGroups } from '../../services/classGrade.service';

const ClassGrades = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [stageGroups, setStageGroups] = useState([]);
  const [selectedStageGroupId, setSelectedStageGroupId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Grades and Stage Groups
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [gradesData, stageGroupsData] = await Promise.all([
          getAllClassGrades(),
          getStageGroups()
        ]);
        setGrades(gradesData || []);
        setStageGroups(stageGroupsData || []);
      } catch (err) {
        setError('فشل في تحميل البيانات. يرجى التحقق من اتصالك بالخادم والمحاولة مرة أخرى.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered Grades
  const filteredGrades = grades.filter((grade) => {
    const matchesSearch =
      (grade.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (grade.stageGroupName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (grade.stageName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStageGroup =
      selectedStageGroupId === '' || String(grade.stageGroupId) === String(selectedStageGroupId);

    return matchesSearch && matchesStageGroup;
  });

  return (
    <div
      className="page-container"
      style={{
        direction: 'rtl',
        fontFamily: 'Cairo, sans-serif',
        padding: '1.5rem',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#1e293b',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <GraduationCap size={32} color="#2563eb" />
            المراحل الدراسية
          </h1>
          <p
            style={{
              color: '#64748b',
              fontSize: '0.9rem',
              marginTop: '0.25rem',
              marginRight: '2.5rem'
            }}
          >
            إدارة وتصفح الفصول والمراحل التعليمية
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/add-class-grade')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.625rem',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '0.95rem',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          <Plus size={18} />
          إضافة مرحلة جديدة
        </button>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '1.25rem',
          borderRadius: '1rem',
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        {/* Search input */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            minWidth: '280px'
          }}
        >
          <Search
            style={{
              position: 'absolute',
              right: '0.875rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}
            size={18}
          />
          <input
            type="text"
            placeholder="بحث باسم المرحلة الدراسية أو المجموعة أو المرحلة الرئيسية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 2.75rem 0.75rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.625rem',
              outline: 'none',
              fontSize: '0.9rem',
              fontFamily: 'Cairo, sans-serif',
              backgroundColor: '#f8fafc',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
          />
        </div>

        {/* Stage Group Filter Dropdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            minWidth: '220px'
          }}
        >
          <Filter size={18} color="#64748b" />
          <select
            value={selectedStageGroupId}
            onChange={(e) => setSelectedStageGroupId(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.625rem',
              backgroundColor: '#f8fafc',
              outline: 'none',
              fontSize: '0.9rem',
              fontFamily: 'Cairo, sans-serif',
              cursor: 'pointer'
            }}
          >
            <option value="">كل المجموعات الدراسية</option>
            {stageGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} ({group.stageName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6rem 2rem',
            gap: '1rem'
          }}
        >
          <Loader2 className="animate-spin" size={48} color="#2563eb" />
          <p style={{ color: '#64748b', fontWeight: '600', fontSize: '0.95rem' }}>جاري تحميل المراحل الدراسية...</p>
        </div>
      ) : error ? (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            color: '#ef4444',
            padding: '1.25rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            maxWidth: '600px',
            margin: '2rem auto',
            boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.05)'
          }}
        >
          <AlertCircle size={24} />
          <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{error}</div>
        </div>
      ) : filteredGrades.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            maxWidth: '600px',
            margin: '2rem auto'
          }}
        >
          <GraduationCap size={64} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#334155', margin: '0 0 0.5rem 0' }}>
            لا توجد مراحل دراسية تطابق البحث
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
            يمكنك محاولة تغيير معايير البحث أو إضافة مرحلة دراسية جديدة للبدء.
          </p>
          <button
            onClick={() => navigate('/dashboard/add-class-grade')}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem'
            }}
          >
            إضافة أول مرحلة دراسية
          </button>
        </div>
      ) : (
        /* Cards Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '3rem'
          }}
        >
          {filteredGrades.map((grade) => (
            <div
              key={grade.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.02)';
              }}
            >
              {/* Card Header & Metadata */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}
                >
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      borderRadius: '2rem',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Layers size={12} />
                    {grade.stageName || 'عام'}
                  </span>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      fontWeight: '600'
                    }}
                  >
                    ID: #{grade.id}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    color: '#1e293b',
                    margin: '0 0 0.75rem 0',
                    lineHeight: '1.4'
                  }}
                >
                  {grade.name}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#475569',
                    fontSize: '0.85rem',
                    backgroundColor: '#f8fafc',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem'
                  }}
                >
                  <span style={{ color: '#64748b', fontWeight: '600' }}>المجموعة الدراسية:</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{grade.stageGroupName || '---'}</span>
                </div>
              </div>

              {/* Action Buttons / Navigation Badges */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '1rem',
                  marginTop: '0.5rem'
                }}
              >
                {/* 1. Navigate to Students */}
                <button
                  onClick={() => navigate(`/dashboard/class-grades/${grade.id}/students`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.625rem 1rem',
                    backgroundColor: '#f0f9ff',
                    color: '#0369a1',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    transition: 'all 0.15s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#e0f2fe';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} />
                    <span>عرض الطلاب</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>◀</span>
                </button>

                {/* 2. Navigate to Lessons */}
                <button
                  onClick={() =>
                    navigate(`/dashboard/lessons?classGradeId=${grade.id}`)
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.625rem 1rem',
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    transition: 'all 0.15s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#d1fae5';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ecfdf5';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={16} />
                    <span>عرض المنهج والدروس</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>◀</span>
                </button>

                {/* 3. Navigate to Record Attendance */}
                <button
                  onClick={() => navigate(`/dashboard/add-attendance/${grade.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.625rem 1rem',
                    backgroundColor: '#fffbeb',
                    color: '#b45309',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    transition: 'all 0.15s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef3c7';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#fffbeb';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserCheck size={16} />
                    <span>تسجيل حضور الطلاب</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>◀</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Styles */}
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

export default ClassGrades;
