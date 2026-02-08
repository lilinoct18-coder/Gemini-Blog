# 部署指南

## 概觀

本專案產出一個 Docker image（`gemini-blog`），包含：
- Landing 門戶頁面（`/`）
- Novis 部落格（`/novis/`）
- Lilin 部落格（`/lilin/`）
- Nginx 反向代理至 Ghost CMS（`/cms/`）

部署採用分層架構，適合已有 Traefik + Docker 的 homeserver 環境。

## 架構

```
Browser → Traefik (infra) → Astro Frontend (Nginx) → Ghost CMS → MySQL (db)
                                    ↑                      ↑
                              t3_proxy network        db_mysql network
                                    └── gemini_internal ──┘
```

**路徑路由（單一 domain）：**

| 路徑 | 內容 |
|------|------|
| `/` | Landing 門戶（Gemini 波浪動畫） |
| `/novis/` | Novis 文章列表 |
| `/novis/post/[slug]` | Novis 文章頁面 |
| `/lilin/` | Lilin 文章列表 |
| `/lilin/post/[slug]` | Lilin 文章頁面 |
| `/cms/*` | Ghost CMS 管理後台（OAuth 保護） |

## Repo 職責邊界

- **本 repo**：原始碼 + CI/CD，build Docker image 推到 GHCR
- **Homeserver /opt/docker repo**：實際部署的 compose 檔案

以下提供 homeserver 端的 compose 參考片段。

---

## Homeserver 設定參考

### 前置條件

1. Docker + Docker Compose 已安裝
2. Traefik 已在 `docker-compose-infrastructure.yml` 中運行
3. `t3_proxy` external network 已存在
4. DNS 已設定指向 homeserver

### 建立 networks

```bash
# t3_proxy 通常已由 Traefik infra compose 建立
# 需要新增以下兩個 network：
docker network create db_mysql
docker network create gemini_internal
```

### 建立 secrets

```bash
# 在 /opt/docker/secrets/ 目錄下建立：
echo "your_mysql_root_password" > /opt/docker/secrets/mysql_root_password
echo "your_mysql_password" > /opt/docker/secrets/mysql_password
chmod 600 /opt/docker/secrets/mysql_root_password
chmod 600 /opt/docker/secrets/mysql_password
```

### compose/db/mysql.yml

```yaml
services:
  mysql:
    container_name: mysql
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/mysql_root_password
      MYSQL_DATABASE: ghost
      MYSQL_USER: ghost
      MYSQL_PASSWORD_FILE: /run/secrets/mysql_password
    volumes:
      - ${DOCKERDIR}/appdata/mysql:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - db_mysql
    secrets:
      - mysql_root_password
      - mysql_password
```

### compose/apps/ghost.yml

```yaml
services:
  ghost:
    container_name: ghost
    image: ghost:5-alpine
    restart: unless-stopped
    environment:
      url: https://blog.${DOMAINNAME_1}/cms
      database__client: mysql2
      database__connection__host: mysql
      database__connection__port: 3306
      database__connection__user: ghost
      database__connection__password__file: /run/secrets/mysql_password
      database__connection__database: ghost
      mail__transport: Direct
    volumes:
      - ${DOCKERDIR}/appdata/ghost/content:/var/lib/ghost/content
    networks:
      - db_mysql
      - gemini_internal
    secrets:
      - mysql_password
```

### compose/apps/astro.yml

```yaml
services:
  astro:
    container_name: astro
    image: ghcr.io/${GITHUB_OWNER}/gemini-blog:latest
    restart: unless-stopped
    networks:
      t3_proxy:
      gemini_internal:
    labels:
      - "traefik.enable=true"
      # 主站 -- 所有路徑
      - "traefik.http.routers.gemini-rtr.entrypoints=websecure-external"
      - "traefik.http.routers.gemini-rtr.rule=Host(`blog.${DOMAINNAME_1}`)"
      - "traefik.http.services.gemini-svc.loadbalancer.server.port=80"
      # CMS 後台 -- OAuth 保護
      - "traefik.http.routers.gemini-cms-rtr.entrypoints=websecure-external"
      - "traefik.http.routers.gemini-cms-rtr.rule=Host(`blog.${DOMAINNAME_1}`) && PathPrefix(`/cms`)"
      - "traefik.http.routers.gemini-cms-rtr.middlewares=chain-oauth@file"
      - "traefik.http.routers.gemini-cms-rtr.service=gemini-svc"
```

### docker-compose-app.yml（include 區段加入）

```yaml
networks:
  t3_proxy:
    external: true
  db_mysql:
    external: true
  gemini_internal:
    name: gemini_internal
    driver: bridge

secrets:
  mysql_password:
    file: ${DOCKERDIR}/secrets/mysql_password
  mysql_root_password:
    file: ${DOCKERDIR}/secrets/mysql_root_password

include:
  # ... 其他 app ...
  - compose/apps/astro.yml
  - compose/apps/ghost.yml
```

---

## 首次部署流程

### 1. 啟動 MySQL

```bash
cd /opt/docker
docker compose -f docker-compose-db.yml up -d mysql
```

### 2. 啟動 Ghost

```bash
docker compose -f docker-compose-app.yml up -d ghost
```

### 3. 初始化 Ghost

1. 訪問 `https://blog.YOUR_DOMAIN/cms/ghost` 建立管理員帳號
2. 建立 Novis 和 Lilin 兩個作者
3. 建立 Custom Integration 並取得 Content API Key
4. 將 API Key 設定為 GitHub Secrets：
   - `GHOST_URL`：Ghost 內部 URL 或公開 URL
   - `GHOST_CONTENT_API_KEY`：Content API Key

### 4. 觸發首次建置

```bash
./scripts/rebuild-frontend.sh
# 或在 GitHub Actions 頁面手動觸發 "Build Frontend" workflow
```

### 5. 啟動前端

等待 GitHub Actions 完成建置推送 image 後：

```bash
docker compose -f docker-compose-app.yml up -d astro
```

## 日常操作

### 發布新文章後更新前端

在 Ghost 後台發文後，需觸發前端重建：

```bash
# 手動觸發
./scripts/rebuild-frontend.sh

# 或等待自動排程（每 6 小時）
```

### 拉取最新 image

```bash
docker compose -f docker-compose-app.yml pull astro
docker compose -f docker-compose-app.yml up -d astro
```

### 備份資料庫

```bash
./scripts/backup-db.sh
```

## 故障排除

### 檢查服務狀態

```bash
docker compose -f docker-compose-app.yml ps
docker compose -f docker-compose-app.yml logs ghost
docker compose -f docker-compose-app.yml logs astro
```

### Ghost CMS 無法存取

確認 Ghost 容器在 `gemini_internal` network 上，且容器名為 `ghost`（Nginx 設定中使用此名稱解析）。

### 前端顯示 502 Bad Gateway（/cms/）

Ghost 容器可能尚未啟動完成。檢查 Ghost 健康狀態：

```bash
docker inspect --format='{{.State.Health.Status}}' ghost
```
