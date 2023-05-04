import { createTodoService as createD1TodoService } from "./todo-service-d1";
import { mockTodoService } from "./todo-service-mock";

declare interface EnvGetter {
  get(key: string): string | undefined;
}

export async function getTodoService(env: EnvGetter) {
  const todoDatabase: D1Database | undefined = env.get("TODO_DB") as any;
  if (todoDatabase && typeof todoDatabase.prepare === "function") {
    return createD1TodoService(todoDatabase);
  } else if (
    env.get("STORAGE_ACCOUNT_NAME") &&
    env.get("STORAGE_ACCOUNT_KEY")
  ) {
    const storageAccountName = env.get("STORAGE_ACCOUNT_NAME")!;
    const storageAccountKey = env.get("STORAGE_ACCOUNT_KEY")!;
    return (await import("./todo-service-azure")).createTodoService(
      storageAccountName,
      storageAccountKey
    );
  } else {
    return mockTodoService;
  }
}
