# Joy (Jianing Zhan) — Portfolio (ISBA 2438 A2)

Personal portfolio site built with Next.js (App Router), developed in two parts:
Part 1 is the portfolio with a server-side contact form, and Part 2 is the deli
pre-order queue described below.

## 1. Project overview

This is my personal portfolio site, built with Next.js App Router. The new
feature is a deli pre-order queue: customers browse today's menu, pick items
with estimated weights, and get a queue ticket saved in the browser. Staff
manage the menu from an admin page.

## 2. Features

- **Deli page (`/deli`)** — shows only items marked available today; pick items
  and quantities (`lb` items in 0.25 lb steps, `ea` items in whole numbers);
  estimated total; queue ticket number like `A-001`.
- **Queue ticket in LocalStorage** — saved under the keys `deli_queue_ticket`
  and `deli_queue_counter`, survives a refresh, and empty or corrupted data is
  safely ignored instead of crashing the page.
- **Admin home (`/admin`)** — links to the menu, projects, blogs, and contacts
  admin pages, each with create / edit / delete.
- **Server request logging** — every API call prints `METHOD /path STATUS` in
  the terminal.

## 3. API endpoints

All endpoints accept and return JSON. Status codes verified against the route
handlers: creates return `201`, GET/PUT/DELETE on an existing record return
`200`, unknown ids and slugs return `404`, invalid JSON or failed validation
returns `400` with a message per field, and a failed save returns `500`.

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | `/api/menu` | All menu items | 200 |
| POST | `/api/menu` | Create item (id auto-assigned) | 201 |
| GET | `/api/menu/[id]` | One menu item | 200 |
| PUT | `/api/menu/[id]` | Update item, partial (includes the availability toggle) | 200 |
| DELETE | `/api/menu/[id]` | Delete item | 200 |
| GET | `/api/projects` | All projects | 200 |
| POST | `/api/projects` | Create project (unique slug generated from title) | 201 |
| GET | `/api/projects/[slug]` | One project | 200 |
| PUT | `/api/projects/[slug]` | Update project (slug stays fixed) | 200 |
| DELETE | `/api/projects/[slug]` | Delete project | 200 |
| GET | `/api/blogs` | All posts, newest first | 200 |
| POST | `/api/blogs` | Create post (unique slug generated from title) | 201 |
| GET | `/api/blogs/[slug]` | One post | 200 |
| PUT | `/api/blogs/[slug]` | Update title and content (slug stays fixed) | 200 |
| DELETE | `/api/blogs/[slug]` | Delete post | 200 |
| GET | `/api/contact` | All submissions, newest first | 200 |
| POST | `/api/contact` | Save a submission (both contact forms use this store) | 201 |
| GET | `/api/contact/[id]` | One submission | 200 |
| PUT | `/api/contact/[id]` | Update name, email, message | 200 |
| DELETE | `/api/contact/[id]` | Delete submission | 200 |

## 4. Data flow

For menu, projects, and blogs: a JSON file in `data/` is read and written by a
store module in `server/` (e.g. `server/menuStore.js`), which the route
handlers in `app/api/` call. Client components then fetch from the API and pass
the data down as props into the card components — `MenuItemCard`, `BlogCard`,
`ProjectCard`, and `QueueTicket` are all reusable and receive their data via
props. (`/projects` skips the fetch: the page itself reads the store on the
server and passes projects to `ProjectCard`.)

For the queue ticket: `QueueTicket` saves and reads through
`lib/ticketStorage.js`, which owns all LocalStorage access (ticket +
incrementing queue counter) and validates the stored format before use.

## 5. How to run

```bash
npm install       # install dependencies
npm run dev       # develop at http://localhost:3000
npm test          # run the test suites
npm run build     # production build
```

The data stores are local JSON files, which works when running the site
locally (`npm run dev` / `npm start`). It is not meant for serverless hosting.

## Part 1: how the contact form works

1. The user fills in Name, Email, Message in `components/ContactForm.js` and clicks **Send message**.
2. The form's `action` is the server action `submitContact` in `app/contact-me-server-form/actions.js`, so the data is sent to the server, not handled in the browser. The form uses `noValidate` so the browser does not block bad input — the server decides.
3. On the server, `server/validateContact.js` trims the values and rejects an empty name, an empty message, or an invalid email format.
4. If invalid, the action returns `status: "error"` with a message per field. The page shows a red **✗ Not sent** banner and red text under each bad field, and keeps what the user typed.
5. If valid, `server/contactStore.js` appends `{ id, name, email, message, submittedAt }` to `data/contacts.json`, and the page shows a green **✓ Message sent** banner and clears the form.

`/contact-me` uses the same validator and store through the `/api/contact`
route handler instead of a server action.

## 6. Real-world inspiration

> The deli menu is inspired by 熏匠 1962, a local smoked-meat deli in the South
> Bay. This project is not affiliated with or endorsed by the shop. Item names
> and listed prices were taken from a menu photo dated Oct 30, 2026 and may
> change. Stock levels and weights are simulated for demo purposes. The app
> does not take payment, arrange delivery, or send messages. The shop's
> Xiaohongshu page: https://xhslink.cn/o/4v7geP5KJZR

## 7. Known limitations

- Ticket numbers are counted per browser (LocalStorage), so two customers on
  different devices could both get A-001. A shared queue would need a database,
  which is planned for the final project.
- Weights are estimates; the real price is set at the scale.
- JSON files are fine for a class demo but are not safe for many users writing
  at the same time.
