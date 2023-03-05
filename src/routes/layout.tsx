import { component$, Slot } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <main>
        <section class="todoapp">
          <Slot />
        </section>
      </main>
      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>
          Template by <a href="http://sindresorhus.com">Sindre Sorhus</a>
        </p>
        <p>
          Created by <a href="https://derkoe.dev">derkoe</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
});

export const head: DocumentHead = {
  links: [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/todomvc-app-css@2.3.0/index.css",
    },
  ],
};
