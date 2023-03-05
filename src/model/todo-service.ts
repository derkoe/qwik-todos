import type { Todo } from "./todo";
import uuidv4 from "./uuidv4";

let todos: Todo[] = [{ id: uuidv4(), title: "Test" }];

export function loadTodos(completed: "all" | "active" | "completed") {
  if (completed === "active") {
    return todos.filter((todo) => !todo.completed);
  }
  if (completed === "completed") {
    return todos.filter((todo) => todo.completed);
  }
  return todos;
}

export function loadItemsLeft() {
  return todos.filter((todo) => !todo.completed).length;
}

export function addTodo(title: string) {
  const newTodo = {
    id: uuidv4(),
    title,
    createdTimestamp: new Date(),
  };
  todos.push(newTodo);
  return newTodo;
}

export function deleteTodo(id: string) {
  todos = todos.filter((todo) => todo.id !== id);
}

export function updateTodo({ id, title }: Todo) {
  const foundTodo = todos.find((todo) => todo.id === id);
  if (foundTodo) {
    foundTodo.title = title;
  }
  return foundTodo;
}

export function toggleTodo({ id }: Todo) {
  const foundTodo = todos.find((todo) => todo.id === id);
  if (foundTodo) {
    foundTodo.completed = !foundTodo.completed;
  }
  return foundTodo;
}

export function toggleAllTodos() {
  const completed = todos.findIndex((todo) => !todo.completed) >= 0;
  todos.forEach((todo) => (todo.completed = completed));
}

export function clearCompletedTodos() {
  todos = todos.filter((todo) => !todo.completed);
}