# 智能面试平台 - 开发日志 (Development Log)

本文档用于记录智能面试平台在各个开发阶段实现的功能和架构演进。

---

## 阶段一：基础项目骨架搭建
**时间**：2026-06-06
**目标**：初始化前后端分离的项目结构，定义基础技术栈和目录功能划分。

### 1. 前端架构 (front)
前端采用 **Next.js (App Router) + React + TypeScript + Tailwind CSS**。

| 目录/文件 | 作用说明 |
| :--- | :--- |
| `package.json` | 前端项目的核心依赖和脚本配置（记录了 Next.js, React, Tailwind CSS 等依赖）。 |
| `tsconfig.json` | TypeScript 的基础配置文件，规范代码的类型检查。 |
| `tailwind.config.ts` | Tailwind CSS 的样式配置文件，用于配置设计系统（如主题、颜色等）。 |
| `src/app/` | Next.js App Router 的核心路由目录。所有的页面级路由组件都在此组织。 |
| `src/app/layout.tsx` | 应用的全局根布局文件（包含 HTML/Body 标签及全局字体配置）。 |
| `src/app/page.tsx` | 系统的首页入口文件，目前实现了一个包含“上传资料”与“模拟面试”按钮的欢迎页面。 |
| `src/app/globals.css` | 全局 CSS 样式文件，主要用于引入 Tailwind 基础指令和全局 CSS 变量配置。 |
| `src/components/` | **[预留]** 通用的 UI 组件库（未来接入 shadcn/ui 及自定义组件库会放在这里）。 |
| `src/lib/` | **[预留]** 工具函数目录，用于存放诸如 API 封装、数据格式化等通用的业务无关代码。 |

### 2. 后端架构 (back)
后端采用 **FastAPI**，使用清晰的分层架构以便于后续功能解耦和横向扩展。

| 目录/文件 | 作用说明 |
| :--- | :--- |
| `requirements.txt` | 后端项目的核心依赖列表（记录了 FastAPI, SQLAlchemy, Redis, Celery 等）。 |
| `app/main.py` | FastAPI 应用程序的启动入口点，包含了 CORS 中间件配置和基础测试路由。 |
| `app/core/config.py` | 核心配置模块，基于 `pydantic-settings` 来管理系统的环境变量和通用配置项（如 API 前缀、CORS 等）。 |
| `app/api/` | **[预留]** API 路由目录。未来这里会按业务模块（如 `endpoints/users.py`, `endpoints/interview.py`）拆分具体的路由层代码。 |
| `app/db/` | **[预留]** 数据库配置目录。用于管理 PostgreSQL 连接引擎、连接池及 SQLAlchemy 的 Session 会话生成。 |
| `app/models/` | **[预留]** 数据库模型目录。用于存放 SQLAlchemy 或 SQLModel 定义的数据表映射类。 |
| `app/services/` | **[预留]** 核心业务逻辑层目录。复杂的业务逻辑（如 PDF 解析流程、调用大模型 API 生成题目等）都封装在此，供路由层调用。 |

---

*(后续阶段功能开发将继续在下方追加记录...)*

---

## 阶段二：后端基础、数据库模型与账户安全模块
**时间**：2026-06-07
**提交**：`2de9686 feat: implement backend auth and database foundation`
**目标**：建立后端核心运行基础，完成用户注册、登录、JWT 鉴权、学习档案读写和数据库初始化能力。

### 核心功能
- 实现 `/api/v1/auth/register`、`/api/v1/auth/login`、`/api/v1/users/me`、`/api/v1/users/profile`。
- 注册时校验重复用户名/邮箱，使用 bcrypt 方案加密密码，并自动创建默认学习档案。
- 登录成功后返回 JWT Bearer Token，受保护接口通过 Authorization Header 获取当前用户。
- 建立用户、档案、文档、chunk、embedding、问答、知识点、题库、面试、语音、错题和学习计划的 SQLAlchemy ORM 基础模型。
- 新增 `scripts/bootstrap_db.py`，支持本地 PostgreSQL 建库、尝试启用 pgvector、建表和植入 `demo@example.com` mock 用户；测试环境支持 SQLite 路径验证。

### 核心代码
- `back/app/core/config.py`：集中管理 PostgreSQL、JWT、上传限制、存储路径和模型服务密钥配置。
- `back/app/core/security.py`：封装密码哈希、密码校验、JWT 创建和解析。
- `back/app/db/session.py`：提供 SQLAlchemy `Base`、engine、Session 和 `init_db`。
- `back/app/models/entities.py`：定义平台核心数据表与索引。
- `back/app/api/auth.py`、`back/app/api/users.py`、`back/app/api/deps.py`：实现认证、用户档案和鉴权依赖。
- `back/tests/test_auth_profile.py`：覆盖注册、重复邮箱、登录、当前用户和档案更新。

