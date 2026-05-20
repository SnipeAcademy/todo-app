import { isWeekend } from 'date-fns';
import type { Category, Priority, Todo } from '../types';

const WEEKDAY_PRIORITY: Record<Category, Priority> = {
  office: 'high',
  personal: 'medium',
  family: 'low',
};

const WEEKEND_PRIORITY: Record<Category, Priority> = {
  family: 'high',
  personal: 'medium',
  office: 'low',
};

const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function getPriority(category: Category, referenceDate: Date = new Date()): Priority {
  return isWeekend(referenceDate) ? WEEKEND_PRIORITY[category] : WEEKDAY_PRIORITY[category];
}

export function sortTodosByPriority(todos: Todo[], referenceDate: Date = new Date()): Todo[] {
  return [...todos].sort((a, b) => {
    const wa = PRIORITY_WEIGHT[getPriority(a.category, referenceDate)];
    const wb = PRIORITY_WEIGHT[getPriority(b.category, referenceDate)];
    if (wa !== wb) return wa - wb;
    return a.dueDate.localeCompare(b.dueDate);
  });
}
