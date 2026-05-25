import { useState } from 'react';
import type { Todo } from '../types';
import PriorityBadge from './PriorityBadge';
import { isOverdue } from '../utils';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const categoryBadgeClass: Record<string, string> = {
  office: 'bg-blue-100 text-blue-800',
  personal: 'bg-green-100 text-green-800',
  family: 'bg-purple-100 text-purple-800',
};

export default function TodoCard({ todo, onEdit, onDelete, onToggleComplete }: TodoCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const overdue = isOverdue(todo);

  return (
    <div
      data-testid="todo-card"
      className={`bg-white border rounded-lg p-4 shadow-sm ${
        overdue ? 'border-red-400 ring-2 ring-red-400' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <span data-testid="todo-card-title" className="text-base font-medium text-gray-900 block">
            {todo.title}
          </span>
          <span
            data-testid="todo-card-category-badge"
            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              categoryBadgeClass[todo.category] ?? 'bg-gray-100 text-gray-800'
            }`}
          >
            {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
          </span>
          {overdue && (
            <span
              data-testid="todo-card-overdue-badge"
              className="inline-block mt-1 ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700"
            >
              Overdue
            </span>
          )}
          <PriorityBadge category={todo.category} />
          <div className="mt-2 text-xs text-gray-500 space-y-0.5">
            <p>Work on: {todo.workOnDate}</p>
            <p>Due: {todo.dueDate}</p>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            data-testid="todo-card-complete-btn"
            onClick={() => onToggleComplete(todo.id)}
            className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100"
          >
            {todo.completed ? 'Undo' : 'Complete'}
          </button>
          <button
            data-testid="todo-card-edit-btn"
            onClick={() => onEdit(todo)}
            className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
          >
            Edit
          </button>
          <button
            data-testid="todo-card-delete-btn"
            onClick={() => setShowConfirm(true)}
            className="px-2 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          <span className="text-sm text-gray-600 flex-1">Delete this todo?</span>
          <button
            data-testid="todo-card-delete-cancel"
            onClick={() => setShowConfirm(false)}
            className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            data-testid="todo-card-delete-confirm"
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
