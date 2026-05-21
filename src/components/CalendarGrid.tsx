import { format, isSameDay, isSameMonth, isToday } from 'date-fns';
import type { Category, Todo } from '../types';
import { getCalendarWeeks, getTodosForDate } from '../utils';

const DOT_COLOR: Record<Category, string> = {
  office: 'bg-blue-500',
  personal: 'bg-green-500',
  family: 'bg-purple-500',
};

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface CalendarGridProps {
  year: number;
  month: number;
  todos: Todo[];
  selectedDate: Date | null;
  onDayClick: (date: Date) => void;
}

export default function CalendarGrid({ year, month, todos, selectedDate, onDayClick }: CalendarGridProps) {
  const weeks = getCalendarWeeks(year, month);
  const currentMonth = new Date(year, month);

  return (
    <div data-testid="calendar-grid" className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {weeks.flat().map((date) => {
          const key = format(date, 'yyyy-MM-dd');
          const inMonth = isSameMonth(date, currentMonth);
          const todayCell = isToday(date);
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const dayTodos = getTodosForDate(todos, date);
          const dots = dayTodos.slice(0, 3);

          return (
            <div
              key={key}
              data-testid={todayCell ? 'calendar-day-today' : undefined}
              onClick={() => onDayClick(date)}
              className={`min-h-[80px] p-2 border-b border-r border-gray-100 cursor-pointer transition-colors ${
                inMonth ? '' : 'opacity-40'
              } ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'} ${
                todayCell ? 'ring-2 ring-inset ring-blue-400' : ''
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full ${
                  todayCell ? 'bg-blue-500 text-white' : 'text-gray-700'
                }`}
              >
                {date.getDate()}
              </span>

              {dots.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {dots.map((todo, i) => (
                    <span
                      key={i}
                      data-testid="calendar-day-dot"
                      className={`w-2 h-2 rounded-full ${DOT_COLOR[todo.category]}`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
