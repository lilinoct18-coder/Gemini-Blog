# 本地開發指南

## 前置條件

- Node.js 20+
- Docker 和 Docker Compose
- GitHub CLI (`gh`) - 用於觸發 workflow

## 啟動後端

### 1. 設定環境變數

```bash
cp .env.example .env
# 編輯 .env，至少填入 MySQL 密碼
```

### 2. 啟動 Ghost + MySQL

```bash
./scripts/init-ghost.sh
```

### 3. 設定 Ghost

1. 訪問 http://localhost:2368/ghost
2. 建立管理員帳號
3. 建立兩個作者：
   - Novis (slug: `novis`)
   - Lilin (slug: `lilin`)
4. 進入 Settings > Integrations > Add custom integration
5. 複製 Content API Key 到 `.env` 的 `GHOST_CONTENT_API_KEY`

### 4. 發布測試文章

在 Ghost 後台建立文章並指定作者為 Novis 或 Lilin。**發文步驟、Dev 測試流程與 Production 發文後更新方式**請見 [Ghost CMS 發布與環境流程](ghost-cms-guide.md)。

## 前端開發

### Landing Page

```bash
cd frontend/astro-landing
npm install
npm run dev
# 訪問 http://localhost:4321
```

### Human Blog

```bash
cd frontend/astro-human
npm install

# 建立 .env 檔案
echo "GHOST_URL=http://localhost:2368" > .env
echo "GHOST_CONTENT_API_KEY=your_key_here" >> .env

npm run dev
# 訪問 http://localhost:4321
```

### AI Blog

```bash
cd frontend/astro-ai
npm install

# 建立 .env 檔案
echo "GHOST_URL=http://localhost:2368" > .env
echo "GHOST_CONTENT_API_KEY=your_key_here" >> .env

npm run dev
# 訪問 http://localhost:4321
```

> 注意：同時開發多個站點時，需要指定不同的 port：
> ```bash
> # Terminal 1
> cd frontend/astro-landing && npm run dev -- --port 4321
> # Terminal 2
> cd frontend/astro-human && npm run dev -- --port 4322
> # Terminal 3
> cd frontend/astro-ai && npm run dev -- --port 4323
> ```

## 專案結構

```
Gemini-Blog/
├── .github/workflows/     # CI/CD workflows
├── backend/               # Ghost CMS configuration
│   └── ghost/
├── frontend/
│   ├── astro-landing/     # Entry portal site
│   ├── astro-human/       # Novis blog (dark blue theme)
│   └── astro-ai/          # Lilin blog (beige theme)
├── docs/                  # Documentation
├── scripts/               # Utility scripts
├── docker-compose.yml     # Production (Traefik + GHCR)
├── docker-compose-dev.yaml # Local / pre-push testing (no Traefik)
└── .env.example           # Environment template
```

## 使用 docker-compose-dev 做整合測試

在 push 前可用 `docker-compose-dev.yaml` 在本地跑齊所有服務（無 Traefik），驗證後端與三個前端的整合。Port 使用 3080 / 3081 / 3082，避開本機已佔用的 80、81、8080、8053 等。

### 步驟

1. **複製並填寫環境變數**

```bash
cp .env.example .env
# 編輯 .env：至少填入 MYSQL_*、GHOST_URL=http://localhost:2368
```

2. **只啟動後端**

```bash
docker compose -f docker-compose-dev.yaml up -d mysql ghost
```

3. **設定 Ghost 並取得 Content API Key**

- 瀏覽器開啟 http://localhost:2368/ghost
- 完成初始設定、建立 Novis / Lilin 兩位作者
- Settings > Integrations > Add custom integration
- 將 Content API Key 寫入 `.env` 的 `GHOST_CONTENT_API_KEY`

4. **建置並啟動前端**

```bash
docker compose -f docker-compose-dev.yaml up -d --build
```

human / ai 建置時會透過 host 網路連到本機 Ghost，故須先完成步驟 2、3。

5. **手動驗證**

| 服務 | URL |
|------|-----|
| 入口頁 | http://localhost:3080 |
| Human Blog | http://localhost:3081 |
| AI Blog | http://localhost:3082 |
| Ghost 前台 / 後台 | http://localhost:2368 / http://localhost:2368/ghost |

完整「發文 → 在 3081/3082 看到文章」的測試流程見 [Ghost CMS 發布與環境流程](ghost-cms-guide.md)。

### 常用指令（dev）

| 指令 | 說明 |
|------|------|
| `docker compose -f docker-compose-dev.yaml up -d --build` | 建置並啟動全部 |
| `docker compose -f docker-compose-dev.yaml down` | 停止並移除容器 |
| `docker compose -f docker-compose-dev.yaml logs -f ghost` | 查看 Ghost 日誌 |

## Testing 與 CI

前端的檢查與 CI 流程（check、lint、format、unit test、E2E）有獨立說明，**建議 push 前在對應前端目錄跑一次檢查**，可減少 PR 上 CI 失敗。

- **完整說明**：[Testing 與 CI 指南](testing.md)（含：在哪個目錄跑、各指令在做什麼、E2E 步驟、CI 怎麼看、失敗時怎麼查）
- **重點**：`npm run check` / `lint` / `test` 等都要在 `frontend/astro-landing`、`frontend/astro-human` 或 `frontend/astro-ai` 底下跑，專案根目錄沒有 `package.json`。

## 常用指令

| 指令 | 說明 |
|------|------|
| `docker compose --profile backend up -d` | 啟動 Ghost + MySQL |
| `docker compose --profile backend down` | 停止後端 |
| `docker compose --profile all up -d` | 啟動所有服務 |
| `./scripts/backup-db.sh` | 備份資料庫 |
| `./scripts/rebuild-frontend.sh all` | 觸發前端重建 |
