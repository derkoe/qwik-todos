import type { Todo } from "./todo";
import { v4 as uuidv4 } from "uuid";

interface TodoRecord {
  id: string;
  title: string;
  completed: number;
}

const loadTodosQueries = {
  all: "SELECT id, title, completed FROM todos",
  active: "SELECT id, title, completed FROM todos WHERE completed <> 1",
  completed: "SELECT id, title, completed FROM todos WHERE completed = 1",
};

export const createTodoService = (db: D1Database) => ({
  async loadTodos(completed: "all" | "active" | "completed") {
    const query = loadTodosQueries[completed] || loadTodosQueries["all"];
    const result = await db.prepare(query).all<TodoRecord>();

    const todos: Todo[] = result.results
      ? result.results.map((record) => ({
          id: record.id,
          title: record.title,
          completed: record.completed === 1,
        }))
      : [];
    return todos;
  },
  async loadItemsLeft() {
    const result = await db
      .prepare("SELECT COUNT(*) as itemsleft FROM todos WHERE completed <> 1")
      .first<{ itemsleft: number }>();
    return result.itemsleft;
  },
  async addTodo(title: string) {
    const newTodo = { id: uuidv4(), title, completed: false };
    await db
      .prepare("INSERT INTO todos (id, title) VALUES (?, ?)")
      .bind(newTodo.id, newTodo.title)
      .run();
    return newTodo;
  },
  async deleteTodo(id: string) {
    await db.prepare("DELETE FROM todos WHERE id = ?").bind(id).run();
  },
  async updateTodo({ id, title }: Todo) {
    await db
      .prepare("UPDATE todos SET title = ? WHERE id = ?")
      .bind(title, id)
      .run();
  },
  async toggleTodo({ id }: Todo) {
    await db
      .prepare(
        "UPDATE todos SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END WHERE id = ?"
      )
      .bind(id)
      .run();
  },
  async toggleAllTodos() {
    const completed = (await this.loadItemsLeft()) >= 0;
    await db.prepare("UPDATE todos SET completed = ?").bind(completed).run();
  },
  async clearCompletedTodos() {
    await db.exec("DELETE FROM todos WHERE completed = 1");
  },
});
