export interface Subject {
  id: string;
  name: string;
  description?: string;
}

export interface Chapter {
  id: string;
  subject_id: string;
  name: string;
}

export interface Concept {
  id: string;
  chapter_id: string;
  name: string;
}