### 使用技术
- FastAPI、Pydantic v2、SQLAlchemy 2、PostgreSQL/SQLite 测试替身、python-jose、passlib+bcrypt、pytest、FastAPI TestClient。
- bcrypt 版本锁定为 `>=4.0.1,<4.1.0`，避免 passlib 与新版 bcrypt 的兼容告警和哈希失败。

### 自测记录
- `python -m pytest -q`：4 passed，存在 python-jose 的 UTC deprecation warning，不影响当前功能。
- `DATABASE_URL=sqlite:///./bootstrap_test.db python scripts/bootstrap_db.py`：建表与 mock seed 路径通过。

---

## 阶段三：PDF 文档入库与 Chunk 预览模块
**时间**：2026-06-07
**提交**：`3cf297c feat: implement document ingestion module`
**目标**：完成用户上传 PDF、解析文本、清洗标题、切分 chunk、生成本地 embedding、查看 chunk 和删除文档的闭环。

### 核心功能
- 实现 `/api/v1/documents/upload`、`GET /api/v1/documents`、`GET /api/v1/documents/{id}`、`GET /api/v1/documents/{id}/chunks`、`POST /api/v1/documents/{id}/reindex`、`DELETE /api/v1/documents/{id}`。
- 上传接口限制 PDF 文件名和 MIME 类型，并按用户隔离保存到后端 `storage/documents/{user_id}/`。
- 使用 PyMuPDF 解析 PDF 页文本，保留页码，生成入库质量报告。
- 实现文本清洗、中文章节/小节标题识别、chunk 切分、关键词提取和 deterministic embedding。
- 删除文档时同步删除 chunk、embedding 和本地文件，避免继续参与后续检索。

### 核心代码
- `back/app/api/documents.py`：文档上传、列表、详情、chunk 预览、reindex 占位和删除 API。
- `back/app/services/pdf_parser_service.py`：PDF 页文本解析。
- `back/app/services/text_cleaner_service.py`：清洗文本、识别标题、提取计算机基础关键词。
- `back/app/services/chunk_service.py`：按标题/段落/长度生成 chunk 和 embedding_text。
- `back/app/services/embedding_service.py`：本地 deterministic embedding，用于无模型 Key 时的可测 fallback。
- `back/app/services/document_service.py`：文档入库、质量报告、用户隔离查询和删除级联。
- `back/tests/test_documents.py`：覆盖清洗、标题识别、chunk metadata、PDF 上传、非法文件拒绝和删除。

### 使用技术
- FastAPI UploadFile/Form、PyMuPDF、SQLAlchemy、后端本地文件系统、JSON metadata、pytest。
- 当前版本同步完成解析和索引，后续可将 `create_indexed_document` 投递到 Celery 异步任务。

### 自测记录
- `python -m pytest -q`：9 passed；仍有 python-jose UTC deprecation warning。
- 测试会生成临时 SQLite DB 和 storage 文件，提交前已清理运行产物。

---

## 阶段四：RAG 智能问答与检索调试模块
**时间**：2026-06-07
**提交**：`04c3b44 feat: implement rag chat module`
**目标**：实现用户基于个人资料进行问答、返回引用来源、低置信度拒答和检索结果查看。

### 核心功能
- 实现 `/api/v1/chat/sessions` 会话创建/列表/详情。
- 实现 `/api/v1/chat/sessions/{id}/messages`，保存用户问题和助手回答。
- 检索过程强制使用当前用户 ID，并支持会话 subject 和 document_scope 过滤。
- 使用关键词重叠作为本地 fallback 检索分数，按分数排序并返回 Top K chunk。
- 当检索分数不足时返回“资料不足”提示，避免编造来源。
- 实现 `/api/v1/chat/messages/{id}/retrieved-chunks`，用于用户查看本次问答引用的 chunk。

### 核心代码
- `back/app/api/chat.py`：问答会话、消息提交和检索调试 API。
- `back/app/services/retriever_service.py`：用户隔离检索、tokenize、subject/document 过滤和分数计算。
- `back/app/services/rag_service.py`：基于检索 chunk 生成 deterministic RAG 回答、面试回答版本、追问和 citations。
- `back/app/schemas/chat.py`：Chat session、question、answer 和 retrieved chunk 响应模型。
- `back/tests/test_chat.py`：覆盖引用回答、debug chunks 和低置信度拒答。

### 使用技术
- FastAPI、SQLAlchemy、Pydantic、用户隔离查询、确定性 RAG fallback、pytest。
- 当前检索为轻量 keyword/vector-like fallback，后续可替换为 pgvector + rerank 模型。

### 自测记录
- `python -m pytest -q`：11 passed；仍有 python-jose UTC deprecation warning。
