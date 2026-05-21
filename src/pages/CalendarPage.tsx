import { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { useTodos } from '../context';
import CalendarGrid from '../components/CalendarGrid';
import DayPanel from '../components/DayPanel';
import { getTodosForDate } from '../utils';

export default function CalendarPage() {
  const { todos } = useTodos();
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  function goToPrev() {
    setViewDate((d) => subMonths(d, 1));
  }

  function goToNext() {
    setViewDate((d) => addMonths(d, 1));
  }

  function goToToday() {
    setViewDate(new Date());
  }

  function handleDayClick(date: Date) {
    setSelectedDate(date);
  }

  function handleClosePanel() {
    setSelectedDate(null);
  }

  const panelTodos = selectedDate ? getTodosForDate(todos, selectedDate) : [];

  return (
    <main data-testid="page-calendar" className="p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <button
          data-testid="calendar-prev-btn"
          onClick={goToPrev}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          ‹
        </button>
        <h1
          data-testid="calendar-header"
          className="text-xl font-bold text-gray-900 min-w-[160px] text-center"
        >
          {format(viewDate, 'MMMM yyyy')}
        </h1>
        <button
          data-testid="calendar-next-btn"
          onClick={goToNext}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          ›
        </button>
        <button
          data-testid="calendar-today-btn"
          onClick={goToToday}
          className="ml-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
        >
          Today
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <CalendarGrid
            year={year}
            month={month}
            todos={todos}
            selectedDate={selectedDate}
            onDayClick={handleDayClick}
          />
        </div>

        {selectedDate && (
          <DayPanel
            date={selectedDate}
            todos={panelTodos}
            onClose={handleClosePanel}
          />
        )}
      </div>
    </main>
  );
}
