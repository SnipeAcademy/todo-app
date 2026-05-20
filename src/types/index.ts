export type Category = 'office' | 'personal' | 'family';
export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  category: Category;
  workOnDate: string;   // YYYY-MM-DD
  dueDate: string;      // YYYY-MM-DD
  completed: boolean;
  completedAt?: string; // ISO datetime
  createdAt: string;    // ISO datetime
  updatedAt: string;    // ISO datetime
}

export interface TodoState {
  todos: Todo[];
}

export type TodoAction =
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: string; completed: boolean; completedAt: string | undefined; updatedAt: string } }
  | { type: 'LOAD_TODOS'; payload: Todo[] };
