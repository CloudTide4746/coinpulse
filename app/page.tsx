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
  CoinOverviewSkeleton,
  TrendingCoinsSkeleton,
} from "@/components/home/fallback";

const fakeData: TrendingCoin[] = [
  {
    item: {
      id: "bitcoin",
      coin_id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      market_cap_rank: 1,
      thumb: "/bitcoin.png",
      small: "/bitcoin.png",
      large: "/bitcoin.png",
      slug: "bitcoin",
      price_btc: 1,
      score: 0,
      data: {
        price: 29225.0,
        price_btc: "1",
        price_change_percentage_24h: {
          usd: 2.5,
        },
        market_cap: "$500B",
        market_cap_btc: "19M",
        total_volume: "$30B",
        total_volume_btc: "1M",
        sparkline: "",
        content: null,
      },
    },
  },
  {
    item: {
      id: "ethereum",
      coin_id: 2,
      name: "Ethereum",
      symbol: "ETH",
      market_cap_rank: 2,
      thumb: "/bitcoin.png",
      small: "/bitcoin.png",
      large: "/bitcoin.png",
      slug: "ethereum",
      price_btc: 0.05,
      score: 1,
      data: {
        price: 1850.0,
        price_btc: "0.06",
        price_change_percentage_24h: {
          usd: -1.2,
        },
        market_cap: "$200B",
        market_cap_btc: "7M",
        total_volume: "$15B",
        total_volume_btc: "500K",
        sparkline: "",
        content: null,
      },
    },
  },
];

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
      <section className='mt-7 w-full space-y-4'>
        <p className='text-xl font-bold'>Categories</p>
      </section>
    </main>
  );
};
export default page;
