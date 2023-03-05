import type { Todo } from "./todo";
import uuidv4 from "./uuidv4";

let todos: Todo[] = [{ id: uuidv4(), title: "Test" }];

export function loadTodos() {
  return todos;
}

export function addTodo(title: string) {
  todos.push({
    id: uuidv4(),
    title,
    createdTimestamp: new Date(),
  });
}

export function deleteTodo(id: string) {
  todos = todos.filter((todo) => todo.id !== id);
}

export function updateTodo({ id, title }: Todo) {
  const foundTodo = todos.find((todo) => todo.id === id);
  if (foundTodo) {
    foundTodo.title = title;
  }
}
