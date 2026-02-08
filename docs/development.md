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

```bash
cd frontend
npm install

# 建立 .env 檔案
echo "GHOST_URL=http://localhost:2368" > .env
echo "GHOST_CONTENT_API_KEY=your_key_here" >> .env

npm run dev
# 訪問 http://localhost:4321
```

所有頁面都在同一個 Astro app 中：

| 路徑 | 內容 |
|------|------|
| `http://localhost:4321/` | Landing 門戶 |
| `http://localhost:4321/novis/` | Novis 文章列表 |
| `http://localhost:4321/lilin/` | Lilin 文章列表 |

## 專案結構

```
Gemini-Blog/
├── .github/workflows/     # CI/CD workflows
├── frontend/              # 單一 Astro 應用程式
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.astro         # Landing 門戶
│   │   │   ├── novis/              # Novis 部落格頁面
│   │   │   └── lilin/              # Lilin 部落格頁面
│   │   ├── components/             # 共用元件
│   │   ├── layouts/                # 版型
│   │   ├── lib/                    # Ghost API 客戶端
│   │   └── styles/                 # 全域樣式
│   ├── Dockerfile                  # 生產建置（Node -> Nginx）
│   ├── nginx.conf                  # 靜態檔 + /cms/ 反向代理
│   └── package.json
├── e2e/                   # Playwright E2E 測試
├── docs/                  # 文件
├── scripts/               # 工具腳本
├── docker-compose-dev.yaml # 本地整合測試（無 Traefik）
└── .env.example           # 環境變數範本
```

## 使用 docker-compose-dev 做整合測試

在 push 前可用 `docker-compose-dev.yaml` 在本地跑齊所有服務（無 Traefik），驗證前端與 Ghost 的整合。

### 步驟

1. **複製並填寫環境變數**

```bash
cp .env.example .env
# 編輯 .env：至少填入 MYSQL_*、GHOST_CONTENT_API_KEY
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

5. **手動驗證**

| 服務 | URL |
|------|-----|
| Landing 門戶 | http://localhost:3080 |
| Novis 部落格 | http://localhost:3080/novis/ |
| Lilin 部落格 | http://localhost:3080/lilin/ |
| Ghost CMS | http://localhost:3080/cms/ |
| Ghost API（直連） | http://localhost:2368 |

### 常用指令（dev）

| 指令 | 說明 |
|------|------|
| `docker compose -f docker-compose-dev.yaml up -d --build` | 建置並啟動全部 |
| `docker compose -f docker-compose-dev.yaml down` | 停止並移除容器 |
| `docker compose -f docker-compose-dev.yaml logs -f ghost` | 查看 Ghost 日誌 |

## Testing 與 CI

前端的檢查與 CI 流程（check、lint、format、unit test、E2E）有獨立說明。

```bash
cd frontend
npm run check       # Astro + TypeScript 型別檢查
npm run lint        # ESLint
npm run format:check # Prettier 格式檢查
npm run test        # Vitest 單元測試
```

完整說明見 [Testing 與 CI 指南](testing.md)。

## 常用指令

| 指令 | 說明 |
|------|------|
| `docker compose -f docker-compose-dev.yaml up -d` | 啟動所有服務 |
| `docker compose -f docker-compose-dev.yaml down` | 停止所有服務 |
| `./scripts/backup-db.sh` | 備份資料庫 |
| `./scripts/rebuild-frontend.sh` | 觸發前端重建 |
