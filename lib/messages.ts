// 留言的資料存取層（Data Layer）
//
// 現在改用 Supabase（雲端 Postgres 資料庫）保存留言，
// 所以重新部署、伺服器重啟，留言都不會消失了。
//
// 只在伺服器端（API route）使用 secret key，金鑰放在環境變數，不會外洩。

import { createClient } from "@supabase/supabase-js";

export type Message = {
  id: number;
  name: string; // 留言者暱稱
  content: string; // 留言內容
  createdAt: string; // 留言時間（ISO 字串）
};

// 連線到 Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// 資料庫裡的欄位是 created_at，前端用的是 createdAt，這裡做轉換
type Row = { id: number; name: string; content: string; created_at: string };
function toMessage(row: Row): Message {
  return {
    id: row.id,
    name: row.name,
    content: row.content,
    createdAt: row.created_at,
  };
}

// 取得所有留言（最新的排在最前面）
export async function getMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Row[]).map(toMessage);
}

// 新增一筆留言，回傳新增後的留言
export async function addMessage(name: string, content: string): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({ name, content })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toMessage(data as Row);
}
