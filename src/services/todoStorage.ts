import type { Todo } from '../types';

const STORAGE_KEY = 'founder_todos';

function load(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    return JSON.parse(raw) as Todo[];
  } catch (err) {
    console.error('todoStorage.load: failed to parse stored todos, resetting to empty state', err);
    return [];
  }
}

function save(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function clear(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export const todoStorage = { load, save, clear };
