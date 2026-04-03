-- ============================================================
-- Smart School Attendance Portal — Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES (linked to auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  phone TEXT,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. ACADEMIC YEARS
-- ============================================================
CREATE TABLE public.academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. CLASSES
-- ============================================================
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. SECTIONS
-- ============================================================
CREATE TABLE public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(class_id, name)
);

-- ============================================================
-- 5. SUBJECTS
-- ============================================================
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. TEACHERS
-- ============================================================
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL UNIQUE,
  specialization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. PARENTS
-- ============================================================
CREATE TABLE public.parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8. STUDENTS
-- ============================================================
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  admission_no TEXT NOT NULL UNIQUE,
  roll_no TEXT NOT NULL,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE SET NULL,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.parents(id) ON DELETE SET NULL,
  dob DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  address TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 9. TEACHER ASSIGNMENTS
-- ============================================================
CREATE TABLE public.teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(teacher_id, class_id, section_id, subject_id)
);

-- ============================================================
-- 10. ATTENDANCE
-- ============================================================
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  attendance_date DATE NOT NULL,
  period_no INTEGER,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused', 'leave')),
  remarks TEXT,
  marked_by UUID NOT NULL REFERENCES public.profiles(id),
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, attendance_date, subject_id, period_no)
);

-- ============================================================
-- 11. ATTENDANCE AUDIT LOGS
-- ============================================================
CREATE TABLE public.attendance_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID NOT NULL REFERENCES public.attendance(id) ON DELETE CASCADE,
  old_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  old_remarks TEXT,
  new_remarks TEXT,
  changed_by UUID NOT NULL REFERENCES public.profiles(id),
  change_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-insert audit log on attendance update
