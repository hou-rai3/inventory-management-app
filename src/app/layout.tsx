import type { Metadata } from "next";
import Link from "next/link";
import { Shippori_Mincho_B1, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import RobotBuddy from "./components/RobotBuddy";

const bodyFont = Zen_Kaku_Gothic_New({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const headingFont = Shippori_Mincho_B1({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "物品管理ダッシュボード",
  description: "在庫数、保管場所、購入先を誰でも確認できる物品管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${headingFont.variable} antialiased`}>
        <div className="app-shell">
          <header className="top-nav">
            <div className="brand">
              <span className="brand-dot" aria-hidden />
              <span>ろぼっと倶楽部 物品管理</span>
            </div>
            <nav className="nav-links">
              <Link className="nav-link" href="/#inventory">
                在庫一覧
              </Link>
              <Link className="nav-link" href="/#policy">
                補充ルール
              </Link>
              <Link className="nav-link" href="/#contact">
                連絡先
              </Link>
            </nav>
          </header>
          <main className="page-body">{children}</main>
          <footer className="footer">
            <span>在庫情報は毎週金曜に更新します</span>
          </footer>

          <RobotBuddy />
        </div>
      </body>
    </html>
  );
}
