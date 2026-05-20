import type { Todo } from '../types';
import TodoCard from './TodoCard';

interface TodoListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export default function TodoList({ todos, onEdit, onDelete, onToggleComplete }: TodoListProps) {
  return (
    <div data-testid="todo-list" className="flex flex-col gap-3">
      {todos.length === 0 ? (
        <p data-testid="todo-list-empty" className="text-gray-500 text-sm py-8 text-center">
          No active todos. Click &ldquo;+ Add Todo&rdquo; to get started.
        </p>
      ) : (
        todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        ))
      )}
    </div>
  );
}
