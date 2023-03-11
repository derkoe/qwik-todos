import type { Todo } from "./todo";
import { v4 as uuidv4 } from "uuid";

let todos: Todo[] = [];

export const mockTodoService = {
  loadTodos(completed: "all" | "active" | "completed") {
    if (completed === "active") {
      return todos.filter((todo) => !todo.completed);
    }
    if (completed === "completed") {
      return todos.filter((todo) => todo.completed);
    }
    return todos;
  },
  loadItemsLeft() {
    return todos.filter((todo) => !todo.completed).length;
  },
  addTodo(title: string) {
    const newTodo = {
      id: uuidv4(),
      title,
      createdTimestamp: new Date(),
    };
    todos.push(newTodo);
    return newTodo;
  },
  deleteTodo(id: string) {
    todos = todos.filter((todo) => todo.id !== id);
  },
  updateTodo({ id, title }: Todo) {
    const foundTodo = todos.find((todo) => todo.id === id);
    if (foundTodo) {
      foundTodo.title = title;
    }
  },
  toggleTodo({ id }: Todo) {
    const foundTodo = todos.find((todo) => todo.id === id);
    if (foundTodo) {
      foundTodo.completed = !foundTodo.completed;
    }
  },
  toggleAllTodos() {
    const completed = todos.findIndex((todo) => !todo.completed) >= 0;
    todos.forEach((todo) => (todo.completed = completed));
  },
  clearCompletedTodos() {
    todos = todos.filter((todo) => !todo.completed);
  },
};
