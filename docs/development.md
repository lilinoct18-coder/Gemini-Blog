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

在 Ghost 編輯器中建立幾篇測試文章，分別指定作者為 Novis 和 Lilin。

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
├── docker-compose.yml     # Docker orchestration
└── .env.example           # Environment template
```

## 常用指令

| 指令 | 說明 |
|------|------|
| `docker compose --profile backend up -d` | 啟動 Ghost + MySQL |
| `docker compose --profile backend down` | 停止後端 |
| `docker compose --profile all up -d` | 啟動所有服務 |
| `./scripts/backup-db.sh` | 備份資料庫 |
| `./scripts/rebuild-frontend.sh all` | 觸發前端重建 |
