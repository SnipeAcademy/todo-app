import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Todo } from '../types';
import { todoReducer } from './todoReducer';
import { todoStorage } from '../services/todoStorage';
import { generateId } from '../utils/generateId';

type AddTodoInput = Omit<Todo, 'id' | 'completed' | 'completedAt' | 'createdAt' | 'updatedAt'>;

interface TodoContextValue {
  todos: Todo[];
  addTodo: (input: AddTodoInput) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (todo: Todo) => void;
  toggleComplete: (id: string) => void;
}

declare global {
  interface Window {
    __TODO_CONTEXT__?: TodoContextValue;
  }
}

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, { todos: todoStorage.load() });

  const addTodo = useCallback((input: AddTodoInput) => {
    const now = new Date().toISOString();
    dispatch({
      type: 'ADD_TODO',
      payload: {
        ...input,
        id: generateId(),
        completed: false,
        createdAt: now,
        updatedAt: now,
      },
    });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  }, []);

  const updateTodo = useCallback((todo: Todo) => {
    dispatch({
      type: 'UPDATE_TODO',
      payload: { ...todo, updatedAt: new Date().toISOString() },
    });
  }, []);

  const { todos } = state;

  const toggleComplete = useCallback((id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const now = new Date().toISOString();
    dispatch({
      type: 'TOGGLE_COMPLETE',
      payload: {
        id,
        completed: !todo.completed,
        completedAt: !todo.completed ? now : undefined,
        updatedAt: now,
      },
    });
  }, [todos]);

  const contextValue = useMemo<TodoContextValue>(
    () => ({ todos, addTodo, deleteTodo, updateTodo, toggleComplete }),
    [todos, addTodo, deleteTodo, updateTodo, toggleComplete]
  );

  useEffect(() => {
    todoStorage.save(todos);
  }, [todos]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__TODO_CONTEXT__ = contextValue;
    }
  }, [contextValue]);

  return <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>;
}

export function useTodos(): TodoContextValue {
  const ctx = useContext(TodoContext);
  if (ctx === null) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return ctx;
}
