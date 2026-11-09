# Joy (Jianing Zhan) — Portfolio (ISBA 2438 A2 Part 1)

A Next.js (App Router) portfolio site with a server-side contact form.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

Run the form logic tests:

```bash
npm test
```

## Pages

| Route | What it shows |
|---|---|
| `/` | Landing page |
| `/about-me` | About Me |
| `/projects` | List of projects |
| `/projects/[slug]` | Project detail, rendered from `data/projects.js` (`smoked-food-cli`, `california-ev-dashboard`). Unknown slugs show a "Project not found" page. |
| `/contact-me-server-form` | Contact form handled on the server |

## Folder layout

```
app/                         pages (App Router)
  contact-me-server-form/
    page.js                  the form page
    actions.js               server action ("use server") that receives the form
  projects/[slug]/
    page.js                  dynamic project page
    not-found.js             friendly page for unknown slugs
components/                  reusable UI (NavBar, ProjectCard, ContactForm)
data/
  projects.js                project data, one entry per slug
  contacts.json              saved contact submissions
server/                      server-only logic
  validateContact.js         validation rules
  contactStore.js            writes submissions to data/contacts.json
tests/                       node:test tests for validation + storage
```

## How the contact form works (form → server → JSON)

1. The user fills in Name, Email, Message in `components/ContactForm.js` and clicks **Send message**.
2. The form's `action` is the server action `submitContact` in `app/contact-me-server-form/actions.js`, so the data is sent to the server, not handled in the browser. The form uses `noValidate` so the browser does not block bad input — the server decides.
3. On the server, `server/validateContact.js` trims the values and rejects an empty name, an empty message, or an invalid email format.
4. If invalid, the action returns `status: "error"` with a message per field. The page shows a red **✗ Not sent** banner and red text under each bad field, and keeps what the user typed.
5. If valid, `server/contactStore.js` appends `{ name, email, message, submittedAt }` to `data/contacts.json`, and the page shows a green **✓ Message sent** banner and clears the form.

Note: saving to a local JSON file works when running the site locally (`npm run dev` / `npm start`). It is not meant for serverless hosting.
