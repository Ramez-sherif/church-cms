import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Save,
  User,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Filter
} from 'lucide-react';
import { addTeacher } from '../../services/teacher.service';
import { getAllClassGrades } from '../../services/classGrade.service';

const AddTeacher = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    phoneNumber: '',
    address: '',
    serviceRole: 'Teacher',
    classGradeId: '',
    username: '',
    password: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await addTeacher(formData);
      setSuccess(true);
      setTimeout(() => navigate('/teachers'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إضافة المعلم. يرجى التأكد من البيانات والمحاولة مرة أخرى.');
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
          onClick={() => navigate('/teachers')}
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
          العودة لقائمة المعلمين
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>إضافة معلم جديد</h1>
      </div>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        maxWidth: '800px'
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
            <span style={{ fontSize: '0.875rem' }}>تمت إضافة المعلم بنجاح! يتم التحويل الآن...</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Personal Info */}
          <div>
            <label style={labelStyle}>الاسم الأول</label>
            <div style={{ position: 'relative' }}>
              <User style={iconStyle} size={18} />
              <input name="firstName" value={formData.firstName} onChange={handleChange} required style={inputStyle} placeholder="مثال: مينا" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>الاسم الأخير</label>
            <div style={{ position: 'relative' }}>
              <User style={iconStyle} size={18} />
              <input name="lastName" value={formData.lastName} onChange={handleChange} required style={inputStyle} placeholder="مثال: سمير" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>رقم الهاتف</label>
            <div style={{ position: 'relative' }}>
              <Phone style={iconStyle} size={18} />
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required style={inputStyle} placeholder="01xxxxxxxxx" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>تاريخ الميلاد</label>
            <div style={{ position: 'relative' }}>
              <Calendar style={iconStyle} size={18} />
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>العنوان</label>
            <div style={{ position: 'relative' }}>
              <MapPin style={iconStyle} size={18} />
              <input name="address" value={formData.address} onChange={handleChange} style={inputStyle} placeholder="العنوان بالتفصيل..." />
            </div>
          </div>

          {/* Service Info */}
          <div>
            <label style={labelStyle}>الدور الخدمي</label>
            <div style={{ position: 'relative' }}>
              <Briefcase style={iconStyle} size={18} />
              <select name="serviceRole" value={formData.serviceRole} onChange={handleChange} required style={inputStyle}>
                <option value="Teacher">أمين فصل (Teacher)</option>
                <option value="Assistant">خادم مساعد (Assistant)</option>
                <option value="Supervisor">مشرف (Supervisor)</option>
              </select>
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

          {/* Credentials */}
          <div>
            <label style={labelStyle}>اسم المستخدم (للدخول)</label>
            <div style={{ position: 'relative' }}>
              <User style={iconStyle} size={18} />
              <input name="username" value={formData.username} onChange={handleChange} required style={inputStyle} placeholder="username" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <Lock style={iconStyle} size={18} />
              <input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} placeholder="••••••••" />
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
            حفظ البيانات
          </button>
        </div>
      </form>

      <style dangerouslySetInnerHTML={{
        __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        select { appearance: none; }
      `}} />
    </div>
  );
};

export default AddTeacher;