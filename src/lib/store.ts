import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';

export type Priority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  description: string;
}

export interface Grade {
  id: string;
  subject: string;
  evaluations: number[];
  teacherTest: number;
  trimesterTest: number;
  finalAverage: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  pinned: boolean;
  url?: string;
}

export interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  avatar: string;
}

export interface Settings {
  ringtone: string;
  weights: {
    evaluations: number;
    teacherTest: number;
    trimesterTest: number;
  };
}

interface StudyStore {
  user: User | null;
  tasks: Task[];
  goals: Goal[];
  exams: Exam[];
  grades: Grade[];
  documents: Document[];
  messages: Message[];
  settings: Settings;
  theme: 'light' | 'dark';
  setUser: (user: User | null) => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoalProgress: (id: string, current: number) => void;
  deleteGoal: (id: string) => void;
  addExam: (exam: Omit<Exam, 'id'>) => void;
  deleteExam: (id: string) => void;
  addGrade: (grade: Omit<Grade, 'id' | 'finalAverage'>) => void;
  deleteGrade: (id: string) => void;
  addDocument: (doc: Omit<Document, 'id' | 'date' | 'pinned'>) => void;
  togglePinDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
  addMessage: (content: string) => Promise<void>;
  fetchMessages: () => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      user: null,
      tasks: [],
      goals: [],
      exams: [],
      grades: [],
      documents: [],
      messages: [],
      settings: {
        ringtone: 'Crystal',
        weights: {
          evaluations: 30,
          teacherTest: 30,
          trimesterTest: 40,
        },
      },
      theme: 'light',
      setUser: (user) => set({ user }),
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...task, id: Math.random().toString(36).substr(2, 9), completed: false },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, { ...goal, id: Math.random().toString(36).substr(2, 9) }],
        })),
      updateGoalProgress: (id, current) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, current } : g)),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
      addExam: (exam) =>
        set((state) => ({
          exams: [...state.exams, { ...exam, id: Math.random().toString(36).substr(2, 9) }],
        })),
      deleteExam: (id) =>
        set((state) => ({
          exams: state.exams.filter((e) => e.id !== id),
        })),
      addGrade: (grade) =>
        set((state) => {
          const { weights } = state.settings;
          const avgEval = grade.evaluations.reduce((a, b) => a + b, 0) / 4;
          const finalAverage = 
            (avgEval * (weights.evaluations / 100)) + 
            (grade.teacherTest * (weights.teacherTest / 100)) + 
            (grade.trimesterTest * (weights.trimesterTest / 100));
          
          return {
            grades: [...state.grades, { 
              ...grade, 
              id: Math.random().toString(36).substr(2, 9),
              finalAverage: Number(finalAverage.toFixed(2))
            }],
          };
        }),
      deleteGrade: (id) =>
        set((state) => ({
          grades: state.grades.filter((g) => g.id !== id),
        })),
      addDocument: (doc) =>
        set((state) => ({
          documents: [
            ...state.documents,
            { 
              ...doc, 
              id: Math.random().toString(36).substr(2, 9), 
              date: new Date().toISOString(),
              pinned: false 
            },
          ],
        })),
      togglePinDocument: (id) =>
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, pinned: !d.pinned } : d
          ),
        })),
      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        })),
      fetchMessages: async () => {
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('timestamp', { ascending: true });
          if (!error && data) set({ messages: data });
        } catch (e) {
          console.error("Failed to fetch messages", e);
        }
      },
      addMessage: async (content) => {
        const user = get().user;
        const newMessage = {
          user: user?.name || 'Estudante Anónimo',
          content,
          timestamp: new Date().toISOString(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'anon'}`
        };
        try {
          const { data, error } = await supabase.from('messages').insert([newMessage]).select();
          if (!error && data) {
            set((state) => ({ messages: [...state.messages, data[0]] }));
          }
        } catch (e) {
          console.error("Failed to add message", e);
        }
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'study-flow-storage',
    }
  )
);
