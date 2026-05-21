import { useState } from 'react';
import { format, isWeekend } from 'date-fns';
import { useTodos } from '../context';
import type { Todo } from '../types';
import Modal from '../components/Modal';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import { sortTodosByPriority } from '../utils';

type AddTodoInput = Omit<Todo, 'id' | 'completed' | 'completedAt' | 'createdAt' | 'updatedAt'>;

export default function DashboardPage() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete } = useTodos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

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
  const activeTodos = todos.filter((t) => !t.completed);
  const sortedTodos = sortTodosByPriority(activeTodos, today);

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

      <TodoList
        todos={sortedTodos}
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