CREATE OR REPLACE FUNCTION public.log_attendance_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status OR OLD.remarks IS DISTINCT FROM NEW.remarks THEN
    INSERT INTO public.attendance_audit_logs (
      attendance_id, old_status, new_status, old_remarks, new_remarks, changed_by
    ) VALUES (
      NEW.id, OLD.status, NEW.status, OLD.remarks, NEW.remarks, COALESCE(NEW.updated_by, NEW.marked_by)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_attendance_update
  AFTER UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.log_attendance_change();

-- ============================================================
-- 12. LEAVE REQUESTS
-- ============================================================
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES public.profiles(id),
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 13. NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  recipient_role TEXT CHECK (recipient_role IN ('admin', 'teacher', 'student', 'parent')),
  recipient_user_id UUID REFERENCES public.profiles(id),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 14. HOLIDAYS
-- ============================================================
CREATE TABLE public.holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  holiday_date DATE NOT NULL,
  description TEXT,
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 15. SCHOOL SETTINGS
-- ============================================================
CREATE TABLE public.school_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL,
  logo_url TEXT,
  minimum_attendance_percentage INTEGER NOT NULL DEFAULT 75,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_attendance_student_date ON public.attendance(student_id, attendance_date);
CREATE INDEX idx_attendance_class_date ON public.attendance(class_id, attendance_date);
CREATE INDEX idx_attendance_date ON public.attendance(attendance_date);
CREATE INDEX idx_students_class ON public.students(class_id);
CREATE INDEX idx_students_section ON public.students(section_id);
CREATE INDEX idx_teacher_assignments_teacher ON public.teacher_assignments(teacher_id);
CREATE INDEX idx_notifications_recipient ON public.notifications(recipient_user_id);
CREATE INDEX idx_leave_requests_student ON public.leave_requests(student_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON public.profiles FOR SELECT USING ((SELECT get_user_role()) = 'admin');
CREATE POLICY "Admin can manage profiles" ON public.profiles FOR ALL USING ((SELECT get_user_role()) = 'admin');
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- CLASSES, SECTIONS, SUBJECTS - readable by all authenticated, manageable by admin
CREATE POLICY "Authenticated can view classes" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage classes" ON public.classes FOR ALL USING ((SELECT get_user_role()) = 'admin');

CREATE POLICY "Authenticated can view sections" ON public.sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage sections" ON public.sections FOR ALL USING ((SELECT get_user_role()) = 'admin');

CREATE POLICY "Authenticated can view subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage subjects" ON public.subjects FOR ALL USING ((SELECT get_user_role()) = 'admin');

-- ATTENDANCE policies
CREATE POLICY "Admin full access attendance" ON public.attendance FOR ALL USING ((SELECT get_user_role()) = 'admin');
CREATE POLICY "Teacher can view assigned attendance" ON public.attendance FOR SELECT USING (
  (SELECT get_user_role()) = 'teacher' AND
  EXISTS (
    SELECT 1 FROM public.teacher_assignments ta
    JOIN public.teachers t ON t.id = ta.teacher_id
    WHERE t.profile_id = auth.uid()
    AND ta.class_id = attendance.class_id
    AND ta.section_id = attendance.section_id
  )
);
CREATE POLICY "Teacher can mark attendance" ON public.attendance FOR INSERT WITH CHECK (
  (SELECT get_user_role()) = 'teacher' AND
  EXISTS (
    SELECT 1 FROM public.teacher_assignments ta
    JOIN public.teachers t ON t.id = ta.teacher_id
    WHERE t.profile_id = auth.uid()
    AND ta.class_id = attendance.class_id
    AND ta.section_id = attendance.section_id
  )
);
CREATE POLICY "Student can view own attendance" ON public.attendance FOR SELECT USING (
  (SELECT get_user_role()) = 'student' AND
  EXISTS (
    SELECT 1 FROM public.students s WHERE s.profile_id = auth.uid() AND s.id = attendance.student_id
  )
);
CREATE POLICY "Parent can view child attendance" ON public.attendance FOR SELECT USING (
  (SELECT get_user_role()) = 'parent' AND
  EXISTS (
    SELECT 1 FROM public.students s
    JOIN public.parents p ON p.id = s.parent_id
    WHERE p.profile_id = auth.uid() AND s.id = attendance.student_id
  )
);

-- LEAVE REQUESTS policies
CREATE POLICY "Admin full access leave" ON public.leave_requests FOR ALL USING ((SELECT get_user_role()) = 'admin');
CREATE POLICY "Student can create leave" ON public.leave_requests FOR INSERT WITH CHECK (
  (SELECT get_user_role()) = 'student' AND requested_by = auth.uid()
);
CREATE POLICY "Student can view own leave" ON public.leave_requests FOR SELECT USING (
  (SELECT get_user_role()) = 'student' AND requested_by = auth.uid()
);
CREATE POLICY "Parent can manage child leave" ON public.leave_requests FOR ALL USING (
  (SELECT get_user_role()) = 'parent' AND
  EXISTS (
    SELECT 1 FROM public.students s
    JOIN public.parents p ON p.id = s.parent_id
    WHERE p.profile_id = auth.uid() AND s.id = leave_requests.student_id
  )
);

-- NOTIFICATIONS policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (
  recipient_user_id = auth.uid() OR
  recipient_role = (SELECT get_user_role()) OR
  recipient_role IS NULL
);
CREATE POLICY "Admin can manage notifications" ON public.notifications FOR ALL USING ((SELECT get_user_role()) = 'admin');

-- Other tables - admin full, authenticated read
CREATE POLICY "Auth can view academic years" ON public.academic_years FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages academic years" ON public.academic_years FOR ALL USING ((SELECT get_user_role()) = 'admin');

CREATE POLICY "Auth can view teachers" ON public.teachers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages teachers" ON public.teachers FOR ALL USING ((SELECT get_user_role()) = 'admin');

CREATE POLICY "Auth can view students" ON public.students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages students" ON public.students FOR ALL USING ((SELECT get_user_role()) = 'admin');

CREATE POLICY "Auth can view parents" ON public.parents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages parents" ON public.parents FOR ALL USING ((SELECT get_user_role()) = 'admin');

CREATE POLICY "Auth can view assignments" ON public.teacher_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages assignments" ON public.teacher_assignments FOR ALL USING ((SELECT get_user_role()) = 'admin');

CREATE POLICY "Auth can view holidays" ON public.holidays FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages holidays" ON public.holidays FOR ALL USING ((SELECT get_user_role()) = 'admin');

CREATE POLICY "Auth can view school settings" ON public.school_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages school settings" ON public.school_settings FOR ALL USING ((SELECT get_user_role()) = 'admin');

CREATE POLICY "Admin can view audit logs" ON public.attendance_audit_logs FOR SELECT USING ((SELECT get_user_role()) = 'admin');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('school-assets', 'school-assets', true);

-- Storage policies
CREATE POLICY "Public avatar access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
