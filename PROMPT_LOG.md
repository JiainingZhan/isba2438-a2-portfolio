# Prompt Log — ISBA 2438 A2 Part 1

> Entries 1–2 record what actually happened on 2026-11-09.

## 1. Viber setup failed — invalid key

- **My prompt:** Prompt 1 (scaffold the Next.js site with `/`, `/about-me`, `/projects`, `/projects/[slug]`, `/contact-me-server-form`), and later a plain `hi` to test the connection.
- **What Viber did:** Both times it returned "This HackerCode AI key is invalid. Check the key or create a new one." No code was generated.
- **My decision + why:** I got a key from VibeCoach (Account → AI access) and looked for a place to enter it. Settings → Providers only showed "Viber AI" with a Disconnect button. After I disconnected and restarted the app, there was no way to reconnect or enter a key. I reported it to the instructor / VibeCoach ("I'm stuck") rather than keep guessing. I emailed Prof. Adam Chan on 2026-11-09 at 12:09 PT from jzhan@scu.edu, subject "ISBA 2438 Assignment 2 Part 1 — Viber is not working for me", saying Viber was installed but would not connect and asking if I could use another coding agent for Part 1 or another way to complete the Viber prompt part. No reply yet as of 2026-11-09 13:08 PT.
- **Files / commit:** none (no code produced).
- **Check + result:** Sent `hi` after the change and still got the invalid-key error. Restarting Viber didn't help either.

## 2. Switched to Claude to build the site

- **My prompt:** "不采用viber了，你直接按要求做吧" (Drop Viber, build it to the requirements directly.) The requirements were my own Prompts 1–5.
- **What the AI proposed:** A Next.js App Router project. Project data lives in `data/projects.js` with one entry per slug. Unknown slugs call `notFound()`, which shows a friendly page. The contact form posts to a server action. Validation is in `server/validateContact.js` and saving to `data/contacts.json` is in `server/contactStore.js`. Success and error states are separate green and red banners.
- **My decision + why:** I accepted this because Viber was blocked and the deadline was that night. After reviewing, I changed data/projects.js: removed the AI agent / Gemini wording. The summary now says the deli CLI manages products, stock, and the customer queue, with JSON storage; the stack is Python and JSON storage; I removed the AI agent detail line.
- **Files / commit:** whole project. 903826ddfd401d7167f306b77a3afd1c67c13075
- **Check + result:** The AI ran `npm test` (5 tests pass: empty name, empty message and bad emails are rejected, and valid entries are appended with `submittedAt`). It also rendered each page and checked that both slugs show different content and that `/projects/does-not-exist` shows the not-found page. On my Mac after npm run dev, I opened localhost:3000 and checked /, /about-me, /projects, /projects/smoked-food-cli, /projects/california-ev-dashboard, and /projects/does-not-exist (not-found page). A valid contact submission (Jianing Zhan / jzhan@scu.edu) appeared in data/contacts.json with submittedAt 2026-11-09T21:06:10.561Z.

## 3. Server-side validation vs. browser validation

- **What the AI proposed:** Put `noValidate` on the form so the browser's built-in email check doesn't stop the submission. Then the server's validation and error messages are what the user actually sees.
- **My decision + why:** Keep it, because otherwise the browser built-in email check would stop an invalid email before it reaches the server, and the server validation and error messages would not be shown.
- **Files / commit:** `components/ContactForm.js`. 903826ddfd401d7167f306b77a3afd1c67c13075
- **Check + result:** Invalid submission (empty name, joy@, empty message) showed red "✗ Not sent" with: "Please enter your name." / "Please enter a valid email address, like name@example.com." / "Please enter a message." A valid submission showed green "✓ Message sent" and cleared the form.
