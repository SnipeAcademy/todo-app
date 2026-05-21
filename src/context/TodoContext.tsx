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

  const { todos } = state;

  const addTodo = useCallback((input: AddTodoInput) => {
    const now = new Date().toISOString();
    const newTodo = {
      ...input,
      id: generateId(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_TODO', payload: newTodo });
    // Save synchronously so a page.reload() immediately after sees the new todo
    todoStorage.save([...todos, newTodo]);
  }, [todos]);

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
    todoStorage.save(todos.filter(t => t.id !== id));
  }, [todos]);

  const updateTodo = useCallback((todo: Todo) => {
    const updated = { ...todo, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_TODO', payload: updated });
    todoStorage.save(todos.map(t => t.id === updated.id ? updated : t));
  }, [todos]);

  const toggleComplete = useCallback((id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const now = new Date().toISOString();
    const payload = {
      id,
      completed: !todo.completed,
      completedAt: !todo.completed ? now : undefined,
      updatedAt: now,
    };
    dispatch({ type: 'TOGGLE_COMPLETE', payload });
    todoStorage.save(todos.map(t => t.id === id ? { ...t, ...payload } : t));
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
