export type SortKey = 'priority' | 'due-date' | 'created';

interface SortControlProps {
  value: SortKey;
  onChange: (v: SortKey) => void;
}

const SORT_OPTIONS: { key: SortKey; label: string; testId: string }[] = [
  { key: 'priority', label: 'Priority', testId: 'sort-priority' },
  { key: 'due-date', label: 'Due Date', testId: 'sort-due-date' },
  { key: 'created', label: 'Created', testId: 'sort-created' },
];

export default function SortControl({ value, onChange }: SortControlProps) {
  return (
    <div
      data-testid="sort-control"
      className="flex rounded-md border border-gray-300 overflow-hidden"
    >
      {SORT_OPTIONS.map(({ key, label, testId }) => (
        <button
          key={key}
          data-testid={testId}
          onClick={() => onChange(key)}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            value === key
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
