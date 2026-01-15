# CoinOverview 异步加载优化指南

您目前的 `CoinOvervie` 组件使用了 `Promise.all` 同时等待 **币种详情** 和 **K线数据**。这会导致只有当两份数据都准备好时，组件才会渲染。如果 K 线数据加载较慢，整个组件（包括顶部的币种名称和价格）都会被阻塞。

为了实现 **"优先显示币种信息，图表区域显示加载转圈"** 的效果，建议将组件拆分为两部分，并利用 React 的 `Suspense` 边界。

## 1. 现有结构 (阻塞式)

```tsx
// CoinOvervie.tsx
const CoinOvervie = async () => {
  // 两个请求必须都完成，用户才能看到任何东西
  const [coin, coinOHLCData] = await Promise.all([fetchCoin, fetchOHLC]);
  
  return (
    <div>
      <Header coin={coin} />
      <Chart data={coinOHLCData} />
    </div>
  )
}
```

## 2. 建议结构 (流式渲染)

我们把 **K线图表及其数据获取逻辑** 提取到一个单独的服务端组件中。

### 第一步：新建 `CoinChartWrapper.tsx` (或者放在同一个文件里)

这个组件专门负责获取 K 线数据并渲染图表。

```tsx
// components/home/CoinChartWrapper.tsx
import { fetcher } from "@/lib/coingecko.actions";
import CandlestickChart from "./CandlestickChart";
import { Spinner } from "@/components/ui/Spinner"; // 刚才创建的转圈组件

// 这是一个异步服务端组件
export default async function CoinChartWrapper({ coinId }: { coinId: string }) {
  // 这里只获取 K 线数据
  const coinOHLCData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
    vs_currency: "usd",
    days: "1",
    precision: "full",
  });

  if (!coinOHLCData) {
    return <div className="text-gray-500">暂无图表数据</div>;
  }

  return (
    <CandlestickChart
      data={coinOHLCData}
      coinId={coinId}
    />
  );
}
```

### 第二步：修改 `CoinOvervie.tsx`

修改后的主组件只负责获取基础信息（速度快），并使用 `Suspense` 包裹图表组件。

```tsx
// components/home/CoinOvervie.tsx
import { Suspense } from "react";
import { fetcher } from "@/lib/coingecko.actions";
import { CoinDetailsData } from "@/types";
import { Spinner } from "@/components/ui/Spinner";
import CoinChartWrapper from "./CoinChartWrapper"; // 引入上面的组件
// ... 其他 import

const CoinOvervie = async () => {
  // 1. 只请求基础详情，不等待 OHLC 数据
  const coin = await fetcher<CoinDetailsData>("/coins/bitcoin", {
    dex_pair_format: "symbol",
  });

  if (!coin) return <CoinOverviewSkeleton />;

  return (
    <div className='flex h-full flex-col rounded-2xl bg-[#1e2329] p-8 shadow-sm'>
      {/* 头部信息会立即显示 */}
      <div className='flex items-center gap-4'>
         {/* ... 保持您原有的 Header 代码不变 ... */}
      </div>

      {/* 图表区域：在数据加载时显示转圈 */}
      <div className='mt-8 flex w-full flex-1 items-center justify-center'>
        <Suspense 
          fallback={
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Spinner size={32} />
              <span className="text-sm">图表加载中...</span>
            </div>
          }
        >
          {/* 将 coinId 传给子组件，让它去请求数据 */}
          <CoinChartWrapper coinId="bitcoin" />
        </Suspense>
      </div>
    </div>
  );
};

export default CoinOvervie;
```

## 核心原理

1.  `CoinOvervie` 不再等待 `ohlc` 数据，所以它能更快渲染出 HTML。
2.  当 React 渲染到 `Suspense` 时，如果 `CoinChartWrapper` 还在请求数据，它会先展示 `fallback` 里的内容（即转圈圈）。
3.  当 `CoinChartWrapper` 数据请求完成，React 会自动把转圈圈替换为真正的图表。

这样您就实现了“API没有完全获取的时候让图表位置转圈圈”的需求，且不影响头部信息的展示。
