# Todo App in Qwik

This is a demo application showing the use of [Qwik](https://htmx.org/) in a simple todo app.

There are three backends available:

- a mocked backend for local development
- Azure Tables backend
- Cloudflare D1 (SQLite) backend

The app is deployed to Azure and Cloudflare:

- Azure Static Web Apps with Azure Tables: https://ashy-coast-09da7ba03.2.azurestaticapps.net/
- Cloudflare Pages with Cloudflare D1: https://qwik-todos.pages.dev/
- Deno Deploy: https://qwik-todos.deno.dev/

There are also versions built with other technologies for comparison:

- [htmx](https://htmx.org/) with [Quarkus](https://quarkus.dev) backend: https://github.com/derkoe/quarkus-htmx-todos
- [Hotwire](https://hotwire.dev/) with [Quarkus](https://quarkus.dev) backend: https://github.com/derkoe/quarkus-hotwire-todos
- [Remix](https://remix.run/): https://github.com/derkoe/remix-todos
- [Phonix](https://www.phoenixframework.org/) with LiveView: https://github.com/derkoe/phoenix-todos
