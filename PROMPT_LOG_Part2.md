# PROMPT_LOG — Part 2（2026-11-10）

会话工具：Viber（viber-1）。以下按顺序记录 Part 2 的主要 prompt、结果和对应 commit。

## 环境说明

- 第 1 条 prompt 第一次发送时，Viber 返回 "HackerCode AI is temporarily unavailable"，稍后重发成功。
- 路径选择：作业说明里 contact API 同时出现 `/api/contacts` 和 `/api/contact` 两种写法，我选了 `/api/contact`（POST 要求那一句用的是这个）；博客列表页用 `/blogs`。

## Prompt 1 — 修复邮箱校验漏洞

> 我的项目是 Next.js App Router。server/validateContact.js 里的邮箱正则有漏洞：joy@.example.com、joy@example..com、joy@example.com. 这三个域名里有空段的地址都会被放行。请改成逐条检查：只能有一个 @，@ 前面不为空，@ 后面按点拆开，每一段都不为空，而且至少有两段，地址里也不能有空格。另外在 tests/contact.test.mjs 里给这三个地址各加一个应该被拒绝的测试，然后跑 npm test 给我看结果。

结果：`server/validateContact.js` 用 `isValidEmail()` 逐条检查替换了原正则；新增 3 个拒绝测试。`npm test` 8/8 通过。Viber 解释了原正则的问题：`[^\s@]` 本身能匹配点号，所以 `.example` 被当成一段放行。

Commit：`c9aef10`

## Prompt 2 — 新建 POST /api/contact

> 接下来请新建 app/api/contact/route.js，处理 POST 请求……直接复用 server/validateContact.js 和 server/contactStore.js……验证通过返回 201……验证失败返回 400……非 JSON 返回 400；保存出错返回 500。写完后请启动 dev server，用 curl 分别测……

结果：新建 `app/api/contact/route.js`，复用已有的验证和存储函数，两种表单共用同一套规则和同一个 `data/contacts.json`。curl 实测：有效提交 → 201；全部字段无效 → 400（`joy@.example.com` 也被拒绝）；非 JSON → 400。Viber 测试前备份了 `contacts.json`，测完还原。另外它额外处理了"请求体是 JSON 但不是对象"的情况（返回 400）。

注意：Viber 测试结束时执行了 `pkill -f "next dev"`，会一并关掉我自己开的 dev server。

Commit：`c9aef10`

## Prompt 3 — 新建 /contact-me 页面

> 请新建 /contact-me 页面（app/contact-me/page.js）。表单单独写成一个 client component……用 fetch POST 到 /api/contact……201 显示成功并清空表单；400 在对应字段下面显示错误……500 或网络失败显示"发送失败，请重试"……提交过程中按钮要禁用……在 NavBar.js 里加上 /contact-me 的链接。

结果：新建 `app/contact-me/page.js` 和 `components/ApiContactForm.js`，修改 `components/NavBar.js`。三种状态分别显示：成功（绿色）、验证错误（红色 + 字段错误）、发送失败（单独提示）。Viber 用 curl 确认 `/contact-me` 和 `/contact-me-server-form` 都返回 200。

Commit：`c9aef10`

## Prompt 4 — 抽取重复的 FieldError 组件

> 我检查代码时发现 FieldError 组件在 components/ContactForm.js 和 components/ApiContactForm.js 里各定义了一次，内容完全一样。请把它抽成 components/FieldError.js，让两个表单都从这里 import，其他逻辑不要改。改完跑 npm test，再启动 dev server，确认 /contact-me 和 /contact-me-server-form 两个页面都还能打开。

结果：新建 `components/FieldError.js`，两个表单改为 import。`npm test` 8/8 通过，两个页面都返回 200 且三个 label 都渲染。

Commit：`c093baa`

## Prompt 5 — 博客数据与 API

> 接下来做博客功能。请参照 contact 的结构：新建 server/blogStore.js（读写 data/blogs.json）和 server/validateBlog.js……在 data/blogs.json 里先放两篇示例博客……新建 app/api/blogs/route.js：GET 返回所有博客，按时间从新到旧；POST……根据 title 自动生成 slug（如果重名就加数字后缀）……再给 validateBlog 和 slug 生成在 tests/ 里加测试……

