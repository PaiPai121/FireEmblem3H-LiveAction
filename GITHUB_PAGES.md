# GitHub Pages 发布说明

这个仓库已经有根目录静态页：

- `index.html`
- `site/data.js`
- `site/app.js`
- `site/styles.css`

发布到 GitHub Pages 时，建议使用：

1. 打开仓库的 Settings。
2. 进入 Pages。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/ (root)`。
5. 保存后等待 Pages 构建完成。

必须选择根目录发布，因为网页直接引用仓库已有的 `assets/`、`episodes/`、`production/` 路径。如果改成 `/docs` 发布，需要额外复制这些素材目录。

本地检阅可以直接打开 `index.html`。新增素材后，需要同步更新 `site/data.js` 里的清单，浏览器页面才会显示新条目。
