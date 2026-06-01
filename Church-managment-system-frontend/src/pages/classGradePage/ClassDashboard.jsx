import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  GraduationCap,
  Layers,
  Users,
  BookOpen,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Phone,
  Briefcase,
  Loader2,
  AlertCircle
} from 'lucide-react';

import { getAllClassGrades } from '../../services/classGrade.service';
import { getAllTeachers } from '../../services/teacher.service';
import { getLessonsByClassGrade, getLastLessonByClassGrade } from '../../services/lesson.service';
import { getAttendanceByClassGradeId } from '../../services/attendance.service';

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
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    percentage: 0
  });
  const [lessonsInfo, setLessonsInfo] = useState({
    total: 0,
    lastLesson: null,
    upcomingLesson: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const [grades, teachers, lessons, lastLesson, attendance] = await Promise.all([
          getAllClassGrades(),
          getAllTeachers(),
          getLessonsByClassGrade(classGradeId),
          getLastLessonByClassGrade(classGradeId).catch(() => null), // Catch 404 if no lessons exist yet
          getAttendanceByClassGradeId(classGradeId)
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

        // 4. Servants Attendance Summary
        const teacherAttendance = attendance.filter((rec) => rec.userRole === 'TEACHER');
        const presentCount = teacherAttendance.filter((rec) => rec.status === true).length;
        const absentCount = teacherAttendance.filter((rec) => rec.status === false).length;
        const totalAttendance = teacherAttendance.length;
        const percentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

        setAttendanceSummary({
          present: presentCount,
          absent: absentCount,
          percentage
        });

        // 5. Lessons Info
        // Sort lessons by date to locate the upcoming one
        const sortedLessons = [...(lessons || [])].sort(
          (a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime()
        );

        let upcoming = null;
        if (lastLesson) {
          upcoming = sortedLessons.find(
            (l) => new Date(l.date || '').getTime() > new Date(lastLesson.date || '').getTime()
          );
        } else {
          upcoming = sortedLessons.find((l) => new Date(l.date || '').getTime() >= new Date().getTime());
        }

        setLessonsInfo({
          total: lessons ? lessons.length : 0,
          lastLesson: lastLesson || null,
          upcomingLesson: upcoming || null
        });
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
            3. Servants Attendance Summary Widget
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
            justifyContent: 'space-between'
          }}
          className="responsive-column-4"
        >
          <div>
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
              <UserCheck size={22} color="#059669" />
              حضور الخدام
            </h2>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '1.5rem 0'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: `conic-gradient(#059669 ${attendanceSummary.percentage}%, #f1f5f9 ${attendanceSummary.percentage}% 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
                    {attendanceSummary.percentage}%
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>نسبة الحضور</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              backgroundColor: '#f8fafc',
              padding: '1rem',
              borderRadius: '0.75rem',
              gap: '1rem'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669' }}>
                {attendanceSummary.present}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', marginTop: '0.25rem' }}>
                الحاضرين
              </div>
            </div>

            <div style={{ width: '1px', backgroundColor: '#e2e8f0' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ef4444' }}>
                {attendanceSummary.absent}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', marginTop: '0.25rem' }}>
                الغائبين
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            4. Servants List Widget
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
                      الدور الخدمي
                    </th>
                    <th style={{ padding: '0.75rem 0.5rem', color: '#475569', fontWeight: '700', fontSize: '0.9rem' }}>
                      رقم الهاتف
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {servants.map((servant) => (
                    <tr key={servant.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>
                        {servant.firstName} {servant.lastName}
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
                      <td style={{ padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                        {servant.phoneNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =========================
            5. Lessons & Curriculum Widget
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
            justifyContent: 'space-between'
          }}
          className="responsive-column-4"
        >
          <div>
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
              <BookOpen size={22} color="#7c3aed" />
              المنهج والدروس
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>الدرس الأخير</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginTop: '0.25rem' }}>
                  {lessonsInfo.lastLesson ? lessonsInfo.lastLesson.title : 'لا يوجد'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>الدرس القادم</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginTop: '0.25rem' }}>
                  {lessonsInfo.upcomingLesson ? lessonsInfo.upcomingLesson.title : 'لا يوجد'}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#faf5ff',
              border: '1px solid #f3e8ff',
              padding: '1rem',
              borderRadius: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.5rem'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#6b21a8' }}>إجمالي دروس المنهج:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#7c3aed' }}>
              {lessonsInfo.total}
            </span>
          </div>
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
