import type { TodoState, TodoAction } from '../types';

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };

    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(t => t.id !== action.payload) };

    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(t => t.id === action.payload.id ? action.payload : t),
      };

    case 'TOGGLE_COMPLETE': {
      const { id, completed, completedAt, updatedAt } = action.payload;
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === id ? { ...t, completed, completedAt, updatedAt } : t
        ),
      };
    }

    case 'LOAD_TODOS':
      return { ...state, todos: action.payload };

    default:
      return state;
  }
}
