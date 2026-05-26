import { useState } from 'react';
import { format, isWeekend } from 'date-fns';
import { useTodos } from '../context';
import type { Todo } from '../types';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import SortControl from '../components/SortControl';
import type { SortKey } from '../components/SortControl';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import { sortTodosByPriority, isOverdue } from '../utils';

type AddTodoInput = Omit<Todo, 'id' | 'completed' | 'completedAt' | 'createdAt' | 'updatedAt'>;
type FilterType = 'all' | 'overdue' | 'office' | 'personal' | 'family';

export default function DashboardPage() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete } = useTodos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('priority');

  function handleOpenAdd() {
    setEditingTodo(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(todo: Todo) {
    setEditingTodo(todo);
    setIsModalOpen(true);
  }

  function handleClose() {
    setIsModalOpen(false);
    setEditingTodo(null);
  }

  function handleSubmit(values: AddTodoInput) {
    if (editingTodo) {
      updateTodo({ ...editingTodo, ...values });
    } else {
      addTodo(values);
    }
    handleClose();
  }

  const today = new Date();
  const todayHeading = format(today, 'EEEE, MMMM d, yyyy');
  const isWeekendDay = isWeekend(today);
  const modeLabel = isWeekendDay ? 'Weekend Mode' : 'Weekday Mode';
  const activeTodos = todos.filter(t => !t.completed);
  const categoryFiltered =
    activeFilter === 'overdue'
      ? activeTodos.filter(isOverdue)
      : activeFilter === 'all'
        ? activeTodos
        : activeTodos.filter(t => t.category === activeFilter);
  const searchFiltered = searchQuery
    ? categoryFiltered.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : categoryFiltered;
  const filteredTodos =
    sortKey === 'priority'
      ? sortTodosByPriority(searchFiltered, today)
      : sortKey === 'due-date'
        ? [...searchFiltered].sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        : [...searchFiltered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <main data-testid="page-dashboard" className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{todayHeading}</p>
        </div>
        <button
          data-testid="add-todo-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Add Todo
        </button>
      </div>

      <div
        data-testid="priority-mode-banner"
        className={`mb-4 px-4 py-2 rounded-md text-sm font-medium ${
          isWeekendDay
            ? 'bg-purple-50 text-purple-700 border border-purple-200'
            : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}
      >
        {modeLabel}
      </div>

      <div className="mb-3">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <button
            data-testid="filter-all"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === 'all'
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            All
          </button>
          <button
            data-testid="filter-overdue"
            onClick={() => setActiveFilter('overdue')}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === 'overdue'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            Overdue
          </button>
          <button
            data-testid="filter-office"
            onClick={() => setActiveFilter('office')}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === 'office'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            Office
          </button>
          <button
            data-testid="filter-personal"
            onClick={() => setActiveFilter('personal')}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === 'personal'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            Personal
          </button>
          <button
            data-testid="filter-family"
            onClick={() => setActiveFilter('family')}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === 'family'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            Family
          </button>
        </div>
        <SortControl value={sortKey} onChange={setSortKey} />
      </div>

      <TodoList
        todos={filteredTodos}
        onEdit={handleOpenEdit}
        onDelete={deleteTodo}
        onToggleComplete={toggleComplete}
      />

      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {editingTodo ? 'Edit Todo' : 'New Todo'}
        </h2>
        <TodoForm
          key={editingTodo?.id ?? 'new'}
          initialValues={editingTodo ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </Modal>
    </main>
  );
}
