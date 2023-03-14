import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  Form,
  globalAction$,
  Link,
  routeLoader$,
  z,
  zod$,
} from "@builder.io/qwik-city";
import TodoItem from "~/components/todo-item/todo-item";
import type { Todo } from "~/model/todo";
import { getTodoService } from "~/model/todo-service";

export const useTodos = routeLoader$(async ({ query, env }) => {
  const qf = query.get("f");
  return (await getTodoService(env)).loadTodos(qf as any);
});

export const useItemsLeft = routeLoader$(async ({ env }) => {
  return (await getTodoService(env)).loadItemsLeft();
});

export const useAddTodo = globalAction$(
  async (todo: Partial<Todo>, { env }) => {
    (await getTodoService(env)).addTodo(todo.title!);
    return {
      success: true,
    };
  },
  zod$({
    title: z.string().min(1),
  })
);

export const useToggleAll = globalAction$(async (_, { env }) =>
  (await getTodoService(env)).toggleAllTodos()
);

export const useClearCompletedTodos = globalAction$(async (_, { env }) =>
  (await getTodoService(env)).clearCompletedTodos()
);

export default component$(() => {
  const todos = useTodos();
  const itemsLeft = useItemsLeft();
  const addTodoAction = useAddTodo();
  const toggleAll = useToggleAll();
  const filter = useSignal();
  const clearCompletedTodos = useClearCompletedTodos();
  const newTodoField = useSignal<HTMLInputElement>();

  // clear new todo input after submit
  useTask$(({ track }) => {
    track(() => addTodoAction.isRunning);
    if (newTodoField.value) {
      newTodoField.value.value = "";
    }
  });

  return (
    <>
      {addTodoAction.value?.fieldErrors?.title && (
        <div>{addTodoAction.value.fieldErrors.title}</div>
      )}
      <header class="header">
        <h1>todos</h1>
        <Form action={addTodoAction}>
          <input
            class="new-todo"
            name="title"
            placeholder="What needs to be done?"
            autoFocus
            ref={newTodoField}
          />
        </Form>
      </header>
      <section class="main">
        <Form action={toggleAll}>
          <button type="submit" id="toggle-all" class="toggle-all"></button>
          <label for="toggle-all">Mark all as complete</label>
        </Form>
        <ul class="todo-list" id="todo-list">
          {todos.value.map((todo) => (
            <TodoItem key={todo.id} todo={todo}></TodoItem>
          ))}
        </ul>
      </section>
      {todos.value && (
        <footer class="footer">
          <span class="todo-count">
            <strong>{itemsLeft.value}</strong>{" "}
            {" item" +
              (itemsLeft.value > 1 || itemsLeft.value === 0 ? "s " : " ")}
            left
          </span>
          <ul class="filters">
            <li>
              <Link class={{ selected: filter.value === "all" }} href="/">
                All
              </Link>
            </li>
            <li>
              <Link
                class={{ selected: filter.value === "active" }}
                href="/?f=active"
              >
                Active
              </Link>
            </li>
            <li>
              <Link
                class={{ selected: filter.value === "completed" }}
                href="/?f=completed"
              >
                Completed
              </Link>
            </li>
          </ul>
          {todos.value.some((t) => t.completed) && (
            <Form action={clearCompletedTodos}>
              <button class="clear-completed" type="submit">
                Clear completed
              </button>
            </Form>
          )}
        </footer>
      )}
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const todos = resolveValue(useTodos);
  return {
    title: `Qwik Todos (${todos.filter((todo) => !todo.completed).length})`,
    meta: [
      {
        name: "description",
        content: "A simple Todo app in Qwik.",
      },
    ],
  };
};
