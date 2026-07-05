// Database types for the Learning Intelligence System.
// Keep in sync with supabase/migrations.

export type AppRole = "student" | "teacher" | "admin";

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface Subject {
  id: string;
  name: string;
  description: string | null;
}

export interface Chapter {
  id: string;
  subject_id: string;
  name: string;
  description: string | null;
}

export interface Concept {
  id: string;
  chapter_id: string;
  name: string;
  description: string | null;
}

export interface Question {
  id: string;
  concept_id: string;
  question: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_option: string | null;
  difficulty: string | null;
  explanation: string | null;
}

export interface QuestionAttempt {
  id: string;
  student_id: string;
  question_id: string;
  selected_option: string | null;
  correct: boolean | null;
  response_time: number | null;
  attempt_number: number | null;
  hint_used: boolean | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: UserRole;
        Insert: Omit<UserRole, "id"> & { id?: string };
        Update: Partial<UserRole>;
      };
      subjects: {
        Row: Subject;
        Insert: Omit<Subject, "id"> & { id?: string };
        Update: Partial<Subject>;
      };
      chapters: {
        Row: Chapter;
        Insert: Omit<Chapter, "id"> & { id?: string };
        Update: Partial<Chapter>;
      };
      concepts: {
        Row: Concept;
        Insert: Omit<Concept, "id"> & { id?: string };
        Update: Partial<Concept>;
      };
      questions: {
        Row: Question;
        Insert: Omit<Question, "id"> & { id?: string };
        Update: Partial<Question>;
      };
      question_attempts: {
        Row: QuestionAttempt;
        Insert: Omit<QuestionAttempt, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<QuestionAttempt>;
      };
    };
  };
}