结果：新建 `server/blogStore.js`、`server/validateBlog.js`、`server/slug.js`、`app/api/blogs/route.js`、`tests/blog.test.mjs`、`data/blogs.json`（两篇示例：`hello-world`、`why-i-love-sql`）；`package.json` 的 test 脚本改为 `node --test tests/`。`npm test` 16/16 通过。curl 实测：GET → 200，两篇按新到旧排序；用重名标题 "Why I Love SQL" POST → 201，自动生成 `why-i-love-sql-2`；title 为空 → 400。测试后 `blogs.json` 已还原。

Commit：`5186275`

## Prompt 6 — 博客页面（/admin/blogs、/blogs、/blogs/[slug]）

> 最后做博客的三个页面。第一，/admin/blogs：写一个 client component 表单（title 和 content）……POST 到 /api/blogs，字段错误复用 components/FieldError.js……第二，/blogs：用 fetch 调用 GET /api/blogs 列出所有博客……第三，/blogs/[slug]：动态路由显示单篇博客，slug 不存在时用 notFound() 和一个 not-found.js，做法参照 app/projects/[slug]。最后在 NavBar.js 加上 Blogs 的链接……

结果：新建 `app/admin/blogs/page.js`、`components/BlogForm.js`、`app/blogs/page.js`、`components/BlogList.js`、`app/blogs/[slug]/page.js`、`app/blogs/[slug]/not-found.js`，修改 `components/NavBar.js`。`BlogForm` 复用 `FieldError`，成功时显示 "✓ Published." 和新博客链接；`BlogList` 有加载中、加载失败、空列表三种状态。`/blogs/[slug]` 直接读 `blogStore`，所以通过 API 新建的博客不用重启就能访问。Viber 实测：`/blogs/hello-world` 和 `/blogs/why-i-love-sql` 都返回 200 且内容不同；`/blogs/does-not-exist` → 404，显示 "Blog post not found"；通过 API 新建 "Runtime Check" 后，`/blogs/runtime-check` 返回 200；`/blogs`、`/admin/blogs` 都返回 200。测试后 `blogs.json` 已还原。

Commit：`9ef91f2`

---

# Critique：Agent 生成代码的审查

## 例子 1：邮箱校验会放行域名中有空段的地址

- 文件 / commit：`server/validateContact.js`，`c9aef10`
- Agent 原来的方案：Part 1 时 agent 生成的正则 `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`。
- 我的决定：不接受原正则，要求改成逐条检查（只能有一个 @、@ 前不为空、域名按点拆开每段都不为空、至少两段、无空格）。
- 原因：作业要求"域名包含点且每段都不为空"。我发现 `joy@.example.com`、`joy@example..com`、`joy@example.com.` 都能通过原正则，不符合要求。逐条检查也比复杂正则更容易读懂和解释。
- 检查方式和结果：给三个地址各加一个拒绝测试，`npm test` 8/8 通过；之后用 curl 向 `/api/contact` 提交 `joy@.example.com`，返回 400 和邮箱错误提示。

## 例子 2：FieldError 组件被复制了一份

- 文件 / commit：`components/ApiContactForm.js`、`components/ContactForm.js` → `components/FieldError.js`，`c093baa`
- Agent 原来的方案：生成新表单时，把 `FieldError` 组件原样复制了一份到 `ApiContactForm.js`。
- 我的决定：要求抽成共用的 `components/FieldError.js`，两个表单都 import 它，其他逻辑不动。
- 原因：两份完全相同的代码以后容易改了一处忘了另一处；评分标准也要求不能有无解释的重复逻辑。
- 检查方式和结果：`npm test` 8/8 通过；启动 dev server 后，`/contact-me` 和 `/contact-me-server-form` 都返回 200，三个 label 都正常渲染。

## 例子 3：Slug 生成与重名处理

- 文件 / commit：`server/slug.js`，`5186275`
- Agent 原来的方案：标题转小写，把非英文字母数字的字符替换成 `-`；重名时加 `-2`、`-3` 后缀；如果转完是空的，就退回成 `post`。
- 我的决定：接受这个方案。同时我在审查时注意到，纯中文标题会全部被替换掉，生成 `post`、`post-2` 这样不好读的链接。
- 原因：我的博客标题是英文，当前方案对我的内容足够用，而且实现简单、有测试覆盖；中文 slug 先作为已知限制记录下来，暂不处理。
- 检查方式和结果：`npm test` 中 3 个 slug 测试通过；用重名标题 "Why I Love SQL" POST 到 `/api/blogs`，返回 201，生成的 slug 是 `why-i-love-sql-2`，没有覆盖原来的博客。
