import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  Form,
  globalAction$,
  routeLoader$,
  z,
  zod$,
} from "@builder.io/qwik-city";
import TodoItem from "~/components/todo-item/todo-item";
import type { Todo } from "~/model/todo";
import { addTodo, loadTodos } from "~/model/todo-service";

export const useTodos = routeLoader$(() => {
  return loadTodos();
});

export const useAddTodo = globalAction$(
  (todo: Partial<Todo>) => {
    addTodo(todo.title!);
    return {
      success: true,
    };
  },
  zod$({
    title: z.string().min(1),
  })
);

export default component$(() => {
  const todos = useTodos();
  const addTodoAction = useAddTodo();
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
          />
        </Form>
      </header>
      <section class="main">
        <form
          action="/todos/toggle-all"
          method="POST"
          hx-post="/todos/toggle-all"
          hx-select="#todo-list"
          hx-target="#todo-list"
          hx-swap="outerHTML"
        >
          <button type="submit" id="toggle-all" class="toggle-all"></button>
          <label for="toggle-all">Mark all as complete</label>
        </form>
        <ul class="todo-list" id="todo-list">
          {todos.value.map((todo) => (
            <TodoItem key={todo.id} todo={todo}></TodoItem>
          ))}
        </ul>
      </section>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
