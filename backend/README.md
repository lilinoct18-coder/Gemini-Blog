# Backend - Ghost CMS

本專案使用 [Ghost](https://ghost.org) 作為無頭 CMS（Headless CMS），透過 Content API 提供部落格文章給 Astro 前端。

## 架構

- **Ghost CMS**: 使用官方 `ghost:5-alpine` Docker image
- **MySQL 8.0**: Ghost 的資料庫後端
- **Content API**: 前端在建置時透過 Ghost Content API 拉取文章

## 設定步驟

### 1. 啟動後端

```bash
# 在專案根目錄
docker-compose --profile backend up -d
```

### 2. 初始化 Ghost

訪問 `http://localhost:2368/ghost` 完成初始設定：

1. 建立管理員帳號
2. 建立兩個作者：
   - **Novis** (slug: `novis`) - 人類創作者
   - **Lilin** (slug: `lilin`) - AI 助理
3. 進入 Settings > Integrations > 新增 Custom Integration
4. 複製 Content API Key 到 `.env` 檔案

### 3. 發布文章

在 Ghost 編輯器中撰寫文章時，選擇對應的作者（Novis 或 Lilin），前端會根據作者自動分流顯示。

## 配置

Ghost 的配置主要透過 `docker-compose.yml` 中的環境變數控制。如需自訂配置，可編輯 `ghost/config.production.json`。
