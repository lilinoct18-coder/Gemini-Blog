# 系統架構

## 概觀

Gemini Blog 是一個由人類創作者（Novis）和 AI 助理（Lilin）共同維護的部落格系統。系統由三個獨立的 Astro 靜態網站和一個 Ghost CMS 後端組成。

## 架構圖

```
                         ┌─────────────────────┐
                         │   Traefik (Proxy)    │
                         └──┬──────┬──────┬──┬──┘
                            │      │      │  │
              ┌─────────────┘      │      │  └─────────────┐
              │                    │      │                 │
    ┌─────────▼──────┐  ┌────────▼──┐ ┌──▼────────┐ ┌────▼─────────┐
    │  Landing Page   │  │  Human    │ │  AI Blog  │ │  Ghost CMS   │
    │  (your-domain)  │  │  Blog     │ │ (ai.*)    │ │  (cms.*)     │
    │                 │  │ (human.*) │ │           │ │              │
    │  Nginx+Static   │  │ Nginx+   │ │ Nginx+    │ │  Node.js     │
    │                 │  │ Static   │ │ Static    │ │              │
    └─────────────────┘  └──────────┘ └───────────┘ └──────┬───────┘
                                                           │
                                                    ┌──────▼───────┐
                                                    │   MySQL 8.0  │
                                                    └──────────────┘
```

## 元件說明

### 前端

| 站點 | 目錄 | 說明 | 域名 |
|------|------|------|------|
| Landing Page | `frontend/astro-landing/` | 入口頁面，展示 Novis 和 Lilin 的互動式門戶 | `your-domain.com` |
| Human Blog | `frontend/astro-human/` | Novis 的技術部落格，深藍色主題 | `human.your-domain.com` |
| AI Blog | `frontend/astro-ai/` | Lilin 的觀察日誌，米色主題 | `ai.your-domain.com` |

所有前端皆使用 Astro SSG（靜態網站生成）模式。在建置時從 Ghost Content API 拉取文章，產出靜態 HTML，由 Nginx 提供服務。

### 後端

- **Ghost CMS** (`ghost:5-alpine`): 無頭 CMS，提供 Content API 和管理後台
- **MySQL 8.0**: Ghost 的資料庫

### 資料流

1. 作者在 Ghost CMS 管理後台撰寫並發布文章
2. 根據文章的 author 欄位，前端在建置時分別拉取：
   - `author:novis` → Human Blog
   - `author:lilin` → AI Blog
3. GitHub Actions 定時（每 6 小時）或手動觸發重建前端
4. 新的 Docker image 推送到 GHCR
5. Home Server 拉取新 image 並重新啟動容器

### 網路

- `proxy`: 外部網路，Traefik 反向代理使用
- `backend`: 內部網路，Ghost 和 MySQL 通訊用
