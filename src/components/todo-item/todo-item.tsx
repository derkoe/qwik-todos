import { component$ } from "@builder.io/qwik";
import { Form, globalAction$, z, zod$ } from "@builder.io/qwik-city";
import type { Todo } from "~/model/todo";
import { deleteTodo, updateTodo } from "~/model/todo-service";

export interface TodoItemProps {
  todo: Todo;
}

export const useDeleteTodo = globalAction$(
  (todo: Partial<Todo>) => {
    deleteTodo(todo.id!);
    return {
      success: true,
    };
  },
  zod$({
    id: z.string().uuid(),
  })
);
export const useEditTodo = globalAction$(
  (todo: Todo) => {
    updateTodo(todo);
  },
  zod$({
    id: z.string().uuid(),
    title: z.string().min(1),
  })
);

export default component$(({ todo }: TodoItemProps) => {
  const deleteAction = useDeleteTodo();
  const editAction = useEditTodo();
  return (
    <li id={`item-${todo.id}`}>
      <div class="view">
        <form action="/todos/{todo.id}/toggle" method="POST"></form>
        <input
          class="toggle"
          type="checkbox"
          onClick$={() => console.log("x")}
        />
        <label>{todo.title}</label>
        <Form action={deleteAction}>
          <input type="hidden" name="id" value={todo.id} />
          <button type="submit" class="destroy"></button>
        </Form>
      </div>
      <Form action={editAction}>
        <input type="hidden" name="id" value={todo.id} />
        <input class="edit" name="title" value="{todo.title}" />
      </Form>
    </li>
  );
});
