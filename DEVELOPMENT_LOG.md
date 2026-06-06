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
