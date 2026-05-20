import { useState, useEffect, useRef } from 'react';
import type { Todo, Category } from '../types';

type AddTodoInput = Omit<Todo, 'id' | 'completed' | 'completedAt' | 'createdAt' | 'updatedAt'>;

interface TodoFormProps {
  initialValues?: Partial<Todo>;
  onSubmit: (values: AddTodoInput) => void;
  onCancel: () => void;
}

const CATEGORIES: Category[] = ['office', 'personal', 'family'];

const categoryActiveClass: Record<Category, string> = {
  office: 'bg-blue-600 text-white border-blue-600',
  personal: 'bg-green-600 text-white border-green-600',
  family: 'bg-purple-600 text-white border-purple-600',
};

function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

export default function TodoForm({ initialValues, onSubmit, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [category, setCategory] = useState<Category>(initialValues?.category ?? 'office');
  const [workOnDate, setWorkOnDate] = useState(initialValues?.workOnDate ?? todayString());
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ?? todayString());
  const [titleError, setTitleError] = useState('');
  const [dueDateError, setDueDateError] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;

    if (!title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    } else {
      setTitleError('');
    }

    if (dueDate < workOnDate) {
      setDueDateError('Due date cannot be before the work-on date.');
      valid = false;
    } else {
      setDueDateError('');
    }

    if (!valid) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      workOnDate,
      dueDate,
    });
  }

  return (
    <form data-testid="todo-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          ref={titleRef}
          data-testid="todo-title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {titleError && (
          <p data-testid="todo-title-error" className="text-red-600 text-sm mt-1">
            {titleError}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          data-testid="todo-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              data-testid={`todo-category-${cat}`}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                category === cat
                  ? categoryActiveClass[cat]
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Work-on Date</label>
        <input
          data-testid="todo-work-on-date"
          type="date"
          value={workOnDate}
          onChange={(e) => setWorkOnDate(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input
          data-testid="todo-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {dueDateError && (
          <p data-testid="todo-due-date-error" className="text-red-600 text-sm mt-1">
            {dueDateError}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          data-testid="todo-form-cancel"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="todo-form-submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {initialValues?.id ? 'Save' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
}
