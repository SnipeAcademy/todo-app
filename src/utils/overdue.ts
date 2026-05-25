import type { Todo } from '../types';

export function isOverdue(todo: Todo): boolean {
  if (todo.completed) return false;
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return todo.dueDate < today;
}
