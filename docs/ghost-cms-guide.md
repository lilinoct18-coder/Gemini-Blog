# Ghost CMS 發布與環境流程

本專案以 **Ghost CMS** 作為內容來源，Human 部落格（Novis）與 AI 部落格（Lilin）透過 Content API 拉取文章。本文件說明如何在 Ghost 裡發布文章，以及在 **Dev 環境**與 **Production 環境**下各自的流程。

---

## 在 Ghost CMS 裡發布文章

### 第一次使用：完成 Ghost 設定

1. 瀏覽器開啟 Ghost 網址（Dev 為 `http://localhost:2368`，Production 為 `https://cms.your-domain.com`）。
2. 會進入 **Ghost 設定精靈**：
   - **Create your account**：填寫管理員信箱、名稱、密碼（此為後台帳號）。
   - **Site title**：輸入網站名稱。
3. 完成後即進入 **Ghost Admin** 後台。

### 發布新文章

1. 左側選單點 **「+ New post」**（或「撰寫」）。
2. 輸入**標題**，在編輯器撰寫**內文**（支援 Markdown、圖片等）。
3. 右側可設定：
   - **Publish**：點 **Publish** → **Publish now** 即正式發布；或選 **Schedule** 排程。
   - **Settings**：摘要、精選圖片、標籤、**作者**等。
4. 發布後文章會出現在 Ghost 前台；若 Content API Key 已正確設定，也會出現在對應的 Human / AI 部落格站點。

### 後台與作者對應

- **Ghost 後台**：在 Ghost 網址後加上 `/ghost`（例如 `http://localhost:2368/ghost` 或 `https://cms.your-domain.com/ghost`）。已登入時也可由前台右上角進入。
- **作者與站點對應**：
  - 作者 **novis** 的文章會出現在 **Human 部落格**。
  - 作者 **lilin** 的文章會出現在 **AI 部落格**。
- 請在 **Settings → Staff** 中確保有 novis、lilin 兩位成員；發文時在文章右側 **Settings** 選擇正確 **Author**。
- 要讓 Human / AI 站點顯示文章，必須在 Ghost **Settings → Integrations → Add custom integration** 建立整合並取得 **Content API Key**，並在對應環境中設定（見下方 Dev / Production 流程）。

---

## Dev 環境：測試流程

在本地用 `docker-compose-dev.yaml` 跑齊所有服務時，可依下列流程驗證「從發文到在部落格看到文章」。

### 1. 啟動服務

```bash
cp .env.example .env
# 編輯 .env：至少填入 MYSQL_*（密碼請用字串，例如 devpass123）、GHOST_URL=http://localhost:2368

docker compose -f docker-compose-dev.yaml up -d mysql ghost
# 等待 Ghost 健康（約 1 分鐘），必要時：docker compose -f docker-compose-dev.yaml logs -f ghost
```

### 2. 設定 Ghost 並取得 Content API Key

1. 瀏覽器開啟 **http://localhost:2368/ghost**，完成初始設定（建立管理員、Site title）。
2. 在 **Settings → Staff** 新增兩位成員，並設定其 **slug** 為 `novis` 與 `lilin`。
3. 在 **Settings → Integrations → Add custom integration** 建立整合，複製 **Content API Key**（26 碼 hex）。
4. 將 Key 寫入專案根目錄的 `.env`：
   ```bash
   GHOST_CONTENT_API_KEY=你複製的26碼hex
   ```

### 3. 啟動前端並重建（讓 API Key 生效）

```bash
docker compose -f docker-compose-dev.yaml up -d --build
```

human / ai 容器啟動時會先建置 Astro，會讀取 `.env` 的 `GHOST_CONTENT_API_KEY`。若之前已啟動過，可重啟以重新建置：

```bash
docker compose -f docker-compose-dev.yaml up -d --build human ai
```

### 4. 在瀏覽器驗證

| 用途           | URL |
|----------------|-----|
| 入口頁         | http://localhost:3080 |
| Human 部落格   | http://localhost:3081 |
| AI 部落格      | http://localhost:3082 |
| Ghost 前台     | http://localhost:2368 |
| Ghost 後台發文 | http://localhost:2368/ghost |

在 Ghost 後台發布文章並指定作者為 **novis** 或 **lilin** 後，重新整理對應的 3081 或 3082 即可看到文章（human/ai 為靜態站，啟動時已建置完成；若在容器啟動後才更新 `.env` 的 API Key，需重啟 human/ai 讓其重新建置）。

### 常用指令（Dev）

| 指令 | 說明 |
|------|------|
| `docker compose -f docker-compose-dev.yaml up -d --build` | 建置並啟動全部 |
| `docker compose -f docker-compose-dev.yaml down` | 停止並移除容器 |
| `docker compose -f docker-compose-dev.yaml logs -f ghost` | 查看 Ghost 日誌 |
| `docker compose -f docker-compose-dev.yaml restart human ai` | 重啟前端（會重新建置並拉取最新 Ghost 文章） |

---

## Production 環境：部署後怎麼做

Production 使用 `docker-compose.yml`，Ghost 對外網址為 `https://cms.your-domain.com`（依你在 `.env` 的 `DOMAIN` 與 Traefik 設定）。發文流程與 Dev 相同，差異在「網址」與「前端何時更新」。

### Ghost 與後台網址

- **Ghost 前台**：`https://cms.your-domain.com`
- **Ghost 後台（發文）**：`https://cms.your-domain.com/ghost`

首次部署時應已完成：建立管理員、Novis / Lilin 作者、Custom Integration 的 Content API Key，並寫入 `.env` 與 GitHub Secrets（見 [deployment.md](deployment.md)）。

### 日常發文流程

1. 開啟 **https://cms.your-domain.com/ghost** 登入。
2. 依上方「在 Ghost CMS 裡發布文章」建立文章，並選擇作者 **novis** 或 **lilin**。
3. 發布後：
   - **Ghost 前台**會立即顯示。
   - **Human / AI 部落格**為靜態站，需觸發 **前端重建** 才會拉取最新文章並更新對應子網域。

### 發布新文章後更新前端

Production 前端是以 Docker image 方式部署，內容在建置時從 Ghost API 抓取，因此發文後需重建對應站點：

```bash
# 僅重建 Human 部落格（Novis）
./scripts/rebuild-frontend.sh human

# 僅重建 AI 部落格（Lilin）
./scripts/rebuild-frontend.sh ai

# 重建全部前端（landing + human + ai）
./scripts/rebuild-frontend.sh all
```

腳本會觸發 GitHub Actions 建置並推送 image 到 GHCR；完成後在伺服器上拉取並重啟：

```bash
docker compose --profile all pull
docker compose --profile all up -d
```

若已設定排程，也可等待自動重建（例如每 6 小時）；若要即時看到新文章，建議發文後手動執行上述流程。

### 小結

| 項目 | Dev 環境 | Production 環境 |
|------|----------|------------------|
| Ghost 網址 | http://localhost:2368 | https://cms.your-domain.com |
| 後台發文 | http://localhost:2368/ghost | https://cms.your-domain.com/ghost |
| Content API Key | 寫入專案根目錄 `.env` | 部署時已寫入 `.env` 與 GitHub Secrets |
| 發文後前端更新 | 重啟 human/ai 容器會重新建置 | 執行 `rebuild-frontend.sh` 後 pull 並 up |

更多部署細節見 [deployment.md](deployment.md)，本地開發與 docker-compose-dev 步驟見 [development.md](development.md)。
