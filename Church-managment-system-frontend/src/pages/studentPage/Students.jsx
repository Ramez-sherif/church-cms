import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlus, Search, Filter, Loader2, AlertCircle, IdCard } from 'lucide-react';
import { getStudentsByClassGrade } from '../../services/student.service';
import { getAllClassGrades } from '../../services/classGrade.service';

const Students = () => {
  const { classGradeId: urlClassGradeId } = useParams();
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState(urlClassGradeId || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getAllClassGrades();
        setGrades(data);
        if (!urlClassGradeId && data.length > 0) {
          setSelectedGradeId(data[0].id);
        }
      } catch (err) {
        setError('فشل في تحميل المراحل الدراسية');
      }
    };
    fetchGrades();
  }, [urlClassGradeId]);

  useEffect(() => {
    if (selectedGradeId) {
      fetchStudents(selectedGradeId);
    }
  }, [selectedGradeId]);

  const fetchStudents = async (gradeId) => {
    setLoading(true);
    setError('');
    try {
      const data = await getStudentsByClassGrade(gradeId);
      setStudents(data);
    } catch (err) {
      setError('فشل في تحميل قائمة الطلاب');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.studentCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.phoneNumber || '').includes(searchTerm)
  );

  return (
    <div className="page-container" style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>قائمة الطلاب</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>إدارة بيانات الطلاب المسجلين في المراحل الدراسية</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/add-student')}
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
          إضافة طالب جديد
        </button>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '0.75rem',
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
          <Search style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
          <input
            type="text"
            placeholder="بحث بالاسم، الكود أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 2.5rem 0.625rem 0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="#64748b" />
          <select
            value={selectedGradeId}
            onChange={(e) => {
              setSelectedGradeId(e.target.value);
              if (urlClassGradeId) navigate(`/dashboard/class-grades/${e.target.value}/students`);
            }}
            style={{
              padding: '0.625rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              outline: 'none',
              minWidth: '200px'
            }}
          >
            {grades.map(grade => (
              <option key={grade.id} value={grade.id}>{grade.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="animate-spin" size={40} color="#2563eb" />
        </div>
      ) : error ? (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#ef4444',
          padding: '1rem',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertCircle size={20} />
          {error}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', backgroundColor: 'white', borderRadius: '0.75rem' }}>
          <p>لا يوجد طلاب مسجلون في هذه المرحلة حالياً.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minWidth: '800px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>كود الطالب</th>
                  <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>الاسم</th>
                  <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>رقم الهاتف</th>
                  <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>تاريخ الميلاد</th>
                  <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>العنوان</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace'
                      }}>
                        {student.studentCode || '---'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{student.firstName} {student.lastName}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{student.phoneNumber || '---'}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{student.birthDate}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{student.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default Students;