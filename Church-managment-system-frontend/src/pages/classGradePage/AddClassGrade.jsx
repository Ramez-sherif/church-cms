import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Save,
  GraduationCap,
  Layers,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { addClassGrade, getStageGroups } from '../../services/classGrade.service';

const AddClassGrade = () => {
  const navigate = useNavigate();
  const [stageGroups, setStageGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingGroups, setFetchingGroups] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    stageGroupId: ''
  });

  // Fetch Stage Groups to populate the dropdown
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await getStageGroups();
        setStageGroups(groups || []);
        if (groups && groups.length > 0) {
          setFormData((prev) => ({ ...prev, stageGroupId: groups[0].id }));
        }
      } catch (err) {
        setError('فشل في تحميل المجموعات الدراسية. يرجى التحقق من اتصالك بالخادم.');
        console.error(err);
      } finally {
        setFetchingGroups(false);
      }
    };
    fetchGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('يرجى إدخال اسم المرحلة الدراسية');
      return;
    }
    if (!formData.stageGroupId) {
      setError('يرجى اختيار مجموعة دراسية');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await addClassGrade({
        name: formData.name,
        stageGroupId: Number(formData.stageGroupId)
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/class-grades'), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || 'حدث خطأ أثناء إضافة المرحلة الدراسية. يرجى المحاولة مرة أخرى.'
      );
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
    fontFamily: 'Cairo, sans-serif',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s'
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
      {/* Header and Back navigation */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/dashboard/class-grades')}
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
          العودة لقائمة المراحل
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
          إضافة مرحلة دراسية جديدة
        </h1>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.025)',
          maxWidth: '600px',
          margin: '0 auto'
        }}
      >
        {/* Error notification */}
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
              gap: '0.75rem',
              border: '1px solid #fee2e2'
            }}
          >
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{error}</span>
          </div>
        )}

        {/* Success notification */}
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
              gap: '0.75rem',
              border: '1px solid #dcfce7'
            }}
          >
            <CheckCircle size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              تمت إضافة المرحلة الدراسية بنجاح! يتم التحويل الآن...
            </span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Class Grade Name Input */}
          <div>
            <label style={labelStyle}>اسم المرحلة الدراسية</label>
            <div style={{ position: 'relative' }}>
              <GraduationCap style={iconStyle} size={18} />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="مثال: الصف الأول الابتدائي"
                disabled={loading || success}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
              />
            </div>
          </div>

          {/* Stage Group Select Input */}
          <div>
            <label style={labelStyle}>المجموعة الدراسية</label>
            <div style={{ position: 'relative' }}>
              <Layers style={iconStyle} size={18} />
              <select
                name="stageGroupId"
                value={formData.stageGroupId}
                onChange={handleChange}
                required
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  cursor: 'pointer'
                }}
                disabled={loading || success || fetchingGroups}
              >
                {fetchingGroups ? (
                  <option value="">جاري تحميل المجموعات...</option>
                ) : stageGroups.length === 0 ? (
                  <option value="">لا توجد مجموعات متاحة</option>
                ) : (
                  stageGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name} ({group.stageName})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading || success || fetchingGroups}
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
              cursor: loading || success || fetchingGroups ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
            onMouseOver={(e) => {
              if (!loading && !success && !fetchingGroups) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }
            }}
            onMouseOut={(e) => {
              if (!loading && !success && !fetchingGroups) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            حفظ البيانات
          </button>
        </div>
      </form>

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

export default AddClassGrade;