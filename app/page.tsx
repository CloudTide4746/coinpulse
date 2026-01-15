/** @format */

import Image from "next/image";
import React, { Suspense } from "react";
import DataTable from "@/components/DataTable";
import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { CoinDetailsData, DataTableColumn, TrendingCoin } from "@/types";
import { fetcher } from "@/lib/coingecko.actions";
import CoinOvervie from "@/components/home/CoinOvervie";
import TrendingCoins from "@/components/home/TrendingCoins";
import {
  CategoriesSkeleton,
  CoinOverviewSkeleton,
  TrendingCoinsSkeleton,
} from "@/components/home/fallback";
import Categories from "@/components/home/Catagories";

const page = async () => {
  // 两个await函数同时调用，就会导致速度减慢
  // console.log(trendingCoins);
  // console.log(coin);
  // if (!coin) return null;

  return (
    <main className='main-container py-8'>
      <section className='home-grid grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='h-[600px] lg:col-span-2'>
          <Suspense fallback={<CoinOverviewSkeleton />}>
            <CoinOvervie />
          </Suspense>
        </div>
        <div className='h-[600px] lg:col-span-1'>
          <Suspense fallback={<TrendingCoinsSkeleton />}>
            <TrendingCoins />
          </Suspense>
        </div>
      </section>
      {/* 这里将来放置真正的 Categories 组件 */}
      <section className='mt-7 w-full space-y-4'>
        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories></Categories>
        </Suspense>
      </section>
    </main>
  );
};
export default page;
