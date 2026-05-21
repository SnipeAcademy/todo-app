import { useState } from 'react';
import { format } from 'date-fns';
import type { Todo } from '../types';
import { useTodos } from '../context';
import { sortTodosByPriority } from '../utils';
import Modal from './Modal';
import TodoCard from './TodoCard';
import TodoForm from './TodoForm';

type AddTodoInput = Omit<Todo, 'id' | 'completed' | 'completedAt' | 'createdAt' | 'updatedAt'>;

interface DayPanelProps {
  date: Date;
  todos: Todo[];
  onClose: () => void;
}

export default function DayPanel({ date, todos, onClose }: DayPanelProps) {
  const { addTodo, updateTodo, deleteTodo, toggleComplete } = useTodos();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const dateStr = format(date, 'yyyy-MM-dd');
  const sortedTodos = sortTodosByPriority(todos, date);

  function handleAdd(values: AddTodoInput) {
    addTodo(values);
    setShowAddModal(false);
  }

  function handleEditSubmit(values: AddTodoInput) {
    if (!editingTodo) return;
    updateTodo({ ...editingTodo, ...values });
    setEditingTodo(null);
  }

  return (
    <div
      data-testid="day-panel"
      className="w-80 shrink-0 bg-white border border-gray-200 rounded-lg flex flex-col min-h-0"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span data-testid="day-panel-date" className="font-semibold text-gray-900">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </span>
        <button
          data-testid="day-panel-close"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
        {sortedTodos.length === 0 ? (
          <p className="text-sm text-gray-500">No todos for this day.</p>
        ) : (
          sortedTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onEdit={(t) => setEditingTodo(t)}
              onDelete={deleteTodo}
              onToggleComplete={toggleComplete}
            />
          ))
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-200">
        <button
          data-testid="day-panel-add-btn"
          onClick={() => setShowAddModal(true)}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Add Todo
        </button>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Todo</h2>
        <TodoForm
          initialValues={{ workOnDate: dateStr }}
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal isOpen={editingTodo !== null} onClose={() => setEditingTodo(null)}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Todo</h2>
        {editingTodo && (
          <TodoForm
            initialValues={editingTodo}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingTodo(null)}
          />
        )}
      </Modal>
    </div>
  );
}
