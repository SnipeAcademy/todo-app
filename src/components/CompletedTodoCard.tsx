import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import type { Todo } from '../types';

interface CompletedTodoCardProps {
  todo: Todo;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryBadgeClass: Record<string, string> = {
  office: 'bg-blue-100 text-blue-800',
  personal: 'bg-green-100 text-green-800',
  family: 'bg-purple-100 text-purple-800',
};

export default function CompletedTodoCard({ todo, onRestore, onDelete }: CompletedTodoCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const completedDate = todo.completedAt
    ? format(parseISO(todo.completedAt), 'MMM d, yyyy')
    : 'Unknown date';

  return (
    <div data-testid="completed-todo-card" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <span data-testid="completed-todo-card-title" className="text-base font-medium text-gray-400 line-through block">
            {todo.title}
          </span>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              categoryBadgeClass[todo.category] ?? 'bg-gray-100 text-gray-800'
            }`}
          >
            {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
          </span>
          <p
            data-testid="completed-todo-completed-date"
            className="mt-1.5 text-xs text-gray-400"
          >
            Completed {completedDate}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            data-testid="completed-todo-restore-btn"
            onClick={() => onRestore(todo.id)}
            className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100"
          >
            Restore
          </button>
          <button
            data-testid="completed-todo-delete-btn"
            onClick={() => setShowConfirm(true)}
            className="px-2 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          <span className="text-sm text-gray-600 flex-1">Permanently delete this todo?</span>
          <button
            data-testid="completed-todo-delete-cancel"
            onClick={() => setShowConfirm(false)}
            className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            data-testid="completed-todo-delete-confirm"
            onClick={() => onDelete(todo.id)}
            className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
