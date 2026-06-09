// 留言的後端 API
// 網址：/api/messages
//   GET  → 取得所有留言
//   POST → 新增一筆留言

import { NextResponse } from "next/server";
import { getMessages, addMessage } from "@/lib/messages";

// GET /api/messages：回傳目前所有留言
export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    // 暫時：把真正的錯誤訊息回傳出來方便診斷（之後會移除）
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "讀取留言失敗", detail }, { status: 500 });
  }
}

// POST /api/messages：新增一筆留言
export async function POST(request: Request) {
  const body = await request.json();

  // 整理輸入：去掉前後空白
  const name = String(body?.name ?? "").trim();
  const content = String(body?.content ?? "").trim();

  // 簡單驗證
  if (!content) {
    return NextResponse.json({ error: "留言內容不能空白" }, { status: 400 });
  }
  if (content.length > 500) {
    return NextResponse.json({ error: "留言請少於 500 字" }, { status: 400 });
  }

  try {
    // 沒填暱稱就當作「匿名」
    const message = await addMessage(name || "匿名", content);
    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "留言儲存失敗" }, { status: 500 });
  }
}
