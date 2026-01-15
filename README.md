# CoinPulse - 实时加密货币监控平台

CoinPulse 是一款基于 Next.js 16 和 React 19 构建的高性能加密货币监控平台。它利用 CoinGecko API 提供实时的市场数据、趋势分析以及交互式的 K 线图表，致力于为用户提供极致流畅的数字化资产监控体验。

## 🚀 核心特性

- **实时行情监控**：集成 CoinGecko API，获取全球加密货币的实时价格、市值及 24h 涨跌幅。
- **专业级 K 线图表**：基于 `lightweight-charts` 实现的交互式行情图表，支持多时间周期（1D, 1W, 1M等）切换。
- **智能趋势发现**：自动筛选全网热门（Trending）货币，捕捉市场热点。
- **分类探索**：支持按货币类别进行深度探索，并提供多维度的排序筛选功能。
- **极致响应速度**：全面应用 Next.js 16 服务端渲染 (SSR) 与并发渲染特性，确保复杂数据下的流畅交互。

## 🛠️ 技术栈

- **框架**: Next.js 16.1.2 (App Router)
- **核心**: React 19 (Concurrent Mode)
- **样式**: Tailwind CSS 4
- **图表**: Lightweight Charts
- **图标**: Lucide React
- **语言**: TypeScript
- **数据源**: CoinGecko API

## 📦 快速开始

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd coinpulse
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
在根目录创建 `.env.local` 文件并配置你的 API Key：
```env
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=你的API_KEY
```

### 4. 启动开发服务器
```bash
npm run dev
```
打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目亮点与优化

### 1. 极致的异步加载与用户体验 (UX) 优化
- **骨架屏 (Skeleton) 预热**：通过在 `app/page.tsx` 中使用 `Suspense` 结合自定义的 `fallback` 组件，实现了首屏结构的秒开体验，彻底解决了页面加载时的布局抖动 (CLS)。
- **原子级加载态控制**：针对高频请求的图片和复杂图表，封装了 `ImageWithSpinner` 组件。利用 `onLoad` 回调与绝对定位技术，确保了在图片下载期间提供实时的视觉反馈，消除了由于网络波动导致的“图片留白”现象。
- **并发渲染策略**：在 `CandlestickChart` 中应用 React 18 的 `useTransition` Hook。将图表数据更新标记为“非紧急任务”，避免了在频繁切换时间周期时阻塞 UI，保持了页面的流畅交互。

### 2. 高效的静态资源管理
- **Next.js 图像引擎深度集成**：通过配置 `next.config.ts` 中的 `remotePatterns`，废弃了原有的 `unoptimized` 模式，转而利用 Next.js 自带的图像优化服务进行 WebP 转换和自动缩放，大幅降低了首屏带宽消耗。

## 大厂标准下的进阶改进方向

虽然目前的处理已经达到了中高级前端的水平，但若要对标大厂（如字节、蚂蚁、腾讯）的核心业务标准，还需在以下维度进行演进：

- **容错性与韧性 (Resilience)**：
    - **失败回退**：目前 `ImageWithSpinner` 仅处理了加载中。在大厂实践中，必须增加 `onError` 处理，当 CDN 节点故障或图片 404 时，自动切换至占位图 (Placeholder)，防止页面出现裂图。
    - **接口重试**：对于关键的 K 线 API，应结合 `react-query` 或自定义 Hooks 增加指数退避 (Exponential Backoff) 的自动重试机制。

- **极致性能监控 (Observability)**：
    - **Web Vitals 埋点**：手动上报 LCP (最大内容绘制) 和 FID (首次输入延迟) 指标。大厂不仅关注“快”，更关注“线上到底有多快”。
    - **占位图优化**：引入 `blurDataURL` (低质量图片占位)，在正式图片下载前显示高斯模糊效果，进一步提升视觉平滑度。

- **工程化与可维护性**：
    - **Design System 结合**：将 `Spinner` 和 `Skeleton` 进一步抽象为原子组件库的一部分，支持全局的主题定制（如响应式颜色、大小规格）。
    - **网络防御**：利用 `AbortController` 处理竞态条件。例如用户快速切换 1D/1W/1M 时，应自动取消之前的无效请求，节省带宽并防止数据错乱。
