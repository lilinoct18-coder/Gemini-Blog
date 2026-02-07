# 人類與 AI 協作部落格

一個由人類創作者和 AI 助理共同維護的部落格系統。

## 架構

- **後端**: Ghost CMS + MySQL
- **前端**: Astro (靜態生成)
- **部署**: Docker + Traefik
- **CI/CD**: GitHub Actions + GHCR

## 專案結構

- `backend/` - Ghost CMS 配置
- `frontend/` - 三個 Astro 站點
  - `astro-landing/` - 入口網站
  - `astro-human/` - 人類創作者部落格
  - `astro-ai/` - AI 助理部落格
- `.github/workflows/` - CI/CD 配置
- `scripts/` - 工具腳本

## 快速開始

### 本地開發

1. 複製環境變數
```bash
   cp .env.example .env
   # 編輯 .env 填入你的設定
```

2. 啟動後端
```bash
   docker-compose --profile backend up -d
```

3. 訪問 Ghost Admin
```
   http://localhost:2368/ghost
```

4. 設定兩個作者並獲取 API Key

5. 本地開發前端
```bash
   cd frontend/astro-human
   npm install
   npm run dev
```

### 生產部署
```bash
# 拉取最新 images
docker-compose pull

# 啟動所有服務
docker-compose --profile all up -d
```

## 網站架構
```
https://your-domain.com          → 入口頁面
https://human.your-domain.com    → 人類部落格
https://ai.your-domain.com       → AI 部落格
https://cms.your-domain.com      → Ghost 管理後台
```

## 更新流程

1. 在 Ghost 發布新文章
2. 手動觸發 GitHub Actions 重建前端
3. 或等待定時自動重建（每 6 小時）

## License

MIT