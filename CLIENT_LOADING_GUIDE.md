# 图片与图表加载状态优化指南

既然您希望保留现有的 `Promise.all` 结构，并且希望解决“图片和图表加载时的转圈圈”问题，这通常属于 **客户端渲染状态管理** 的范畴。

以下是不改动您原有业务逻辑，仅增加“转圈圈”效果的组件化方案。

## 1. 优化图片加载 (ImageWithSpinner)

Next.js 的 `Image` 组件提供了 `onLoad` 回调，我们可以利用它来控制 Loading 状态。

### 新建组件: `components/ui/ImageWithSpinner.tsx`

这个组件可以用来替换原有的 `Image` 组件。

```tsx
"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner"; // 之前创建的 Spinner

interface ImageWithSpinnerProps extends ImageProps {
  containerClassName?: string;
}

export const ImageWithSpinner = ({
  className,
  containerClassName,
  alt,
  ...props
}: ImageWithSpinnerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", containerClassName)}>
      {/* 1. Loading 状态下显示 Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-800/50">
          <Spinner size={20} />
        </div>
      )}

      {/* 2. 图片组件 */}
      <Image
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100", // 加载完成前透明
          className
        )}
        alt={alt}
        onLoad={() => setIsLoading(false)} // 关键：加载完成后关闭 Loading
        {...props}
      />
    </div>
  );
};
```

### 如何使用

在 `CoinOvervie.tsx` 中：

```tsx
import { ImageWithSpinner } from "@/components/ui/ImageWithSpinner";

// ...
<ImageWithSpinner
  src={coin.image.large}
  alt={coin.name}
  width={64}
  height={64}
  containerClassName="rounded-full h-16 w-16 bg-gray-800" // 确保容器有背景色
/>
```

---

## 2. 优化图表加载 (ChartWithLoading)

`CandlestickChart` 是一个客户端组件。虽然数据已经传进去了，但 `lightweight-charts` 初始化和渲染 DOM 需要时间（尽管很短），或者如果您未来在内部进行异步操作（如切换周期）。

### 修改建议：在 `CandlestickChart.tsx` 内部增加 Loading 遮罩

您不需要新建文件，直接修改 `components/home/CandlestickChart.tsx` 即可。

**修改思路：**
1.  定义 `isChartReady` 状态，默认为 `false`。
2.  在 `useEffect` 中图表创建完毕后，设置 `isChartReady(true)`。
3.  在 JSX 中根据状态显示遮罩。

**代码参考：**

```tsx
// components/home/CandlestickChart.tsx

// ... imports 保持不变
import { Spinner } from "@/components/ui/Spinner"; // 引入 Spinner

const CandlestickChart = ({ ...props }) => {
  // ... 现有代码 ...
  
  // 1. 新增状态
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // ... createChart 逻辑 ...

    // 2. 关键：图表初始化完成后，标记为 Ready
    // 可以加一个小延时让过渡更自然，或者直接设置
    requestAnimationFrame(() => {
        setIsChartReady(true);
    });

    return () => {
      // ... cleanup ...
    };
  }, [height, ohlcData, period]); // 依赖项保持不变

  return (
    <div className='flex h-full w-full flex-col gap-4 relative'> {/* relative 用于定位遮罩 */}
       
       {/* ... 顶部按钮区域 ... */}

       {/* 3. 图表容器 */}
       <div ref={chartContainerRef} className="relative w-full flex-1">
          {/* Loading 遮罩：当 !isChartReady 或者 isPending (切换周期) 时显示 */}
          {(!isChartReady || isPending) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1e2329]/80 backdrop-blur-sm transition-opacity">
               <Spinner size={40} />
            </div>
          )}
       </div>
    </div>
  );
};
```

## 总结

1.  **图片转圈**：使用 `ImageWithSpinner` 包装组件，监听 `onLoad` 事件。
2.  **图表转圈**：在 `CandlestickChart` 内部利用 `useState` 和 `useEffect` 控制初始化完成的状态，并在切换周期时利用 `useTransition` 的 `isPending` 状态显示转圈。

这样既保留了您现有的 `Promise.all` 数据获取结构，又解决了视觉上的“加载卡顿”或“空白等待”问题。
