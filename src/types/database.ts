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

export interface StudentConceptStateRow {
  student_id: string;
  concept_id: string;
  mastery: number;
  confidence: number;
  learning_gain: number;
  revision_due: boolean;
  revision_at: string | null;
  attempts: number;
  correct_attempts: number;
  last_attempt_at: string | null;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: UserRole;
        Insert: Omit<UserRole, "id"> & { id?: string };
        Update: Partial<UserRole>;
        Relationships: [];
      };
      subjects: {
        Row: Subject;
        Insert: Omit<Subject, "id"> & { id?: string };
        Update: Partial<Subject>;
        Relationships: [];
      };
      chapters: {
        Row: Chapter;
        Insert: Omit<Chapter, "id"> & { id?: string };
        Update: Partial<Chapter>;
        Relationships: [];
      };
      concepts: {
        Row: Concept;
        Insert: Omit<Concept, "id"> & { id?: string };
        Update: Partial<Concept>;
        Relationships: [];
      };
      questions: {
        Row: Question;
        Insert: Omit<Question, "id"> & { id?: string };
        Update: Partial<Question>;
        Relationships: [];
      };
      question_attempts: {
        Row: QuestionAttempt;
        Insert: Omit<QuestionAttempt, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<QuestionAttempt>;
        Relationships: [];
      };
      student_concept_state: {
        Row: StudentConceptStateRow;
        Insert: Partial<StudentConceptStateRow> &
          Pick<StudentConceptStateRow, "student_id" | "concept_id">;
        Update: Partial<StudentConceptStateRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: AppRole;
    };
    CompositeTypes: Record<string, never>;
  };
}


