# PROMPT_LOG — 2026-11-09

会话工具：Viber（CLI 编程助手）。本次会话共 3 条有效 prompt，按顺序记录如下。

## 环境说明

- 今天会话开始时，Viber 1.20.7 报 invalid key，无法正常使用；切换到 Viber 1.20.10 之后才能正常对话。本日志中的 3 条 prompt 均在 1.20.10 下完成。

## Prompt 1 — 检查项目页面与路由

> 请检查这个文件夹里的 Next.js 作品集项目，列出它有哪些页面和路由，确认一下有没有首页、About Me、Projects（带动态项目页）、还有联系表单页。

时间：2026-11-09，下午（本条未留下精确时间记录）。

结果：当前工作目录 `Viber/ISBA2438` 是空的，助手在 `~/Desktop/isba2438-a2-portfolio` 找到实际项目（Next.js 15，App Router）。确认四部分齐全：

- `/` 首页（`app/page.js`）
- `/about-me`（`app/about-me/page.js`）
- `/projects` + `/projects/[slug]` 动态项目页（`generateStaticParams` 预构建，未知 slug 走 `not-found.js`）
- `/contact-me-server-form` 联系表单（Server Action 提交）

另有 `layout.js`、`not-found.js`、`NavBar` / `ContactForm` / `ProjectCard` 组件、`data/projects.js`、`server/` 校验与存储、`tests/contact.test.mjs`。

## Prompt 2 — 检查联系表单页

> 请检查联系表单页 /contact-me-server-form，确认一下：表单有没有姓名、邮箱、消息这三个带标签的输入框，是不是用 Server Action 提交，服务端会不会拒绝空姓名、空消息和格式错的邮箱，有没有成功和失败的不同提示，成功后是不是存到 data/contacts.json。

时间：2026-11-09，下午（本条未留下精确时间记录）。

结果：五点全部确认——

1. Name / Email / Message 三个输入框均有 `<label htmlFor>`（`components/ContactForm.js`），带 `aria-invalid` / `aria-describedby`。
2. Server Action 提交：`actions.js` 标 `"use server"`，客户端用 `useActionState` + `<form action={formAction}>`。
3. 服务端校验（`server/validateContact.js`）拒绝空姓名、空消息，邮箱用正则拒绝空值和格式错误（表单 `noValidate` 让服务端校验生效）。
4. 成功显示绿色 "✓ Message sent."（`role="status"`），失败显示红色 "✗ Not sent."（`role="alert"`），字段下方有具体错误文案，失败保留已输入内容。
5. 成功后 `server/contactStore.js` 追加含 `submittedAt` 的记录到 `data/contacts.json`。

运行 `npm test`：5/5 通过（空姓名拒绝、空消息拒绝、邮箱格式拒绝、saveContact 追加等用例）。

## Prompt 3 — 运行构建并检查动态路由

> 请运行 npm run build，确认构建成功，并检查 /projects/[slug] 动态路由：两个项目 smoked-food-cli 和 california-ev-dashboard 是不是用同一个动态路由、显示不同内容，未知 slug 会不会走到 not-found。

时间：2026-11-09，约 18:27–18:30（依据 /tmp 下服务器日志的创建时间）。

结果：

- `npm run build` 编译成功，生成 9 个静态页，其中 `/projects/[slug]` 为 SSG，预渲染 `/projects/smoked-food-cli` 和 `/projects/california-ev-dashboard` 两个路径。
- 首次 `next start` 验证时失败：`Cannot find module './477.js'`。原因是 `.next` 目录混入了 dev 服务器的产物；3000 端口当时被另一个 Next 进程占用（排查过程中执行过 `pkill`，如果那是用户自己开的 dev 服务器需要重启）。`rm -rf .next` 清理重建后恢复正常。
- 用生产服务器（3100 端口）实测：
  - `/projects/smoked-food-cli` → 200，标题 "Northeastern Smoked Food — Deli Queue & Inventory CLI"
  - `/projects/california-ev-dashboard` → 200，标题 "California EV Adoption Dashboard"
  - 两个项目确认共用同一个 `[slug]` 动态路由、渲染各自不同内容。
  - `/projects/does-not-exist` → 404，渲染 "Project not found" + "See all projects"。
