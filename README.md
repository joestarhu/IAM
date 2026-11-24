# IAM
Identify Access Management 

# 初始化项目
<!-- 前端文件 -->
npx shadcn@latest init -t vite  --pointer --name frontend

<!-- 后端文件 -->
uv init backend --app --no-package --python 3.14

# 移除多余的.git
find backend frontend -name .git -type d
