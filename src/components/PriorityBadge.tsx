import type { Category } from '../types';
import { getPriority } from '../utils';

interface PriorityBadgeProps {
  category: Category;
  referenceDate?: Date;
}

const badgeClass: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
};

export default function PriorityBadge({ category, referenceDate }: PriorityBadgeProps) {
  const priority = getPriority(category, referenceDate);
  const label = priority.charAt(0).toUpperCase() + priority.slice(1);
  return (
    <span
      data-testid="priority-badge"
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass[priority]}`}
    >
      {label}
    </span>
  );
}
