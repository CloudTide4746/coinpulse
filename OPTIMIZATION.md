# 首页性能与骨架屏显示优化方案

根据您描述的问题（页面缓慢时骨架屏不显示，货币图片逐个缓慢加载），经过对代码的分析，主要原因如下：

1.  **`Categories` 组件的加载机制问题**：`Categories` 是一个客户端组件 (`use client`)，数据是在组件挂载后通过 `useEffect` 获取的。`app/page.tsx` 中的 `Suspense` 只能等待服务端组件的渲染，无法感知客户端组件内部的数据请求。因此 `Suspense` 的 fallback（骨架屏）会瞬间消失，导致用户先看到空表格，然后数据回来后图片逐个加载。
2.  **图片未优化**：代码中大量使用了 `next/image` 的 `unoptimized` 属性或普通的 `<img>` 标签，导致图片没有经过 Next.js 的优化（压缩、格式转换），文件体积大，加载慢。

以下是不破坏现有代码结构的可行解决方案：

## 方案一：在 Categories 组件内部控制骨架屏（推荐优先实施）

既然 `Categories` 是客户端获取数据，我们需要在组件内部根据 `loading` 状态来显示骨架屏，而不是依赖外部的 `Suspense`。

**操作步骤：**

1.  打开 `components/home/Catagories.tsx`。
2.  引入 `CategoriesSkeleton`。
3.  在渲染逻辑中，如果 `loading` 为 `true`，则返回骨架屏。

**代码修改示例：**

```tsx
// components/home/Catagories.tsx

// 1. 引入骨架屏组件
import { CategoriesSkeleton } from "@/components/home/fallback"; 

function Categories() {
  // ... 现有的 state 定义 ...
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategoriesData = async () => {
      setLoading(true); // 开始加载
      const res = await fetcher<Category[]>("/coins/categories", {
        order: selectCategoryOrder.value,
      });
      // ... 处理数据 ...
      
      setLoading(false); // 加载完成
    };

    getCategoriesData();
  }, [selectCategoryOrder]);

  // ... handlePageChange ...

  // 2. 启用 Loading 判断（取消注释并修改）
  if (loading) {
      return <CategoriesSkeleton />;
  }

  return (
    // ... 现有的 JSX ...
  );
}
```

## 方案二：优化图片加载速度

解决图片“一点一点加载”且速度慢的问题。

### 1. 优化 `Categories` 组件的图片
目前使用的是普通的 `<img>` 标签，建议替换为 `next/image` 以利用 Next.js 的图片优化功能。

**操作步骤：**
在 `components/home/Catagories.tsx` 中：

```tsx
// 引入 Image
import Image from "next/image";

// ... 在 map 循环中替换 img ...
{category.top_3_coins.map((coinUrl, i) => (
  <div key={i} className="relative h-7 w-7 rounded-full border-2 border-[#1e2329] bg-gray-800 overflow-hidden">
      <Image
        src={coinUrl}
        alt="coin"
        fill // 使用 fill 填充父容器
        sizes="28px"
        className="object-cover"
      />
  </div>
))}
```
*注意：使用 `fill` 需要父容器有 `relative` 定位和固定宽高。或者直接使用 `width={28} height={28}`。*

### 2. 优化 `TrendingCoins` 和 `CoinOvervie`
去除 `unoptimized` 属性，让 Next.js 自动压缩和调整图片大小。

**操作步骤：**

*   **`components/home/TrendingCoins.tsx`**:
    ```tsx
    <Image
      src={item.large}
      alt={item.name}
      width={36}
      height={36}
      // unoptimized  <-- 删除这一行
    />
    ```

*   **`components/home/CoinOvervie.tsx`**:
    ```tsx
    <Image
      src={coin.image.large}
      alt={coin.name}
      width={64}
      height={64}
      // unoptimized  <-- 删除这一行
      className='rounded-full'
    />
    ```

## 方案三：服务端组件重构（进阶）

为了让 `app/page.tsx` 中的 `Suspense` 真正起作用，最佳实践是将 `Categories` 的数据获取移到服务端。但考虑到您要求“不要动我的代码”，这个方案涉及较大改动（需要拆分交互组件和列表组件），仅供参考。

**思路：**
1.  创建一个 Server Component `CategoriesList` 负责 fetch 数据。
2.  创建一个 Client Component `CategoriesFilter` 负责下拉筛选。
3.  在 `page.tsx` 中组合它们，并用 `Suspense` 包裹 `CategoriesList`。

---

**总结建议：**
请先执行 **方案一** 和 **方案二**。这将直接解决“骨架屏不显示”和“图片加载慢”的问题，且对代码改动最小。
