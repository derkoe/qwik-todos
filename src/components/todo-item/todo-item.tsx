import type { QwikKeyboardEvent } from "@builder.io/qwik";
import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Form, globalAction$, z, zod$ } from "@builder.io/qwik-city";
import type { Todo } from "~/model/todo";
import { getTodoService } from "~/model/todo-service";

export interface TodoItemProps {
  todo: Todo;
}

export const useDeleteTodo = globalAction$(
  async (todo: Partial<Todo>, { env }) =>
    (await getTodoService(env)).deleteTodo(todo.id!),
  zod$({ id: z.string().uuid() })
);

export const useEditTodo = globalAction$(
  async (todo: Todo, { env }) => (await getTodoService(env)).updateTodo(todo),
  zod$({
    id: z.string().uuid(),
    title: z.string().min(1),
  })
);

export const useToggleTodo = globalAction$(
  async (todo: Partial<Todo>, { env }) =>
    (await getTodoService(env)).toggleTodo(todo as Todo),
  zod$({ id: z.string().uuid() })
);

export default component$(({ todo }: TodoItemProps) => {
  const deleteAction = useDeleteTodo();
  const editAction = useEditTodo();
  const toggleAction = useToggleTodo();
  const editing = useSignal(false);

  const editField = useSignal<HTMLInputElement>();
  const ESCAPE_KEY = 27;
  const ENTER_KEY = 13;

  const handleEditInput = $((event: QwikKeyboardEvent) => {
    if (event.keyCode === ESCAPE_KEY) {
      editing.value = false;
    } else if (event.keyCode === ENTER_KEY) {
      editing.value = false;
    }
  });

  useTask$(({ track }) => {
    const el = track(() => editField.value);
    if (el) {
      el.focus();
      el.selectionStart = el.value.length;
    }
  });

  return (
    <li
      class={`${todo.completed ? "completed" : ""} ${
        editing.value ? "editing" : ""
      }`}
      onDblClick$={() => (editing.value = true)}
    >
      <div class="view">
        <input
          class="toggle"
          type="checkbox"
          checked={todo?.completed}
          onClick$={async () => await toggleAction.run(todo)}
        />
        <label>{todo.title}</label>
        <Form action={deleteAction}>
          <input type="hidden" name="id" value={todo.id} />
          <button type="submit" class="destroy"></button>
        </Form>
      </div>
      {editing.value && (
        <Form action={editAction}>
          <input type="hidden" name="id" value={todo.id} />
          <input
            class="edit"
            name="title"
            value={todo.title}
            ref={editField}
            onKeyUp$={handleEditInput}
            onBlur$={() => (editing.value = false)}
          />
        </Form>
      )}
    </li>
  );
});
