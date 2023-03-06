import { mockTodoService } from "./todo-service-mock";
import { createTodoService as createD1TodoService } from "./todo-service-d1";

declare interface EnvGetter {
  get(key: string): string | undefined;
}

export function getTodoService(env: EnvGetter) {
  const todoDatabase: D1Database | undefined = env.get("TODO_DB") as any;
  if (todoDatabase && typeof todoDatabase.prepare === "function") {
    return createD1TodoService(todoDatabase);
  } else {
    return mockTodoService;
  }
}
