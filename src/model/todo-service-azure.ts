import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";
import { v4 as uuidv4 } from "uuid";
import type { Todo } from "./todo";

export function createTodoService(
  storageAccountName: string,
  storageAccountKey: string
) {
  const tableClient = new TableClient(
    `https://${storageAccountName}.table.core.windows.net`,
    "todos",
    new AzureNamedKeyCredential(storageAccountName, storageAccountKey)
  );
  return {
    async loadTodos(completed: "all" | "active" | "completed") {
      const entities = await tableClient.listEntities<Todo>({
        queryOptions:
          !completed || completed === "all"
            ? undefined
            : {
                filter: `completed eq ${completed == "active" ? false : true}`,
              },
      });
      const result: Todo[] = [];
      for await (const entity of entities) {
        result.push({
          id: entity.rowKey!,
          title: entity.title,
          completed: entity.completed,
        });
      }
      return result;
    },
    async loadItemsLeft() {
      const entities = tableClient.listEntities({
        queryOptions: {
          filter: "completed eq false",
          select: ["RowKey"],
        },
      });
      let count = 0;
      while (!(await entities.next()).done) {
        count++;
      }
      return count;
    },
    async addTodo(title: string) {
      await tableClient.createEntity({
        partitionKey: "todos",
        rowKey: uuidv4(),
        title,
        completed: false,
      });
    },
    async deleteTodo(id: string) {
      tableClient.deleteEntity("todos", id);
    },
    async updateTodo({ id, title }: Todo) {
      tableClient.updateEntity(
        { partitionKey: "todos", rowKey: id, title },
        "Merge"
      );
    },
    async toggleTodo({ id }: Todo) {
      const entity = await tableClient.getEntity<Todo>("todos", id);
      await tableClient.updateEntity(
        {
          partitionKey: "todos",
          rowKey: entity.rowKey!,
          completed: !entity.completed,
        },
        "Merge"
      );
    },
    async toggleAllTodos() {
      const completed = (await this.loadItemsLeft()) >= 0;
      const entities = await tableClient.listEntities<Todo>();
      for await (const entity of entities) {
        entity.completed = completed;
        await tableClient.updateEntity(entity as any, "Replace");
      }
    },
    async clearCompletedTodos() {
      const completed = await this.loadTodos("completed");
      for (const toDelete of completed) {
        await tableClient.deleteEntity("todos", toDelete.id);
      }
    },
  };
}
