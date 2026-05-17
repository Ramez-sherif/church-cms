import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Save, FileText, Calendar, Filter, User, Loader2, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { addLesson } from '../../services/lesson.service';
import { getAllClassGrades } from '../../services/classGrade.service';
import { getTeachersByClassGrade } from '../../services/teacher.service';

const AddLesson = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    teacherId: '',
    classGradeId: '',
  });
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getAllClassGrades();
        setGrades(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, classGradeId: data[0].id }));
        }
      } catch (err) {
        setError('فشل في تحميل المراحل الدراسية');
      }
    };
    fetchGrades();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (formData.classGradeId) {
        try {
          const data = await getTeachersByClassGrade(formData.classGradeId);
          setTeachers(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, teacherId: data[0].id }));
          } else {
            setFormData(prev => ({ ...prev, teacherId: '' }));
          }
        } catch (err) {
          console.error('Failed to fetch teachers', err);
        }
      }
    };
    fetchTeachers();
  }, [formData.classGradeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setPdfFile(null);
      setError('يرجى اختيار ملف PDF فقط.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      setError('يرجى تحميل ملف الدرس (PDF).');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('date', formData.date);
    data.append('teacherId', formData.teacherId);
    data.append('classGradeId', formData.classGradeId);
    data.append('pdf', pdfFile);

    try {
      await addLesson(data);
      setSuccess(true);
      setTimeout(() => navigate('/lessons'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إضافة الدرس. يرجى التأكد من البيانات والمحاولة مرة أخرى.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    outline: 'none',
    fontSize: '0.875rem',
    fontFamily: 'Cairo, sans-serif'
  };

  const iconStyle = {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#475569'
  };

  return (
    <div className="page-container" style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/lessons')}
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
          العودة للمنهج
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>إضافة درس جديد</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '1rem', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        maxWidth: '700px'
      }}>
        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={20} />
            <span style={{ fontSize: '0.875rem' }}>تمت إضافة الدرس بنجاح! يتم التحويل الآن...</span>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>عنوان الدرس</label>
            <div style={{ position: 'relative' }}>
              <FileText style={iconStyle} size={18} />
              <input name="title" value={formData.title} onChange={handleChange} required style={inputStyle} placeholder="عنوان الدرس..." />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>التاريخ</label>
              <div style={{ position: 'relative' }}>
                <Calendar style={iconStyle} size={18} />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>المرحلة الدراسية</label>
              <div style={{ position: 'relative' }}>
                <Filter style={iconStyle} size={18} />
                <select name="classGradeId" value={formData.classGradeId} onChange={handleChange} required style={inputStyle}>
                  {grades.map(grade => (
                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>المدرس الملقي للدرس</label>
            <div style={{ position: 'relative' }}>
              <User style={iconStyle} size={18} />
              <select name="teacherId" value={formData.teacherId} onChange={handleChange} required style={inputStyle}>
                {teachers.length === 0 ? (
                  <option value="">لا يوجد معلمون في هذه المرحلة</option>
                ) : (
                  teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>ملف الدرس (PDF فقط)</label>
            <div style={{ 
              border: '2px dashed #e2e8f0', 
              borderRadius: '0.75rem', 
              padding: '2rem', 
              textAlign: 'center',
              backgroundColor: pdfFile ? '#f0fdf4' : '#f8fafc',
              borderColor: pdfFile ? '#16a34a' : '#e2e8f0',
              transition: 'all 0.2s',
              position: 'relative'
            }}>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange} 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  opacity: 0, 
                  cursor: 'pointer' 
                }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                {pdfFile ? (
                  <>
                    <CheckCircle size={32} color="#16a34a" />
                    <span style={{ fontWeight: '600', color: '#16a34a' }}>{pdfFile.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>انقر لتغيير الملف</span>
                  </>
                ) : (
                  <>
                    <Upload size={32} color="#94a3b8" />
                    <span style={{ fontWeight: '600', color: '#475569' }}>اضغط هنا لتحميل الملف</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>صيغة PDF فقط</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 2rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            حفظ الدرس
          </button>
        </div>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        select { appearance: none; }
      `}} />
    </div>
  );
};

export default AddLesson;