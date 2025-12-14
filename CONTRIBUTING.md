# 贡献指南

感谢你对本项目的关注！我们欢迎任何形式的贡献。

## 如何贡献

### 报告问题

如果你发现了bug或有功能建议，请通过以下方式反馈：

1. 查看 [Issues](https://github.com/SanTanHaiHui/smart_reply_on_wechat/issues) 确认问题是否已存在
2. 如果不存在，创建新的 Issue，并包含：
   - 清晰的问题描述
   - 复现步骤
   - 预期行为 vs 实际行为
   - 环境信息（微信开发者工具版本、小程序基础库版本等）

### 提交代码

1. **Fork 项目**
   ```bash
   git clone https://github.com/SanTanHaiHui/smart_reply_on_wechat.git
   cd smart_reply_on_wechat
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **开发与测试**
   - 编写代码
   - 确保代码符合项目规范
   - 测试功能是否正常

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"  # 或 "fix: 修复bug"
   git push origin feature/your-feature-name
   ```

5. **创建 Pull Request**
   - 在 GitHub 上创建 Pull Request
   - 填写清晰的 PR 描述，说明：
     - 改动内容
     - 为什么需要这个改动
     - 如何测试

## 代码规范

### 命名规范

- **文件命名**：使用小写字母和连字符，如 `reply-options`
- **变量命名**：使用驼峰命名，如 `userInput`
- **常量命名**：使用大写字母和下划线，如 `MAX_LENGTH`

### 代码风格

- 使用 2 个空格缩进
- 使用单引号（JavaScript）
- 在函数和类之间添加空行
- 添加必要的注释，特别是复杂逻辑

### Commit 信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整（不影响功能）
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具链相关

示例：
```
feat: 添加图片识别功能
fix: 修复JSON解析失败的问题
docs: 更新README配置说明
```

## 开发环境设置

1. 安装微信开发者工具
2. 配置 API 密钥（参考 README.md）
3. 在开发者工具中打开项目
4. 开始开发

## 测试

在提交 PR 前，请确保：

- [ ] 代码可以正常编译
- [ ] 功能测试通过
- [ ] 没有引入新的错误或警告
- [ ] 代码符合项目规范

## 问题反馈

如果你在贡献过程中遇到任何问题，欢迎：

- 在 Issues 中提问
- 联系项目维护者

再次感谢你的贡献！🎉

