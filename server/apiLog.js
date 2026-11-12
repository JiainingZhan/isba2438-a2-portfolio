// One-line request log for the menu API: METHOD /path STATUS.
// Shown in the server terminal so the requests are easy to demo.

import { NextResponse } from "next/server";

export function jsonWithLog(request, status, body) {
  const path = new URL(request.url).pathname;
  console.log(`${request.method} ${path} ${status}`);
  return NextResponse.json(body, { status });
}
