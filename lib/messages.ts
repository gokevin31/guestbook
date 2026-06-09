// 留言的資料存取層（Data Layer）
//
// 目前先用「記憶體陣列」暫存留言。
// ⚠️ 注意：伺服器重新啟動或 Vercel 重新部署時，這裡的留言會全部清空。
//
// 之後要接真正的資料庫（例如 Vercel Postgres / Neon）時，
// 只要把下面三個函式的內容換成資料庫操作即可，其他檔案完全不用動。

export type Message = {
  id: number;
  name: string; // 留言者暱稱
  content: string; // 留言內容
  createdAt: string; // 留言時間（ISO 字串）
};

// 留言暫存在這個陣列裡
const messages: Message[] = [];
let nextId = 1;

// 取得所有留言（最新的排在最前面）
export function getMessages(): Message[] {
  return [...messages].sort((a, b) => b.id - a.id);
}

// 新增一筆留言，回傳新增後的留言物件
export function addMessage(name: string, content: string): Message {
  const message: Message = {
    id: nextId++,
    name,
    content,
    createdAt: new Date().toISOString(),
  };
  messages.push(message);
  return message;
}
