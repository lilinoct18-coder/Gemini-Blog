# 生產部署指南

## 前置條件

- Home Server 上已安裝 Docker 和 Docker Compose
- Traefik 反向代理已設定並運行（包含 `proxy` 外部網路）
- DNS 已設定指向 Home Server：
  - `your-domain.com` → Landing Page
  - `human.your-domain.com` → Human Blog
  - `ai.your-domain.com` → AI Blog
  - `cms.your-domain.com` → Ghost CMS

## 部署步驟

### 1. 複製專案

```bash
git clone https://github.com/YOUR_USERNAME/Gemini-Blog.git
cd Gemini-Blog
```

### 2. 設定環境變數

```bash
cp .env.example .env
# 編輯 .env 填入實際的密碼和域名
```

### 3. 建立 Traefik 外部網路（如尚未建立）

```bash
docker network create proxy
```

### 4. 啟動後端

```bash
docker compose --profile backend up -d
```

### 5. 初始化 Ghost

```bash
./scripts/init-ghost.sh
```

按照提示：
1. 訪問 `https://cms.your-domain.com/ghost` 建立管理員帳號
2. 建立 Novis 和 Lilin 兩個作者
3. 建立 Custom Integration 並取得 Content API Key
4. 將 API Key 填入 `.env` 和 GitHub Secrets

### 6. 設定 GitHub Secrets

在 GitHub repo 的 Settings > Secrets and variables > Actions 中新增：

- `GHOST_URL`: Ghost CMS 的公開 URL（如 `https://cms.your-domain.com`）
- `GHOST_CONTENT_API_KEY`: 步驟 5 取得的 Content API Key

### 7. 觸發首次建置

```bash
./scripts/rebuild-frontend.sh all
```

等待 GitHub Actions 完成建置並推送 image 到 GHCR。

### 8. 啟動所有服務

```bash
docker compose --profile all up -d
```

## 更新流程

### 發布新文章後更新前端

```bash
# 手動觸發重建
./scripts/rebuild-frontend.sh human  # 僅重建 Human Blog
./scripts/rebuild-frontend.sh ai     # 僅重建 AI Blog
./scripts/rebuild-frontend.sh all    # 重建全部

# 或等待自動排程（每 6 小時）
```

### 拉取最新 image

```bash
docker compose --profile all pull
docker compose --profile all up -d
```

### 備份資料庫

```bash
./scripts/backup-db.sh
```

## 故障排除

### 檢查服務狀態

```bash
docker compose --profile all ps
docker compose --profile all logs ghost
docker compose --profile all logs mysql
```

### 重啟單一服務

```bash
docker compose restart ghost
docker compose restart landing
```
