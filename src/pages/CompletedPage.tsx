import { useState } from 'react';
import { useTodos } from '../context';
import type { Category } from '../types';
import CompletedTodoCard from '../components/CompletedTodoCard';

type FilterValue = 'all' | Category;

const FILTERS: { label: string; value: FilterValue; testId: string }[] = [
  { label: 'All', value: 'all', testId: 'completed-filter-all' },
  { label: 'Office', value: 'office', testId: 'completed-filter-office' },
  { label: 'Personal', value: 'personal', testId: 'completed-filter-personal' },
  { label: 'Family', value: 'family', testId: 'completed-filter-family' },
];

export default function CompletedPage() {
  const { todos, toggleComplete, deleteTodo } = useTodos();
  const [filter, setFilter] = useState<FilterValue>('all');

  const completedTodos = todos
    .filter((t) => t.completed)
    .sort((a, b) => {
      const aDate = a.completedAt ?? '';
      const bDate = b.completedAt ?? '';
      return bDate.localeCompare(aDate);
    });

  const filtered =
    filter === 'all' ? completedTodos : completedTodos.filter((t) => t.category === filter);

  return (
    <main data-testid="page-completed" className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Completed</h1>
        <p className="text-sm text-gray-500 mt-0.5">{completedTodos.length} completed todo{completedTodos.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map(({ label, value, testId }) => (
          <button
            key={value}
            data-testid={testId}
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          data-testid="completed-empty-state"
          className="text-center py-12 text-gray-400"
        >
          <p className="text-sm">No completed todos{filter !== 'all' ? ` in ${filter}` : ''} yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((todo) => (
            <CompletedTodoCard
              key={todo.id}
              todo={todo}
              onRestore={toggleComplete}
              onDelete={deleteTodo}
            />
          ))}
        </div>
      )}
    </main>
  );
}
