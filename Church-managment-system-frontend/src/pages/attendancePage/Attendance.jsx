import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Search, Filter, Loader2, AlertCircle, Calendar, Plus } from 'lucide-react';
import { getAttendanceByClassGradeId } from '../../services/attendance.service';
import { getAllClassGrades } from '../../services/classGrade.service';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getAllClassGrades();
        setGrades(data);
        if (data.length > 0) {
          setSelectedGradeId(data[0].id);
        }
      } catch (err) {
        setError('فشل في تحميل المراحل الدراسية');
      }
    };
    fetchGrades();
  }, []);

  useEffect(() => {
    if (selectedGradeId) {
      fetchAttendance(selectedGradeId);
    }
  }, [selectedGradeId]);

  const fetchAttendance = async (gradeId) => {
    setLoading(true);
    setError('');
    try {
      const data = await getAttendanceByClassGradeId(gradeId);
      setRecords(data);
    } catch (err) {
      setError('فشل في تحميل سجلات الحضور');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>سجلات الحضور</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>متابعة حضور الطلاب في الدروس المختلفة</p>
        </div>
        <button
          onClick={() => navigate(`/add-attendance/${selectedGradeId || 1}`)}
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
          تسجيل حضور جديد
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
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <Filter size={18} color="#64748b" />
          <select
            value={selectedGradeId}
            onChange={(e) => setSelectedGradeId(e.target.value)}
            style={{
              padding: '0.625rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              outline: 'none',
              minWidth: '250px'
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
      ) : records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', backgroundColor: 'white', borderRadius: '0.75rem' }}>
          <p>لا توجد سجلات حضور لهذه المرحلة حالياً.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>اسم الطالب</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>الدرس</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>التاريخ</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={record.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{record.studentName}</td>
                  <td style={{ padding: '1rem', color: '#1e293b' }}>{record.lessonTitle}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} />
                      {record.lessonDate}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: record.status ? '#f0fdf4' : '#fef2f2', 
                      color: record.status ? '#16a34a' : '#ef4444', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      {record.status ? 'حاضر' : 'غائب'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default Attendance;