# 智能面试平台 - 项目启动指南 (Startup Guide)

本项目采用前后端分离的架构设计，前端使用 **Next.js + React**，后端使用 **FastAPI + Python**。
在第一次运行项目时，请按照以下步骤分别启动前端和后端服务。

当前实现已包含：账户认证、文档入库、RAG 问答、知识点、题库、错题本、模拟面试、语音 fallback、学习计划和毛玻璃前端工作台。

---

## 🛠️ 1. 后端启动指南 (FastAPI)

后端代码位于 `back/` 目录下。请确保您的电脑上已安装 Python (建议 3.9+ 版本)。

### 步骤一：配置环境变量
1. 进入 `back` 目录。
2. 将目录下的 `.env.example` 文件复制一份，并将新文件重命名为 `.env`。
3. （可选）打开 `.env` 文件，根据本地实际情况修改数据库密码、API Key 等配置。

### 步骤二：创建并激活虚拟环境 (推荐)
为了隔离依赖包，强烈推荐使用 Python 虚拟环境。在终端中（项目根目录下）执行：
```powershell
# 1. 进入后端目录
cd back

# 2. 创建虚拟环境 (名为 venv)
python -m venv venv

# 3. 激活虚拟环境 (Windows PowerShell)
.\venv\Scripts\activate

# (补充说明：如果是 Mac/Linux 系统，激活命令为 source venv/bin/activate)
```
*激活成功后，您的终端命令行前面会出现 `(venv)` 字样。*

### 步骤三：安装依赖包
保持虚拟环境激活状态，运行以下命令安装所需依赖：
```powershell
pip install -r requirements.txt
```

### 步骤四：启动后端服务
依赖安装完成后，运行以下命令启动 FastAPI 服务：
```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- 服务启动后，API 基础地址为：`http://127.0.0.1:8000`
- 您可以在浏览器中访问自带的接口文档：`http://127.0.0.1:8000/docs`

### 数据库初始化
如本机已安装 PostgreSQL，并使用 `postgres / llx123123` 凭证，可运行：
```powershell
python scripts/bootstrap_db.py
```
脚本会创建 `smart_interview_platform` 数据库（如不存在）、尝试启用 pgvector、创建表结构并写入 demo mock 用户。

---

## 💻 2. 前端启动指南 (Next.js)

前端代码位于 `front/` 目录下。请确保您的电脑上已安装 Node.js (建议 18.17+ 版本)。

### 步骤一：安装依赖包
打开一个**新的**终端窗口（不要关闭刚才启动后端的终端），然后执行：
```powershell
# 1. 进入前端目录
cd front

# 2. 安装依赖包 (根据你的习惯也可以使用 yarn 或 pnpm)
npm install
```

### 步骤二：启动开发服务器
依赖安装完成后，运行以下命令启动 Next.js 页面：
```powershell
npm run dev
```

### 步骤三：访问页面
启动成功后，终端会显示类似 `ready started server on 0.0.0.0:3000` 的提示。
- 在浏览器中访问：`http://localhost:3000` 即可看到前端页面。

### 常用验证命令
```powershell
# 后端
cd back
python -m pytest -q
python scripts/smoke_api.py

# 前端
cd front
npx tsc --noEmit
npm run lint
npm run build
```

---

## Docker Compose

也可以在项目根目录使用：
```powershell
docker compose up --build
```

服务包含 frontend、backend、postgres(pgvector)、redis 和 celery_worker。

---

## 💡 常见问题排查

1. **后端提示 `ModuleNotFoundError`**：说明您没有激活虚拟环境就运行了启动命令，或者漏掉了 `pip install -r requirements.txt`。
2. **前端提示端口被占用**：如果 `3000` 端口被其他程序占用，Next.js 可能会自动尝试使用 `3001` 等端口，请注意看终端输出的实际地址。
3. **前端无法安装依赖**：如果 `npm install` 速度过慢或卡住，可以尝试更换淘宝镜像源：`npm config set registry https://registry.npmmirror.com`。
