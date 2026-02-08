# 人類與 AI 協作部落格

一個由人類創作者（Novis）和 AI 助理（Lilin）共同維護的部落格系統。

## 架構

- **後端**: Ghost CMS + MySQL
- **前端**: Astro (靜態生成) x 3 站點
- **部署**: Docker + Traefik
- **CI/CD**: GitHub Actions + GHCR

## 專案結構

```
Gemini-Blog/
├── backend/                  # Ghost CMS 配置
│   └── ghost/
├── frontend/
│   ├── astro-landing/        # 入口網站（互動式門戶）
│   ├── astro-human/          # Novis 部落格（深藍色主題）
│   └── astro-ai/             # Lilin 部落格（米色主題）
├── .github/workflows/        # CI/CD 配置
│   ├── build-landing.yml
│   ├── build-human.yml
│   └── build-ai.yml
├── docs/                     # 文件
│   ├── architecture.md
│   ├── deployment.md
│   └── development.md
├── scripts/                  # 工具腳本
│   ├── init-ghost.sh
│   ├── backup-db.sh
│   └── rebuild-frontend.sh
├── docker-compose.yml
└── .env.example
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
cd frontend/astro-human
npm install
echo "GHOST_URL=http://localhost:2368" > .env
echo "GHOST_CONTENT_API_KEY=your_key" >> .env
npm run dev
```

### 生產部署

```bash
# 啟動所有服務
docker compose --profile all up -d

# 更新前端（拉取最新 images）
docker compose --profile all pull
docker compose --profile all up -d
```

詳細部署步驟請參閱 [docs/deployment.md](docs/deployment.md)。

## 網站架構

```
https://your-domain.com          → 入口頁面（雙子門戶）
https://human.your-domain.com    → Novis 部落格
https://ai.your-domain.com       → Lilin 部落格
https://cms.your-domain.com      → Ghost 管理後台
```

## 更新流程

1. 在 Ghost 管理後台發布新文章
2. 手動觸發 GitHub Actions 重建前端：`./scripts/rebuild-frontend.sh all`
3. 或等待定時自動重建（每 6 小時）
4. 在 Home Server 拉取新 image：`docker compose --profile all pull && docker compose --profile all up -d`

## 文件

- [系統架構](docs/architecture.md)
- [部署指南](docs/deployment.md)
- [開發指南](docs/development.md)

## License

MIT
