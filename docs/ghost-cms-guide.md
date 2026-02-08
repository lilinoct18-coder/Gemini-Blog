# Ghost CMS 發布與環境流程

本專案以 **Ghost CMS** 作為內容來源，Novis 部落格（`/novis/`）與 Lilin 部落格（`/lilin/`）透過 Content API 拉取文章。本文件說明如何在 Ghost 裡發布文章，以及在 **Dev 環境**與 **Production 環境**下各自的流程。

---

## 在 Ghost CMS 裡發布文章

### 第一次使用：完成 Ghost 設定

1. 瀏覽器開啟 Ghost 網址（Dev 為 `http://localhost:2368`，Production 為 `https://blog.your-domain.com/cms/`）。
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
4. 發布後文章會出現在 Ghost 前台；前端重建後會出現在對應的部落格頁面。

### 後台與作者對應

- **Ghost 後台**：在 Ghost 網址後加上 `/ghost`（例如 `http://localhost:2368/ghost` 或 `https://blog.your-domain.com/cms/ghost`）。
- **作者與站點對應**：
  - 作者 **novis** 的文章 → `/novis/` 部落格
  - 作者 **lilin** 的文章 → `/lilin/` 部落格
- 請在 **Settings → Staff** 中確保有 novis、lilin 兩位成員；發文時在文章右側 **Settings** 選擇正確 **Author**。
- 要讓部落格顯示文章，必須在 Ghost **Settings → Integrations → Add custom integration** 建立整合並取得 **Content API Key**。

---

## Dev 環境：測試流程

在本地用 `docker-compose-dev.yaml` 跑齊所有服務時，可依下列流程驗證。

### 1. 啟動服務

```bash
cp .env.example .env
# 編輯 .env：至少填入 MYSQL_*

docker compose -f docker-compose-dev.yaml up -d mysql ghost
# 等待 Ghost 健康（約 1 分鐘）
```

### 2. 設定 Ghost 並取得 Content API Key

1. 瀏覽器開啟 **http://localhost:2368/ghost**，完成初始設定。
2. 在 **Settings → Staff** 新增兩位成員，slug 為 `novis` 與 `lilin`。
3. 在 **Settings → Integrations → Add custom integration** 建立整合，複製 **Content API Key**。
4. 將 Key 寫入 `.env`：
   ```bash
   GHOST_CONTENT_API_KEY=你複製的26碼hex
   ```

### 3. 啟動前端

```bash
docker compose -f docker-compose-dev.yaml up -d --build
```

### 4. 在瀏覽器驗證

| 用途 | URL |
|------|-----|
| Landing 門戶 | http://localhost:3080 |
| Novis 部落格 | http://localhost:3080/novis/ |
| Lilin 部落格 | http://localhost:3080/lilin/ |
| Ghost CMS | http://localhost:3080/cms/ |
| Ghost API（直連） | http://localhost:2368 |
| Ghost 後台發文 | http://localhost:2368/ghost |

在 Ghost 後台發布文章後，需重建前端才能看到新文章：

```bash
docker compose -f docker-compose-dev.yaml up -d --build frontend
```

---

## Production 環境：部署後怎麼做

Production 的 Ghost 透過 Nginx 反向代理在 `/cms/` 路徑下存取。

### Ghost 與後台網址

- **Ghost CMS**：`https://blog.your-domain.com/cms/`
- **Ghost 後台（發文）**：`https://blog.your-domain.com/cms/ghost`

### 日常發文流程

1. 開啟 Ghost 後台登入。
2. 建立文章並選擇作者 **novis** 或 **lilin**。
3. 發布後觸發前端重建：

```bash
./scripts/rebuild-frontend.sh
```

或等待自動排程（每 6 小時）。

### 在 Home Server 更新

```bash
# 在 homeserver 的 /opt/docker 目錄
docker compose -f docker-compose-app.yml pull astro
docker compose -f docker-compose-app.yml up -d astro
```

### 小結

| 項目 | Dev 環境 | Production 環境 |
|------|----------|------------------|
| Ghost 網址 | http://localhost:2368 | https://blog.your-domain.com/cms/ |
| 後台發文 | http://localhost:2368/ghost | https://blog.your-domain.com/cms/ghost |
| Content API Key | 寫入專案根目錄 `.env` | 寫入 GitHub Secrets |
| 發文後前端更新 | 重建 frontend 容器 | 執行 `rebuild-frontend.sh` 後 pull |

更多部署細節見 [deployment.md](deployment.md)，本地開發見 [development.md](development.md)。
