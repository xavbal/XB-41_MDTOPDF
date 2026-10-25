# XB-41 · MDtoPDF (日本語)

[English](README.md) | [Español](README.es.md) | [Català](README.ca.md) | [Deutsch](README.de.md) | [日本語](README.ja.md)

---

ドラッグ＆ドロップ対応の洗練されたUI、カスタマイズ可能なタイポグラフィ、絵文字除去機能を備えた高品質な **Markdown → PDF** コンバーターです。

## 起動方法

**`XB-41 MDtoPDF.bat`** をダブルクリックします（初回のみ依存関係を自動インストールし、ブラウザで `http://localhost:4141` を開きます）。

またはコマンドラインから：

```bash
git clone https://github.com/xavbal/XB-41_MDTOPDF.git
cd XB-41_MDTOPDF
npm install   # 初回のみ
npm start
```

## 使い方

1. `.md` ファイルをドロップエリアにドラッグします（または「ファイルを選択」をクリック）。
2. **フォント**、サイズ、用紙サイズ、余白を調整すると、プレビューが即座に更新されます。
3. **「PDF を書き出す」** または **「絵文字なし PDF」** をクリックして保存します。

## 主な機能

- `.md` / `.markdown` / `.txt` のドラッグ＆ドロップに対応。
- 多言語インターフェース（**日本語**、**カタルーニャ語**、**ドイツ語**、**スペイン語**、**英語**）。
- 日本語フォント対応（Yu Gothic、Meiryo、Noto Sans JP 等）。
- **テーマ**：ライト、ダーク、セピア（全裁ちプリント対応）。
- 用紙サイズ（A4、Letter、Legal）および余白の細かな調整。
- **PDF**、**絵文字なし PDF**、**HTML**、**プレーンテキスト (TXT)** への書き出し。
- 出版品質の組版：カーブクォート、ダッシュ記号、ページ番号の自動挿入。

## アーキテクチャ

- **`src/converter.mjs`** — `markdown-it` を使用した Markdown→HTML レンダリングエンジンと印刷用 CSS。
- **`src/server.mjs`** — 軽量なネイティブ Node.js HTTP サーバー。**Microsoft Edge / Chromium (ヘッドレス)** を使用して高品質な PDF を生成。
- **`src/public/`** — 多言語 i18n 対応の直感的で軽量なフロントエンド。

## ライセンス

MIT ライセンスの下で公開されています。詳細は `LICENSE` をご覧ください。
