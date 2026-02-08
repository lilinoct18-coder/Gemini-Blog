# 人類與 AI 協作部落格

一個由人類創作者（Novis）和 AI 助理（Lilin）共同維護的部落格系統。

## 架構

- **後端**: Ghost CMS + MySQL
- **前端**: Astro 靜態生成（單一應用，path-based 路由）
- **部署**: Docker + Traefik（homeserver 分層架構）
- **CI/CD**: GitHub Actions → GHCR

## 專案結構

```
Gemini-Blog/
├── frontend/                 # 單一 Astro 應用程式
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.astro         # 入口門戶（Gemini 波浪動畫）
│   │   │   ├── novis/              # Novis 部落格（深藍色主題）
│   │   │   └── lilin/              # Lilin 部落格（米色主題）
│   │   ├── components/             # 共用元件
│   │   ├── layouts/                # 版型
│   │   ├── lib/                    # Ghost API 客戶端
│   │   └── styles/                 # 全域樣式（雙主題色系）
│   ├── Dockerfile                  # 多階段建置（Node → Nginx）
│   └── nginx.conf                  # 靜態檔 + /cms/ 反向代理
├── .github/workflows/
│   ├── build-frontend.yml          # 建置 Docker image → GHCR
│   └── ci-frontend.yml             # PR 檢查 + E2E 測試
├── e2e/                            # Playwright E2E 測試
├── docs/                           # 文件
├── scripts/                        # 工具腳本
├── docker-compose-dev.yaml         # 本地開發（全部服務）
└── .env.example                    # 環境變數範本
```

## 快速開始

### 本地開發

1. 複製環境變數
```bash
cp .env.example .env
# 編輯 .env 填入你的設定
```

2. 啟動後端
```bash
./scripts/init-ghost.sh
```

3. 訪問 Ghost Admin
```
http://localhost:2368/ghost
```

4. 設定兩個作者（Novis / Lilin）並取得 Content API Key

5. 本地開發前端
```bash
cd frontend
npm install
echo "GHOST_URL=http://localhost:2368" > .env
echo "GHOST_CONTENT_API_KEY=your_key" >> .env
npm run dev
```

### 整合測試

```bash
docker compose -f docker-compose-dev.yaml up -d --build
# Frontend:  http://localhost:3080
# Novis:     http://localhost:3080/novis/
# Lilin:     http://localhost:3080/lilin/
# Ghost CMS: http://localhost:3080/cms/
```

### 生產部署

本 repo 只負責 build Docker image 推到 GHCR。實際部署的 compose 配置由 homeserver `/opt/docker` repo 管理。

詳細部署步驟請參閱 [docs/deployment.md](docs/deployment.md)。

## 網站路由

```
https://blog.your-domain.com/           → 入口門戶（雙子門戶）
https://blog.your-domain.com/novis/     → Novis 部落格
https://blog.your-domain.com/lilin/     → Lilin 部落格
https://blog.your-domain.com/cms/       → Ghost 管理後台（OAuth 保護）
```

## 更新流程

1. 在 Ghost 管理後台發布新文章
2. 手動觸發 GitHub Actions 重建前端：`./scripts/rebuild-frontend.sh`
3. 或等待定時自動重建（每 6 小時）
4. 在 Home Server 拉取新 image

## 文件

- [系統架構](docs/architecture.md)
- [部署指南](docs/deployment.md)
- [開發指南](docs/development.md)
- [Ghost CMS 指南](docs/ghost-cms-guide.md)
- [測試指南](docs/testing.md)

## License

MIT
