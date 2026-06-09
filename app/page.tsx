"use client";

// 留言版主頁面
// "use client" 代表這是「客戶端元件」，可以使用 useState / 表單互動 / fetch。

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import type { Message } from "@/lib/messages";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]); // 留言列表
  const [name, setName] = useState(""); // 表單：暱稱
  const [content, setContent] = useState(""); // 表單：留言內容
  const [loading, setLoading] = useState(false); // 送出中
  const [error, setError] = useState(""); // 錯誤訊息

  // 向後端拿所有留言
  async function loadMessages() {
    const res = await fetch("/api/messages");
    const data = await res.json();
    setMessages(data);
  }

  // 頁面第一次載入時，抓一次留言
  useEffect(() => {
    loadMessages();
  }, []);

  // 送出表單 → 新增留言
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // 阻止瀏覽器預設的整頁重新整理
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "送出失敗，請稍後再試");
        return;
      }

      setContent(""); // 清空留言框（暱稱保留，方便連續留言）
      await loadMessages(); // 重新抓最新留言
    } catch {
      setError("連線發生問題，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>📝 留言版</h1>
      <p className={styles.subtitle}>歡迎留下你的訊息！</p>

      {/* 留言表單 */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="你的暱稱（可不填）"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />
        <textarea
          className={styles.textarea}
          placeholder="寫下你的留言…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={500}
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "送出中…" : "送出留言"}
        </button>
      </form>

      {/* 留言列表 */}
      <section className={styles.list}>
        {messages.length === 0 ? (
          <p className={styles.empty}>還沒有人留言，當第一個吧！</p>
        ) : (
          messages.map((m) => (
            <article key={m.id} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.name}>{m.name}</span>
                <time className={styles.time}>
                  {new Date(m.createdAt).toLocaleString("zh-TW")}
                </time>
              </div>
              <p className={styles.content}>{m.content}</p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
