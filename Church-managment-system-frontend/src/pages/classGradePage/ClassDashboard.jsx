import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  GraduationCap,
  Layers,
  Users,
  ShieldCheck,
  Phone,
  Briefcase,
  Loader2,
  AlertCircle,
  Settings,
  ListTodo
} from 'lucide-react';

import { getAllClassGrades } from '../../services/classGrade.service';
import { getAllTeachers } from '../../services/teacher.service';

const ClassDashboard = () => {
  const { classGradeId } = useParams();
  const navigate = useNavigate();

  const [classInfo, setClassInfo] = useState(null);
  const [leadership, setLeadership] = useState({
    stageLeader: null,
    assistantStageLeader: null,
    stageGroupLeader: null,
    assistantStageGroupLeader: null,
    classTeacher: null,
    assistantClassTeacher: null
  });
  const [servants, setServants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const [grades, teachers] = await Promise.all([
          getAllClassGrades(),
          getAllTeachers()
        ]);

        // 1. Find Current Class Grade Info
        const currentClass = grades.find((g) => String(g.id) === String(classGradeId));
        if (!currentClass) {
          throw new Error('الصف / الفصل الدراسي غير موجود');
        }
        setClassInfo(currentClass);

        const currentStageId = currentClass.stageId;
        const currentStageGroupId = currentClass.stageGroupId;

        // 2. Identify Leadership
        const stageLeader = teachers.find(
          (t) => t.serviceRole === 'STAGE_LEADER' && String(t.stageId) === String(currentStageId)
        );
        const assistantStageLeader = teachers.find(
          (t) => t.serviceRole === 'ASSISTANT_STAGE_LEADER' && String(t.stageId) === String(currentStageId)
        );
        const stageGroupLeader = teachers.find(
          (t) => t.serviceRole === 'STAGE_GROUP_LEADER' && String(t.stageGroupId) === String(currentStageGroupId)
        );
        const assistantStageGroupLeader = teachers.find(
          (t) => t.serviceRole === 'ASSISTANT_STAGE_GROUP_LEADER' && String(t.stageGroupId) === String(currentStageGroupId)
        );
        const classTeacher = teachers.find(
          (t) => t.serviceRole === 'CLASS_TEACHER' && String(t.classGradeId) === String(classGradeId)
        );
        const assistantClassTeacher = teachers.find(
          (t) => t.serviceRole === 'ASSISTANT_CLASS_TEACHER' && String(t.classGradeId) === String(classGradeId)
        );

        setLeadership({
          stageLeader: stageLeader || null,
          assistantStageLeader: assistantStageLeader || null,
          stageGroupLeader: stageGroupLeader || null,
          assistantStageGroupLeader: assistantStageGroupLeader || null,
          classTeacher: classTeacher || null,
          assistantClassTeacher: assistantClassTeacher || null
        });

        // 3. Class Servants list
        const classServants = teachers.filter(
          (t) => t.serviceRole === 'CLASS_SERVANT' && String(t.classGradeId) === String(classGradeId)
        );
        setServants(classServants);

      } catch (err) {
        setError(err.message || 'فشل في تحميل بيانات لوحة التحكم');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [classGradeId]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: '1rem',
          direction: 'rtl',
          fontFamily: 'Cairo, sans-serif'
        }}
      >
        <Loader2 className="animate-spin" size={48} color="#2563eb" />
        <p style={{ color: '#64748b', fontWeight: '600' }}>جاري تحميل لوحة تحكم الصف...</p>
      </div>
    );
  }

  if (error || !classInfo) {
    return (
      <div
        style={{
          padding: '2rem',
          direction: 'rtl',
          fontFamily: 'Cairo, sans-serif',
          minHeight: '100vh',
          backgroundColor: '#f8fafc'
        }}
      >
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
            fontWeight: '700',
            marginBottom: '2rem'
          }}
        >
          <ChevronRight size={18} />
          العودة للمراحل الدراسية
        </button>
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            color: '#ef4444',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <AlertCircle size={24} />
          <span style={{ fontWeight: '600' }}>{error || 'حدث خطأ غير متوقع'}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="page-container"
      style={{
        direction: 'rtl',
        fontFamily: 'Cairo, sans-serif',
        padding: '1.5rem',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}
    >
      {/* Header & Back Button */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 2rem auto' }}>
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
            fontSize: '0.9rem',
            fontWeight: '700'
          }}
        >
          <ChevronRight size={18} />
          المراحل الدراسية
        </button>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: '0.5rem 0 0 0'
          }}
        >
          لوحة تحكم: {classInfo.name}
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
          إدارة الخدمة والخدام للمرحلة والمجموعة
        </p>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '1.5rem'
        }}
      >
        {/* =========================
            1. Class Information Card
        ========================= */}
        <div
          style={{
            gridColumn: '1 / -1',
            backgroundColor: '#ffffff',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                padding: '0.75rem',
                borderRadius: '0.75rem'
              }}
            >
              <GraduationCap size={28} />
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>المرحلة التعليمية</div>
              <div style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: '800', marginTop: '0.25rem' }}>
                {classInfo.stageName || '---'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                backgroundColor: '#f5f3ff',
                color: '#7c3aed',
                padding: '0.75rem',
                borderRadius: '0.75rem'
              }}
            >
              <Layers size={28} />
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>المجموعة الدراسية</div>
              <div style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: '800', marginTop: '0.25rem' }}>
                {classInfo.stageGroupName || '---'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                backgroundColor: '#ecfdf5',
                color: '#059669',
                padding: '0.75rem',
                borderRadius: '0.75rem'
              }}
            >
              <Briefcase size={28} />
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>الصف الدراسي</div>
              <div style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: '800', marginTop: '0.25rem' }}>
                {classInfo.name || '---'}
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            2. Service Leadership Widget
        ========================= */}
        <div
          style={{
            gridColumn: '1 / span 8',
            backgroundColor: '#ffffff',
            borderRadius: '1.25rem',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
          }}
          className="responsive-column-8"
        >
          <h2
            style={{
              fontSize: '1.2rem',
              fontWeight: '800',
              color: '#0f172a',
              margin: '0 0 1.5rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderBottom: '2px solid #f1f5f9',
              paddingBottom: '0.75rem'
            }}
          >
            <ShieldCheck size={22} color="#2563eb" />
            الهيكل القيادي للخدمة
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem'
            }}
            className="leadership-grid"
          >
            {/* Stage Leader */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2563eb' }}>أمين المرحلة</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', marginTop: '0.5rem' }}>
                {leadership.stageLeader
                  ? `${leadership.stageLeader.firstName} ${leadership.stageLeader.lastName}`
                  : 'غير معين'}
              </div>
              {leadership.stageLeader?.phoneNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                  <Phone size={12} />
                  {leadership.stageLeader.phoneNumber}
                </div>
              )}
            </div>

            {/* Assistant Stage Leader */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2563eb' }}>مساعد أمين المرحلة</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', marginTop: '0.5rem' }}>
                {leadership.assistantStageLeader
                  ? `${leadership.assistantStageLeader.firstName} ${leadership.assistantStageLeader.lastName}`
                  : 'غير معين'}
              </div>
              {leadership.assistantStageLeader?.phoneNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                  <Phone size={12} />
                  {leadership.assistantStageLeader.phoneNumber}
                </div>
              )}
            </div>

            {/* Stage Group Leader */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#7c3aed' }}>أمين المجموعة</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', marginTop: '0.5rem' }}>
                {leadership.stageGroupLeader
                  ? `${leadership.stageGroupLeader.firstName} ${leadership.stageGroupLeader.lastName}`
                  : 'غير معين'}
              </div>
              {leadership.stageGroupLeader?.phoneNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                  <Phone size={12} />
                  {leadership.stageGroupLeader.phoneNumber}
                </div>
              )}
            </div>

            {/* Assistant Stage Group Leader */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#7c3aed' }}>مساعد أمين المجموعة</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', marginTop: '0.5rem' }}>
                {leadership.assistantStageGroupLeader
                  ? `${leadership.assistantStageGroupLeader.firstName} ${leadership.assistantStageGroupLeader.lastName}`
                  : 'غير معين'}
              </div>
              {leadership.assistantStageGroupLeader?.phoneNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                  <Phone size={12} />
                  {leadership.assistantStageGroupLeader.phoneNumber}
                </div>
              )}
            </div>

            {/* Class Teacher */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#059669' }}>مسؤول الفصل</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', marginTop: '0.5rem' }}>
                {leadership.classTeacher
                  ? `${leadership.classTeacher.firstName} ${leadership.classTeacher.lastName}`
                  : 'غير معين'}
              </div>
              {leadership.classTeacher?.phoneNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                  <Phone size={12} />
                  {leadership.classTeacher.phoneNumber}
                </div>
              )}
            </div>

            {/* Assistant Class Teacher */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#059669' }}>مساعد مسؤول الفصل</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', marginTop: '0.5rem' }}>
                {leadership.assistantClassTeacher
                  ? `${leadership.assistantClassTeacher.firstName} ${leadership.assistantClassTeacher.lastName}`
                  : 'غير معين'}
              </div>
              {leadership.assistantClassTeacher?.phoneNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                  <Phone size={12} />
                  {leadership.assistantClassTeacher.phoneNumber}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            3. Quick Actions Widget
        ========================= */}
        <div
          style={{
            gridColumn: '9 / span 4',
            backgroundColor: '#ffffff',
            borderRadius: '1.25rem',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
          className="responsive-column-4"
        >
          <h2
            style={{
              fontSize: '1.2rem',
              fontWeight: '800',
              color: '#0f172a',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderBottom: '2px solid #f1f5f9',
              paddingBottom: '0.75rem'
            }}
          >
            <ListTodo size={22} color="#7c3aed" />
            إجراءات سريعة
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => navigate('/dashboard/teachers')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.85rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              <Users size={18} />
              إدارة الخدام
            </button>

            <button
              onClick={() => navigate('/dashboard/teachers')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.85rem',
                backgroundColor: '#f1f5f9',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            >
              <ShieldCheck size={18} color="#7c3aed" />
              عرض هيكل القيادة
            </button>
          </div>
        </div>

        {/* =========================
            4. Servants List Widget
        ========================= */}
        <div
          style={{
            gridColumn: '1 / span 12',
            backgroundColor: '#ffffff',
            borderRadius: '1.25rem',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
          }}
        >
          <h2
            style={{
              fontSize: '1.2rem',
              fontWeight: '800',
              color: '#0f172a',
              margin: '0 0 1.5rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderBottom: '2px solid #f1f5f9',
              paddingBottom: '0.75rem'
            }}
          >
            <Users size={22} color="#2563eb" />
            قائمة الخدام بالفصل ({servants.length})
          </h2>

          {servants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              لا يوجد خدام معينين لهذا الفصل حالياً.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ padding: '0.75rem 0.5rem', color: '#475569', fontWeight: '700', fontSize: '0.9rem' }}>
                      الاسم
                    </th>
                    <th style={{ padding: '0.75rem 0.5rem', color: '#475569', fontWeight: '700', fontSize: '0.9rem' }}>
                      رقم الهاتف
                    </th>
                    <th style={{ padding: '0.75rem 0.5rem', color: '#475569', fontWeight: '700', fontSize: '0.9rem' }}>
                      الدور الخدمي
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {servants.map((servant) => (
                    <tr key={servant.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>
                        {servant.firstName} {servant.lastName}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                        {servant.phoneNumber}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#475569', fontSize: '0.85rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            borderRadius: '0.375rem',
                            fontWeight: '600'
                          }}
                        >
                          خادم
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .animate-spin {
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            @media (max-width: 1024px) {
              .responsive-column-8, .responsive-column-4 {
                grid-column: 1 / -1 !important;
              }
            }

            @media (max-width: 580px) {
              .leadership-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `
        }}
      />
    </div>
  );
};

export default ClassDashboard;
