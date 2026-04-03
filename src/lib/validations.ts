import { z } from 'zod';

const phoneRegex = /^[6-9]\d{9}$/;

export const loginSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Please enter a valid 10-digit mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const forgotPasswordSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Please enter a valid 10-digit mobile number'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid 10-digit mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'teacher', 'student', 'parent']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const studentSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  admission_no: z.string().min(1, 'Admission number is required'),
  roll_no: z.string().min(1, 'Roll number is required'),
  class_id: z.string().min(1, 'Class is required'),
  section_id: z.string().min(1, 'Section is required'),
  parent_id: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export const teacherSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  employee_id: z.string().min(1, 'Employee ID is required'),
  specialization: z.string().optional(),
  phone: z.string().optional(),
});

export const parentSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().optional(),
});

export const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  grade_level: z.string().min(1, 'Grade level is required'),
  academic_year_id: z.string().min(1, 'Academic year is required'),
});

export const sectionSchema = z.object({
  class_id: z.string().min(1, 'Class is required'),
  name: z.string().min(1, 'Section name is required'),
});

export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  description: z.string().optional(),
});

export const assignmentSchema = z.object({
  teacher_id: z.string().min(1, 'Teacher is required'),
  class_id: z.string().min(1, 'Class is required'),
  section_id: z.string().min(1, 'Section is required'),
  subject_id: z.string().min(1, 'Subject is required'),
});

export const leaveRequestSchema = z.object({
  from_date: z.string().min(1, 'From date is required'),
  to_date: z.string().min(1, 'To date is required'),
  reason: z.string().min(10, 'Please provide a detailed reason (min 10 characters)'),
});

export const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  recipient_role: z.enum(['admin', 'teacher', 'student', 'parent']).optional(),
  recipient_user_id: z.string().optional(),
});

export const holidaySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  holiday_date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  academic_year_id: z.string().min(1, 'Academic year is required'),
});

export const schoolSettingsSchema = z.object({
  school_name: z.string().min(1, 'School name is required'),
  minimum_attendance_percentage: z.number().min(0).max(100),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type StudentFormData = z.infer<typeof studentSchema>;
export type TeacherFormData = z.infer<typeof teacherSchema>;
export type ParentFormData = z.infer<typeof parentSchema>;
export type ClassFormData = z.infer<typeof classSchema>;
export type SectionFormData = z.infer<typeof sectionSchema>;
export type SubjectFormData = z.infer<typeof subjectSchema>;
export type AssignmentFormData = z.infer<typeof assignmentSchema>;
export type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;
export type NotificationFormData = z.infer<typeof notificationSchema>;
export type HolidayFormData = z.infer<typeof holidaySchema>;
export type SchoolSettingsFormData = z.infer<typeof schoolSettingsSchema>;
