
export interface User {
  fullName: string;
  licenseNumber: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Module {
  title: string;
  summary: string;
  content: string;
  quiz: QuizQuestion[];
}

export interface CourseData {
  modules: Module[];
}

export interface StoredUser extends User {
  courseTaken: boolean;
  score?: number;
}
