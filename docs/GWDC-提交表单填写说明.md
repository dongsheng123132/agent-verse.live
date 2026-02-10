# GWDC Hackathon 提交表单填写说明

针对 **GWDC Hackathon Submission Portal** 各字段的填写指引（以 AgentVerse Live 项目为例）。

---

## 表单字段说明

### Project Name *（必填）

- **含义**：项目名称。
- **建议填写**：`AgentVerse Live` 或 `AgentVerse Live - AI 春晚 · Conflux 跨境打赏与红包`。
- **注意**：不要留空，否则无法提交。

---

### Chain *（必选）

- **含义**：项目所基于的链。
- **选项**：Conflux / Pharos / Tron。
- **建议选择**：**Conflux**（项目基于 Conflux eSpace）。

---

### GitHub Open Source Repository *

- **含义**：项目开源仓库的 GitHub 链接。
- **建议填写**：  
  若本仓库已开源，填仓库地址，例如：  
  `https://github.com/你的用户名/agentverse-live`  
  若尚未开源，先创建 GitHub 仓库并 push 代码，再填该地址。
- **注意**：需为可公开访问的 URL，不要带多余空格。

---

### Demo Video URL (<3 min) *

- **含义**：演示视频链接，时长需 **小于 3 分钟**。
- **建议**：
  - 录制内容：产品网站/活动页操作流程（打赏、领红包、Conflux 钱包连接等）。
  - 上传到：YouTube / Bilibili / 腾讯视频等，设置「公开」或「知道链接可看」。
  - 填写：视频播放页的完整 URL（如 `https://www.youtube.com/watch?v=xxx`）。
- **注意**：时长控制在 3 分钟以内，否则可能不符合要求。

---

### Product Website URL *

- **含义**：产品/项目官网或演示页链接。
- **建议填写**：  
  若有正式站点，填官网（如 `https://agent-verse.live`）；  
  若为演示环境，填可公开访问的演示页 URL（如 Vercel / Netlify 部署的预览链接）。

---

### Pitch Deck URL (<3 pages) *

- **含义**：Pitch 演示文稿链接，页数需 **少于 3 页**（或按主办方要求理解为「≤3 页」）。
- **建议**：
  1. 使用 `docs/GWDC-Pitch-Deck-Content.md` 中的三页内容（封面 + 场景与方案 + 技术要点与规划）制作 PPT/PDF。
  2. 导出为 PDF 或上传到 Google Drive / 语雀 / Notion，设置「知道链接者可查看」。
  3. 将**该可查看链接**填入本栏。
- **注意**：此栏为必填；总页数控制在 3 页内，避免超出「<3 pages」限制。

---

## 填写检查清单

提交前可自检：

- [ ] **Project Name**：已填且与项目一致  
- [ ] **Chain**：已选 Conflux  
- [ ] **GitHub**：链接可打开、仓库为开源  
- [ ] **Demo Video**：链接可播放、时长 <3 min  
- [ ] **Product Website**：链接可访问  
- [ ] **Pitch Deck**：链接可打开、页数 ≤3 页  

---

## 与本仓库的对应关系

| 表单字段           | 本仓库可参考内容 |
|--------------------|------------------|
| Project Name       | 项目名称，如 AgentVerse Live |
| Pitch Deck 内容    | `docs/GWDC-Pitch-Deck-Content.md` |
| 技术/合约说明      | `docs/SMART_CONTRACT_DEPLOY.md`、`docs/TECH-Conflux-PayFi.md` |
| 产品/业务说明      | `docs/PRD-Conflux-PayFi.md` |

按上述说明逐项填写并保存链接，即可完成 GWDC Hackathon 提交。
