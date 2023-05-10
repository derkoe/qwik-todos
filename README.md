# Todo App in Qwik

This is a demo application showing the use of [Qwik](https://htmx.org/) in a simple todo app.

There are three backends available:

- a mocked backend for local development
- Azure Tables backend
- Cloudflare D1 (SQLite) backend

The app is deployed to Azure and Cloudflare:

- Azure Static Web Apps with Azure Tables: https://qwik-todos-azure.the-edge.xyz/
- Cloudflare Pages with Cloudflare D1: https://qwik-todos-cloudflare.the-edge.xyz/

There are also different versions for comparison:

- [Remix](https://remix.run/): https://github.com/derkoe/remix-todos
- [htmx](https://htmx.org/) with [Quarkus](https://quarkus.dev) backend: https://github.com/derkoe/quarkus-hotwire-todos
- [Hotwire](https://hotwire.dev/) with [Quarkus](https://quarkus.dev) backend: https://github.com/derkoe/quarkus-hotwire-todos
