import { useState } from 'react';
import { format } from 'date-fns';
import { useTodos } from '../context';
import type { Todo } from '../types';
import Modal from '../components/Modal';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

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

  const todayHeading = format(new Date(), 'EEEE, MMMM d, yyyy');

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

      <TodoList
        todos={todos}
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
